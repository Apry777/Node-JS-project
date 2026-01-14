// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');

import express from 'express';
import { register,login,assignCourse, getAssignedCourses, updateAssignedCourses } from '../../controller/userController.js';
import authMiddleware from '../../middleware/jwtAuth.js';
import { deleteCourse } from '../../controller/userController.js';
import optionalAuth from '../../middleware/optionalAuth.js';

const router = express.Router();
//register new user
router.post('/register' , register);
//authorize the user
router.post('/login',login);
//assigns courses to authorized user
router.post('/assign', optionalAuth, assignCourse);
//remove courses assisgned to authorized user
router.delete('/delete/:courseId', authMiddleware, deleteCourse);
//get all courses added by authorized user
router.get('/courses',optionalAuth, getAssignedCourses);
//update assigned course
router.put('/update', authMiddleware, updateAssignedCourses);

export default router;