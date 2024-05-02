const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        method: {
            type: String,
            default: 'work'
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sub',
        },
        typeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type',
        },
        content: {
            type: String,
            required: true
        },  
        link: {
            type: String,
            required: true
        },
        salary: {
            type: String,
            required: true
        },
        kinOfWork: {
            type: String,
            required: true
        },
        employmentType: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
},
{timestamps: true},
)

module.exports = mongoose.model("Work", workSchema)