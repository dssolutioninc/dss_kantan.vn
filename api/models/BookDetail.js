/**
 * BookDetail.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        lesson: {type: 'string'},
        subLesson: {type: 'string'},
        sort: {type: 'integer'},
        useModule: {type: 'string'},
        useCollection: {type: 'string'},
        dataExtractCondition: {type: 'string'},
        bookMaster: {
            model: 'bookMaster'
        },
        userLearnHistories: {
            collection: 'UserLearnHistory',
            via: 'bookDetail'
        }
    }
};

