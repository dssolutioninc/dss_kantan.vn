/**
 * Learning.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        notes: {
            type: 'string'
        },

        startDate: {
            required: true,
            type: 'datetime'

        },

        finishDate: {
            type: 'datetime',
            required: true
        },
        stringStartDate: {
            type: 'String',
            required: true


        },
        stringFinishDate: {
            type: 'String',
            required: true
        },
        bookMaster: {
            model: 'BookMaster'
        },
        user: {
            model: 'User'
        },

        bookUseHistories: {
            collection: 'BookUseHistory',
            via: 'selfLearning'
        },

        userLearnHistories: {
            collection: 'UserLearnHistory',
            via: 'selfLearning'
        },
    }
};
