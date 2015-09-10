/**
 * Vocabulary.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        // surveyID:{
        //     type: 'String'
        // },
        // UserID:{
        //     type: 'String'
        // },
        user: {
            model: 'User'
        },
        survey: {
            model: 'Survey'
        },
        answer: {
            type:"String"
        }
    }

};

