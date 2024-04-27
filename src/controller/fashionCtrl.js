const cloudinary = require('cloudinary')
const mongoose = require('mongoose')
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

const Fashion = require("../model/fashionModel")

const fashionCtrl = {
    add: async (req, res) => {
        try {
            if (req.files) {
                let images = [];
                const {image} = req.files;
                if (image.length > 0) {
                    for (const img of image) {
                        const format = img.mimetype.split('/')[1];
                        if (format !== 'png' && format !== 'jpeg') {
                            return res.status(403).json({message: 'File format incorrect'});
                        }
                        const createdImage = await cloudinary.v2.uploader.upload(img.tempFilePath, {
                            folder: 'OLX'
                        });
                        removeTemp(img.tempFilePath);
                        const imag = {public_id: createdImage.public_id, url: createdImage.secure_url};
                        images.push(imag);
                    }
                    req.body.photos = images;
                } else if(image) {
                    const format = image.mimetype.split('/')[1];
                    if (format !== 'png' && format !== 'jpeg') {
                        return res.status(403).json({message: 'File format incorrect'});
                    }
                    const createdImage = await cloudinary.v2.uploader.upload(image.tempFilePath, {
                        folder: 'OLX'
                    });
                    removeTemp(image.tempFilePath);
                    const imag = {public_id: createdImage.public_id, url: createdImage.secure_url};
                    images.push(imag);
                    req.body.photos = images;
                }
            }
            const fashion = new Fashion(req.body)
            await fashion.save()
            res.status(201).json({message: 'new fashion', fashion})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
        
    },
    get: async (req, res) => {
        try {
            const fashions = await Fashion.find()
            res.status(200).json({message: 'All fashions', getAll: fashions})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    getOne: async (req, res) => {
        const { id } = req.params;
        try {
          const getFashion = await Fashion.aggregate([
            {
              $match: { _id: new mongoose.Types.ObjectId(id) },
            },
            {
              $lookup: {
                from: "Fashions",
                let: { authorId: "$authorId" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$authorId", "$$authorId"] } } },
                ],
                as: "userFashion",
              },
            },
            {
              $lookup: {
                from: "fashions",
                let: { authorId: "$authorId" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$authorId", "$$authorId"] } } },
                ],
                as: "userFashion",
              },
            },
            {
              $addFields: {
                userProd: {
                  $concatArrays: ["$userFashion", "$userFashion"],
                },
              },
            },
            {
              $project: {
                userFashion: 0,
                userFashion: 0,
              },
            },
            {
              $lookup: {
                from: "users",
                let: { user: "$authorId" },
                pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$user"] } } }],
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ]);
          if (!getFashion) {
            return res.status(400).send({ message: "Fashion not found" });
          }
          res.status(200).json({ message: "Find Fashion", getOne: getFashion });
        } catch (error) {
          res.status(503).json({ message: error.message });
        }
      },
      delete: async (req, res) => {
        const {id} = req.params
        if(!id){
            return res.status(403).json({message: 'insufficient information'})
        }
        try {
            const deleteFashion = await Fashion.findByIdAndDelete(id)
            if(!deleteFashion){
                return res.status(400).send({message: 'Fashion not found'})
            }
            if(deleteFashion.photos.length > 0){
                deleteFashion.photos.map(async pic => {
                    await cloudinary.v2.uploader.destroy(pic.public_id, async (err) =>{
                        if(err){
                            throw err
                        }
                    })
                })
            }
            res.status(200).send({message: 'Fashion deleted', deleteFashion})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    update: async (req, res) => {
        const {title} = req.body
        const {id} = req.params
        console.log(title, id);
        if(!title || !id){
            return res.status(403).json({message: 'insufficient information'})
        }
        try {
            const updatefashion = await fashion.findById(id)
            if(!updatefashion){
                return res.status(400).send({message: 'fashion not found'})
            }
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
                    if(updatePic.picture){
                        await cloudinary.v2.uploader.destroy(updatePic.picture.public_id, async (err) =>{
                            if(err){
                                throw err
                            }
                        })
                    }
                    const imag = {public_id : imagee.public_id, url: imagee.secure_url}
                    req.body.sub_photos = imag;
                }
                }
            const newfashion = await Fashion.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', newfashion})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    }
}

module.exports = fashionCtrl