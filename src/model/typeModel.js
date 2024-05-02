const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subId: {
        type: mongoose.Types.ObjectId,
        ref: "Sub",
        required: true
    }
},
{timestamps: true}, 
)

module.exports = mongoose.model("Type", typeSchema)
