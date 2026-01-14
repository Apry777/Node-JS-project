//const express = require('express');
const router = express.Router();
//const Course = require('../models/course');

import express from 'express';
//import from '../controller/courseController.js';

//import Course from '../../models/course.js';
import {getAll, getById, getCourseById,createCourse, updateCourse, deleteCoursefromList} from '../../controller/courseController.js'
import adminOnly from '../../middleware/adminOnly.js';
import authMiddleware from '../../middleware/jwtAuth.js';


router.use(express.json());

router.get('/getAll', getAll);

//get course by id
router.get('/:id', getCourseById, getById);

// create course
router.post('/addCourse', authMiddleware, adminOnly, createCourse);

// update course details
router.patch('/updateCourse/:id',authMiddleware, adminOnly, getCourseById, updateCourse);

//delete one course

router.delete('/deleteCourse/:id',authMiddleware, adminOnly, getCourseById, deleteCoursefromList);

// module.exports = router;
export default router;