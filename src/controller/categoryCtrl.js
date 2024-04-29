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

const Category = require("../model/categoryModel")
const Sub = require("../model/subModel")
const Car = require("../model/carModel")
const Type = require("../model/typeModel")
const Work = require("../model/workModel")
const Fashion = require("../model/fashionModel")

const categoryCtrl = {
    add: async (req, res) => {
        const {name} = req.body
        try {
            if(!name){
                return res.status(403).json({message: 'Please fill all lines'})
            }
            const {image} = req.files;
            if(image) {
                const format = image.mimetype.split('/')[1];
                if (format !== 'png' && format !== 'jpeg') {
                    return res.status(403).json({message: 'File format incorrect'});
                }
                const createdImage = await cloudinary.v2.uploader.upload(image.tempFilePath, {
                    folder: 'OLX'
                });
                removeTemp(image.tempFilePath);
                const imag = {public_id: createdImage.public_id, url: createdImage.secure_url};
                req.body.image = imag;
            }
            const category = new Category(req.body)
            await category.save()
            res.status(201).json({message: 'new Category', category})
        } catch (error) { 
            res.status(503).json({message: error.message})
        }
        
    },
    get: async (req, res) => {
        try {
            const categorys = await Category.find()
            res.status(200).json({message: 'All categorys', getAll: categorys})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    // delete: async (req, res) => {
    //     const {id} = req.params
    //     if(!id){
    //         return res.status(403).json({message: 'insufficient information'})
    //     }
        
    //     try {
    //         const delCategory = await Category.findById(id)
    //         if(!delCategory){
    //             return res.status(400).send({message: 'Category not found'})
    //         }
            
    //         // if(delCategory.image){
    //         //         await cloudinary.v2.uploader.destroy(delCategory.image.public_id, async (err) =>{
    //         //             if(err){
    //         //                 throw err
    //         //             }
    //         //         })
    //         // }
    //         const findArrType = []
    //         const findSub = await Sub.find({categoryId: id})
    //         for (const sub of findSub) {
    //             const findType = await Type.find({subId: sub._id})
    //             const findCategory = await Category.find({subId: sub._id})
    //             const findFashion = await Fashion.find({subId: sub._id})
    //             const findWork = await Work.find({subId: sub._id})
    //             findArrType.push(findType)
    //         }
    //         for (const type of findArrType) {
    //             const findCategory = await Category.find({categoryType: type._id})
    //             const findFashion = await Fashion.find({categoryType: type._id})
    //             const findWork = await Work.find({categoryType: type._id})
    //             findArrType.push(findType)
    //         }
    //         console.log(findArrType);
            
    //         return console.log(findSub);
    //         const subDel = await Sub.deleteMany({categoryId: id})
    //         // await Sub.deleteMany({categoryId: id})
    //         res.status(200).send({message: 'Gallary deleted', delCategory})
    //     } catch (error) {
    //         res.status(503).json({message: error.message})
    //     }
    // },
    delete: async (req, res) => {
        const {id} = req.params
        if(!id){
            return res.status(403).json({message: 'insufficient information'})
        }
        
        try {
            const deleteCategory = await Category.findByIdAndDelete(id)
            if(!deleteCategory){
                return res.status(400).send({message: 'Category not found'})
            }
            if(deleteCategory.image){
                await cloudinary.v2.uploader.destroy(deleteCategory.image.public_id, async (err) =>{
                    if(err){
                        throw err
                    }
                })
            }
            res.status(200).send({message: 'Category deleted', deleteCategory})
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
            const updateCategory = await Category.findById(id)
            if(!updateCategory){
                return res.status(400).send({message: 'Category not found'})
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
                    if(updateCategory.image){
                        await cloudinary.v2.uploader.destroy(updateCategory.image.public_id, async (err) =>{
                            if(err){
                                throw err
                            }
                        })
                    }
                    const imag = {public_id : imagee.public_id, url: imagee.secure_url}
                    req.body.image = imag;
                }
                }
            const newCategory = await Category.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', newCategory})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    }
}

module.exports = categoryCtrl