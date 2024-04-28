const cloudinary = require('cloudinary')
const bcrypt = require('bcrypt')
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  })

const removeTemp = (pathes) => {
    fs.unlink(pathes, err => {
      if(err){
        throw err
      }
    })
  }

const User = require("../model/userModel")

const userCtl = {
    getUser: async (req, res) => {
        const {id} = req.params
        try {
            const findUser = await User.findById(id);
            if(!findUser){
                return res.status(404).json({message: "User not found"})
            }
            res.status(200).json({message: "Find user", user: findUser})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    getAllUsers: async (req, res) => {
        try {
            let users = await User.find();
            res.status(200).json({message: "All users", users})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    deleteUser: async (req, res) => {
        const {id} = req.params
        try {
            if(id === req.user._id || req.userIsAdmin){
                const deleteUser = await User.findByIdAndDelete(id)
                if(deleteUser){
                    if(deleteUser.profilePicture){
                        await cloudinary.v2.uploader.destroy(deleteUser.profilePicture.public_id, async (err) =>{
                            if(err){
                                throw err
                            }
                        })
                    }
                    return res.status(200).json({message: "User deleted successfully", user: deleteUser})
                }
                return res.status(404).json({message: 'User not found'})
            }
            res.status(405).json({message: 'Acces Denied!. You can delete only your own accout'})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    update: async (req, res) => {
        const {id} = req.params
        try {
            if(id === req.user._id || req.userIsAdmin){
                const updateUser = await User.findById(id)
                if(req.body.password && (req.body.password != "")){
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);
                    req.body.password = hashedPassword;
                } else{
                    delete req.body.password
                }

                if(updateUser){
                    if(req.files){
                        const {image} = req.files;
                        if(image){
                            const format = image.mimetype.split('/')[1];
                            if(format !== 'png' && format !== 'jpeg') {
                                return res.status(403).json({message: 'file format incorrect'})
                            }
                            const imagee = await cloudinary.v2.uploader.upload(image.tempFilePath, {
                                folder: 'OLX'
                            }, async (err, result) => {
                                if(err){
                                    throw err
                                } else {
                                    removeTemp(image.tempFilePath)
                                    return result
                                }
                            })
                            if(updateUser.profilePicture){
                                await cloudinary.v2.uploader.destroy(updateUser.profilePicture.public_id, async (err) =>{
                                    if(err){
                                        throw err
                                    }
                                })
                            }
                            const imag = {public_id : imagee.public_id, url: imagee.secure_url}
                            req.body.profilePicture = imag;
                        }
                        }
                    const user = await User.findByIdAndUpdate(id, req.body, {new: true});
                    return res.status(200).json({message: "User update successfully", user})
                }
                return res.status(404).json({message: "User not found"})
            }
            res.status(405).json({message: 'Acces Denied!. You can delete only your own accout'})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    like: async (req, res) => {
        const {id} = req.params;
        const {prodId} = req.body
        try {
            const user = await User.findById(id);
            if(!user){
                return res.status(404).send({message: "User is Not Found"})
            }
            if(user.likes.includes(prodId)){
                await User.updateOne({$pull: {likes: prodId}})
                const updatedUser = await User.findById(id)
                res.status(200).json({message: "Like lancled", user: updatedUser})
            } else {
                await User.updateOne({$push: {likes: prodId}})
                const updatedUser = await User.findById(id)
                res.status(200).json({message: "Like added", user: updatedUser})
            }
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },


}


module.exports = userCtl