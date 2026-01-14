import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import Course from '../models/course.js';
import mongoose from 'mongoose';
// import course from '../models/course.js';


export const register = async(req, res) => {
    try{
        const {username, password, role} = req.body;
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message : 'Username already exists'});
        }
        const hashedPwd = await bcrypt.hash(password,10);

        const user = await User.create({
            username,
            password : hashedPwd,
            role : "user"
        });

        res.status(201).json({ message : 'User Registered Successfully',userId : user._id});
    }catch(err){
        res.status(500).json({ message : 'Server error' , err});
    }
};

export const login = async(req, res) => {
    try{
        const{username, password} = req.body;
    
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({ message : 'Invalid Credentials'});
        }

        const isPwdMatch = await bcrypt.compare(password, user.password);
        if(!isPwdMatch){
            return res.status(401).json({ message : 'Invalid Credentials'});
        }

        const token = jwt.sign(
            {userId : user._id, username : user.username, role : user.role},
            process.env.JWT_SECRET,
            {expiresIn : '1d'}
        );

        res.json({ message : 'Login successful', token });
    }catch(err){
        res.status(500).json({ message : 'Server error' , err});
    }

};

export const assignCourse = async(req, res) => {
    try{
        const userId = req.user?.userId;
        const courseId = req.body._id;
        
        
        if(!courseId){
            return res.status(401).json({ message : 'Course Id is required'});
        }
       
        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({ message : 'Course Id is not valid'});
        }

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({ message : 'Course does not exist'});
        }

        //private course must be accessed by logged in user
        if(!userId && !course.isPublic){
            return res.status(401).json({ message : 'Login required to assign private courses'});
        }

        //guest user
         if(!userId){
            return res.status(200).json({ message : 'Public courses accessed successfully', courses : course});
        }

        //logged in user
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message : 'User not Found'});
        }

        if(user.courses.includes(course._id)){
            return res.status(400).json({ message : 'Course already assigned'});
        }

        user.courses.push(course._id);
        await user.save();
        res.status(200).json({message : 'Course assigned successfully',
            course: {
            id: course._id,
            name: course.name,
            startDate: course.startDate,
            endDate: course.endDate,
      },})

    }catch(err){
        res.status(500).json({ message : 'Server Error', error : err.message});
    }
};

export const deleteCourse = async(req, res) => {
    try{
        const userId = req.user?.userId;
        const { courseId } = req.params;

        if(!userId){
            return res.status(401).json({ message : 'User not logged in'});
        }
        if(!courseId){
            return res.status(400).json({message : 'Course ID is required'});
        }
        
        // const getCourse = await Course.findOne({
        //     name : { $regex : new RegExp(`^${courseName}$`,'i')}
        // });
        const getCourse = await Course.findById(courseId);

        if(!getCourse){
            return res.status(404).json({ message : `Course ${courseId} not found`});
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message : 'User not found'});
        }

        if(!user.courses.includes(getCourse._id)){
            return res.status(400).json({ message : 'Course is not assigned to you'});
        }

        user.courses = user.courses.filter(
            courseId => {
                return courseId.toString() !== getCourse._id.toString()
            }
        );

        await user.save();

        res.status(200).json({ message : `Course ${getCourse.name} removed successfully`});

    }catch(err){
        res.status(500).json({ message : 'Server Error', error : err.message});
    }
}

export const getAssignedCourses = async(req, res) =>{

    try{
        const userId = req.user?.userId;
        
        if(!userId){
            res.status(401).json({ message : 'User not logged in'})
        }

        const user = await User.findById(userId).populate('courses', 'name startDate endDate');

        if(!user){
            res.status(404).json({ message : 'User not found'});
        }

        if(!user.courses || user.courses.length === 0){
            res.status(200).json({ message : 'No Courses assigned', course : []});
        }
        res.status(200).json({ count : user.courses.length, course : user.courses});

    }catch(err){
        res.status(500).json({ message : 'Server Error', error : err.message});
    }
}

export const updateAssignedCourses = async(req, res) => {
    try{
        const userId = req.user?.userId;
        const { oldCourseId , newCourseId } =req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message : 'User not found'});
        }

        if(!userId){
            return res.status(401).json( {message : 'User not logged in'});
        }
        if(!oldCourseId || !newCourseId) {
            return res.status(400).json({ message : 'Both old course and new course are required'});
        }

        const oldCourse = await Course.findById(oldCourseId);

        if(!oldCourse){
            return res.status(404).json({ message : `Old Course : ${oldCourseId} does not exist`});
        }

        const newCourse = await Course.findById(newCourseId);

        if(!newCourse){
            return res.status(404).json({ message : `New Course : ${newCourseId} does not exist`});
        }

        if(!user.courses.includes(oldCourseId)){
            return res.status(400).json({ message : `Old course ${oldCourseId} not assigned to you`});
        }
        if(user.courses.includes(newCourseId)){
            return res.status(400).json({ message : `New Course ${newCourseId} is already assigned`});
        }

        user.courses = user.courses.filter(
            id => {
                return id.toString() !== oldCourse._id.toString();
            }
        );
        user.courses.push(newCourse._id);

        await user.save();

        res.status(200).json({
            message : 'Course replaced successfully',
            replaced : oldCourse.name,
            added : newCourse.name
        });

    }catch(err){
        res.status(500).json({ message : 'Server Error', error : err.message});
    }
}
