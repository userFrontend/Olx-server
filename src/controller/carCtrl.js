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

const Car = require("../model/carModel")
const Fashion = require("../model/fashionModel")
const Work = require("../model/workModel")

const carCtrl = {
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
            const car = new Car(req.body);
            await car.save();
            res.status(201).json({message: 'new Car', car});
        } catch (error) {
            res.status(503).json({message: error.message});
        }
    },    
    get: async (req, res) => {
        try {
            const cars = await Car.find()
            res.status(200).json({message: 'All Cars', getAll: cars})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    getOne: async (req, res) => {
        const {id} = req.params
        try {
            const getCar = await Car.aggregate([
                {
                  $match: { _id: new mongoose.Types.ObjectId(id) },
                },
                {
                  $lookup: {
                    from: "cars",
                    let: { authorId: "$authorId" },
                    pipeline: [
                      { $match: { $expr: { $eq: ["$authorId", "$$authorId"] } } },
                    ],
                    as: "userCar",
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
                      $concatArrays: ["$userCar", "$userFashion"],
                    },
                  },
                },
                {
                  $project: {
                    userCar: 0,
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
            if(!getCar){
                return res.status(400).send({message: 'Car not found'})
            }
            res.status(200).json({message: 'Find Car', getOne: getCar})
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
            const deleteCar = await Car.findByIdAndDelete(id)
            if(!deleteCar){
                return res.status(400).send({message: 'Car not found'})
            }
            if(deleteCar.photos.length > 0){
                deleteCar.photos.map(async pic => {
                    await cloudinary.v2.uploader.destroy(pic.public_id, async (err) =>{
                        if(err){
                            throw err
                        }
                    })
                })
            }
            res.status(200).send({message: 'Car deleted', deleted: deleteCar})
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
            const updateCar = await Car.findById(id)
            if(!updateCar){
                return res.status(400).send({message: 'Car not found'})
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
                    if(updateCar.photos.length > 0){
                        updateCar.photos.map(async pic => {
                            await cloudinary.v2.uploader.destroy(pic.public_id, async (err) =>{
                                if(err){
                                    throw err
                                }
                            })
                        })
                    }
                    const imag = {public_id : imagee.public_id, url: imagee.secure_url}
                    req.body.photos = imag;
                }
                }
            const newCar = await Car.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', updated: newCar})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    similar: async (req, res) => {
      const { name } = req.query;
      try {
          const result = await Promise.all([
              Car.find({ name: { $regex: new RegExp(name, "i") } }),
              Fashion.find({ name: { $regex: new RegExp(name, "i") } }),
              Work.find({ name: { $regex: new RegExp(name, "i") } }),
          ]);

          const similarItems = result.flat();
  
          res.status(200).send({ message: "Found result", similar: similarItems });
      } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Internal server error" });
      }
  },
    location: async (req, res) => {
      const { name } = req.query;
      try {
          const result = await Promise.all([
              Car.find({ location: { $regex: new RegExp(name, "i") } }),
              Fashion.find({ location: { $regex: new RegExp(name, "i") } }),
              Work.find({ location: { $regex: new RegExp(name, "i") } }),
          ]);

          const similarItems = result.flat();
  
          res.status(200).send({ message: "Found result", similar: similarItems });
      } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Internal server error" });
      }
  }
}

module.exports = carCtrl