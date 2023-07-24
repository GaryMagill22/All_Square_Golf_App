const Course = require("../models/course.model")





// Create new Course
module.exports.createCourse = (req, res) => {
    Course.create(req.body)
        .then(game => res.json(game))
        .catch(err => res.status(400).json(err))


}


// GeT all Course
module.exports.getAllCourses = (req, res) => {
    Course.find({})
        .then(course => res.json(course))
        .catch(err => res.json(err))
}


// Read One Course
module.exports.getOneCourse = (req, res) => {
    // const idFromParams = req.params.id
    Course.findById(req.params.id)
        .then((oneCourse) => { res.json(oneCourse) })
        .catch((err) => { res.json({ err: err }) })
}


//Update one Course
module.exports.updateCourse = (req, res) => {
    Course.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })
        .then(updatedCourse => res.json(updatedCourse))
        .catch((err) => res.status(400).json(err))
}



// Delete one Course
module.exports.deleteCourse = (req, res) => {
    Course.deleteOne({ _id: req.params.id })
        .then(deleteCourse => res.json(deleteCourse))
        .catch(err => res.json(err))
}
