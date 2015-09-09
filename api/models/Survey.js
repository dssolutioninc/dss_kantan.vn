/**
 * Survey.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        sort: {
            type: 'Integer'
        },
        oneTime: {
            type: "Boolean"
        },
        question: {
            type: "String"
        },
        option1: {
            type: "String"
        },
        option2: {
            type: "String"
        },
        option3: {
            type: "String"
        },
        option4: {
            type: "String"
        },
        surveyResult: {
            collection: 'surveyResult',
            via: 'survey'
        }
    }

};

