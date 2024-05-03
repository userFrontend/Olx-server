const mongoose = require('mongoose')
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
            const getWork = await Work.aggregate([
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
        const {id} = req.params
        if(!id){
            return res.status(403).json({message: 'insufficient information'})
        }
        try {
            const updateWork = await Work.findById(id)
            if(!updateWork){
                return res.status(400).send({message: 'work not found'})
            }
            const newWork = await Work.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', newWork})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    similar: async (req, res) => {
      try {
        const { name } = req.query;
  
        const result = await Promise.all([
          Car.find({ name: { $regex: new RegExp(name, "i") } }),
          Fashion.find({ name: { $regex: new RegExp(name, "i") } }),
          Work.find({ name: { $regex: new RegExp(name, "i") } }),
        ]);
  
        res.status(200).send({ message: "Found result", similar: result.flat() });
      } catch (error) {
        console.log(error);
      }
    },
}

module.exports = workCtrl