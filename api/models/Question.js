/**
 * Question.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        article:{
            model:'Article',
            required:true
        },
        sort:{
            type:'integer',
            autoIncrement: true
        },
        question:{
            type:'string',
            required:true
        },
        image:{
            type:'string'
        },
        option1:{
            type:'string',
            required:true
        },
        option2:{
            type:'string',
            required:true
        },
        option3:{
            type:'string',
            required:true
        },
        option4:{
            type:'string',
            required:true
        },
        key:{
            type:'string'
        }
    }
};

