const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    color:{
        type: 'String',
        default: 'aqua'
    },
    image: {
        type: Object,
        required: true
    }
},
{timestamps: true},
)

module.exports = mongoose.model("Category", categorySchema)