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

const Sub = require("../model/subModel")

const subCtrl = {
    add: async (req, res) => {
        const {name} = req.body
        const {token} = req.headers
        try {
            if(!name){
                return res.status(403).json({message: 'Please fill all lines'})
            }
            const sub = new Sub(req.body)
            await sub.save()
            res.status(201).json({message: 'new sub', sub})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
        
    },
    get: async (req, res) => {
        try {
            const subs = await Sub.find()
            res.status(200).json({message: 'All sub categorys', getAll: subs})
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
            const deleteGall = await Sub.findByIdAndDelete(id)
            if(!deleteGall){
                return res.status(400).send({message: 'Sub Category not found'})
            }
            res.status(200).send({message: 'Sub Category deleted', deleted: deleteGall})
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
            const updateSub = await Sub.findById(id)
            if(!updateSub){
                return res.status(400).send({message: 'Sub not found'})
            }
            const newSub = await Sub.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', updated: newSub})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
}

module.exports = subCtrl