/**
 * Vocabulary.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        sort: {
            type: 'Integer'
        },
        level: {
            type: "String"
        },
        firstUsing: {
            type: "Boolean"
        },
        uniqueUsing: {
            type: "Boolean"
        },
        qType: {
            type: "Integer"
        },
        question: {
            type: "String"
        },
        option1: {
            type: "String"
        },
        correct1: {
            type: "Boolean"
        },
        option2: {
            type: "String"
        },
        correct2: {
            type: "Boolean"
        },
        option3: {
            type: "String"
        },
        correct3: {
            type: "Boolean"
        },
        option4: {
            type: "String"
        },
        correct4: {
            type: "Boolean"
        }

    }

};

