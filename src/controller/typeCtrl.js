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
        try {
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
            const deleteGall = await Type.findByIdAndDelete(id)
            if(!deleteGall){
                return res.status(400).send({message: 'Type not found'})
            }
            res.status(200).send({message: 'Type deleted', deleted: deleteGall})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    update: async (req, res) => {
        const {id} = req.params
        if(!id){
            return res.status(403).json({message: 'insufficient information'})
        }
        try {
            const updateType = await Type.findById(id)
            if(!updateType){
                return res.status(400).send({message: 'Type not found'})
            }
            const newType = await Type.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', newType})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
}

module.exports = typeCtrl