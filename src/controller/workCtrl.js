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

const Work = require("../model/workModel")

const workCtrl = {
    add: async (req, res) => {
        try {
            const work = new Work(req.body)
            await work.save()
            res.status(201).json({message: 'new work', work})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
        
    },
    get: async (req, res) => {
        try {
            const works = await Work.find()
            res.status(200).json({message: 'All works', getAll: works})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    getOne: async (req, res) => {
        const {id} = req.params
        try {
            const getWord = await Work.aggregate([
                {
                  $match: { _id: new mongoose.Types.ObjectId(id) },
                },
                {
                  $lookup: {
                    from: "Works",
                    let: { authorId: "$authorId" },
                    pipeline: [
                      { $match: { $expr: { $eq: ["$authorId", "$$authorId"] } } },
                    ],
                    as: "userWork",
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
                      $concatArrays: ["$userWork", "$userFashion"],
                    },
                  },
                },
                {
                  $project: {
                    userWork: 0,
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
            if(!getWork){
                return res.status(400).send({message: 'Work not found'})
            }
            res.status(200).json({message: 'Find Work', getOne: getWork})
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
            const deleteWork = await Work.findByIdAndDelete(id)
            if(!deleteWork){
                return res.status(400).send({message: 'Work not found'})
            }
            res.status(200).send({message: 'Work deleted', deleteWork})
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
            const updateWork = await Work.findById(id)
            if(!updateWork){
                return res.status(400).send({message: 'work not found'})
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
            const newWork = await Work.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', newWork})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    }
}

module.exports = workCtrl