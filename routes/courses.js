const express = require('express');
const {protect,authorize} = require('../middleware/auth');
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
.post(protect,authorize('publisher','admin'),addCourse);
router.route('/:id')
.get(getCourse)
.delete(protect,authorize('publisher','admin'),deleteCourse)
.put(protect,authorize('publisher','admin'),updateCourse);

module.exports = router;


