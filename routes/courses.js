const express = require('express');
const {
    getCourses,
    getCourse,
    addCourse,
    deleteCourse,
    updateCourse
} = require('../controllers/courses');

const Course = require('../models/Courses');
const advancedResults = require('../middleware/advancedResults');


const router = express.Router(({mergeParams: true}));
router.route('/')
.get(advancedResults(Course,{
    path: 'bootcamp',
    select: 'name description'
}),getCourses)
.post(addCourse);
router.route('/:id').get(getCourse).delete(deleteCourse).put(updateCourse);

module.exports = router;


