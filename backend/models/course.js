//const mongoose = require('mongoose');
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
        unique : true
    },
    startDate : {
        type : Date,
        required : true,
        default : Date.now
    },
    endDate : {
        type : Date,
        required : true,
        default : Date.now
    },
    isPublic : {
        type : Boolean,
        default : true
    }
    
    },
    {timestamps : true});

//module.exports = mongoose.model('Course' , courseSchema);
export default mongoose.model('Course', courseSchema);