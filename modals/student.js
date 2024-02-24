const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
    rollNo: String,
    name: String,
    degree: String,
    city: String,
})
module.exports = mongoose.model('Student',studentSchema)