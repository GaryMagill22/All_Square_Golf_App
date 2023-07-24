const express = require('express');
const CourseController = require('../controllers/course.controller')



const courseRoutes = express.Router();


// All COURSE ROUTES



// Create Course
courseRoutes.post('/new', CourseController.createCourse)


// Get All Courses
courseRoutes.get('/', CourseController.getAllCourses)



// Get One Course
courseRoutes.get(`/:id`, CourseController.getOneCourse)



// Update Course
courseRoutes.put('/:id', CourseController.updateCourse)



// Delete Course
courseRoutes.delete('/:id', CourseController.deleteCourse);


module.exports = { courseRoutes }