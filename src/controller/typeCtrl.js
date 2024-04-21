const cloudinary = require('cloudinary')
const fs = require('fs');

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

const Type = require("../model/typeModel")

const typeCtrl = {
    add: async (req, res) => {
        const {name} = req.body
        const {token} = req.headers
        try {
            if(!token){
                return res.status(403).json({message: 'Token is required'})
            }
            if(!name){
                return res.status(403).json({message: 'Please fill all lines'})
            }
            const type = new Type(req.body)
            await type.save()
            res.status(201).json({message: 'new type', type})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
        
    },
    get: async (req, res) => {
        try {
            const types = await Type.find()
            res.status(200).json({message: 'All type categorys', getAll: types})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    delete: async (req, res) => {
        const {id} = req.params
        if(!id){
            return res.status(403).json({message: 'insufficient information'})
        }
        
        try {
            const deleteGall = await Gallary.findByIdAndDelete(id)
            if(!deleteGall){
                return res.status(400).send({message: 'Gallary not found'})
            }
            const deletePic = await Type.findById(id) 
            
            if(deleteGall.length > 0){
                deletePic.map(async pic => {
                    console.log(pic);
                    await cloudinary.v2.uploader.destroy(pic.picture.public_id, async (err) =>{
                        if(err){
                            throw err
                        }
                    })
                })
            }
            await type.deleteMany({gallaryId: id})
            res.status(200).send({message: 'Gallary deleted', deleteGall})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
}

module.exports = typeCtrl