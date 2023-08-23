const express = require('express');
const CourseController = require('../controllers/course.controller');
const { authenticate } = require('../config/jwt.config');



const courseRoutes = express.Router();


// All COURSE ROUTES



// Create Course
courseRoutes.post('/new', authenticate, CourseController.createCourse)


// Get All Courses
courseRoutes.get('/', authenticate, CourseController.getAllCourses)



// Get One Course
courseRoutes.get(`/:id`, authenticate, CourseController.getOneCourse)



// Update Course
courseRoutes.put('/:id', authenticate, CourseController.updateCourse)



// Delete Course
courseRoutes.delete('/:id', CourseController.deleteCourse);


module.exports = { courseRoutes }