//const mongoose = require('mongoose');
import mongoose from 'mongoose';
import course from './course.js';

const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
        unique : true,
        validate : {
            validator : function(value){
                return value.length > 3;  
            },
            message : 'Username must be atleast 3 characters long'
        }
    },
    password : {
        type : String,
        required : true,
        validate : {
            validator : function(value){
                return value.length > 8;
            },
            message : 'Password must be atleast 8 characters long'
        }
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    courses : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : course
    }
    ]
});

//module.exports = mongoose.model('User', userSchema);

export default mongoose.model('User', userSchema);