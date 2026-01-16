import Course from '../models/course.js';
import user from '../models/user.js';

//get all courses
export const getAll = async(req, res) => {
   try{
    const courses = await Course.find();
    //console.log(courses);
    return res.status(200).json({count : courses.length, courses});
   }catch(err){
    return res.status(500).json({message : 'Error while fetching all courses', error : err.message});
   }
};

//get course by id
export const getById = async (req, res) =>{
    return res.status(200).json(res.course);
};

//create course
 export const createCourse = async(req, res) => {
    try{
        const { name, startDate, endDate, isPublic } = req.body;
        const courseId = req.body.courseId;
        const existingCourse = await Course.findById(courseId);

        if(existingCourse){
            return res.status(400).json({ message : 'Course already exists'});
        }

        if(!name || !startDate || !endDate){
            return res.status(400).json({ message : 'Course details are Required' });
        }
        if(new Date(startDate) > new Date(endDate)){
            return res.status(400).json({ message : 'End Date must be after the Start Date'});
        }

        const course = await Course.create({
            name, startDate, endDate, isPublic
        });

        return res.status(201).json({ message : 'Course Created successfully', course});

    }catch(err){
        return res.status(500).json({ message : 'Server error while creating new course', error: err.message })
    }
};

// update course details
export const updateCourse = async (req, res) =>{
    
    try{

        const courseId = req.params.id;
        const { startDate, endDate } = req.body;


        if(req.body.name !== undefined){
            res.course.name = req.body.name;
        }
        if(req.body.startDate !== undefined){
            res.course.startDate = req.body.startDate;
        }
        if(req.body.endDate !== undefined){
            res.course.endDate = req.body.endDate;
        }
        if(req.body.isPublic !== undefined){
            res.course.isPublic = req.body.isPublic;
        }

        if((startDate !== undefined || endDate !== undefined) && (new Date(res.course.startDate) > new Date(res.course.endDate))){
            return res.status(400).json({ message : 'End date must be after the start date'});
        }
        
        const updatedCourse  = await res.course.save();

        return res.status(200).json({message : `Course ${courseId} updated successfully`,updatedCourse});

    }catch(err){
        return res.status(500).json({message : 'Error while updating the course',error : err.message});
    }

};

//delete one course

export const deleteCoursefromList = async (req, res) =>{
    try{

        const courseId = req.params.id;
        await res.course.deleteOne();

        //delete from users list also
        await user.updateMany({courses : courseId}, {$pull : {courses : courseId}});

        return res.status(200).json({ message : `Course ${courseId} has been removed successfully`});

    }catch(err){
        return res.status(500).json({ message : 'Error while deleting the course', error : err.message});
    }
};

export const getCourseById= async(req, res, next) =>{
   let course
    try{
        course = await Course.findById(req.params.id);
        if(course == null){
            return res.status(404).json({ message : 'Course NOT Found!'});
        }
    }catch(err) {
        return res.status(500).json({ message : err.message});
    }
    res.course = course;
    next();
}




