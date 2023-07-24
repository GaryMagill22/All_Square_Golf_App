const mongoose = require('mongoose');


const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    course_Index: {
        type: Number,
    },
    slope_Index: {
        type: Number,
    },


}, { timestamps: true })



const Course = mongoose.model('course', CourseSchema)

module.exports = Course;

