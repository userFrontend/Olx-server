const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId:{
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
},
{timestamps: true},
)

module.exports = mongoose.model("Sub", subSchema)