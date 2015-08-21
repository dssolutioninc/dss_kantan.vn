/**
 * BookMaster.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        name: {type: 'string'},
        description: {type: 'string'},
        type: {type: 'string'},
        level: {type: 'string'},
        sort: {type: 'integer'},
        published: {type: 'boolean'},
        image: {type: 'string'},
        category: {type: 'string'},
        complex: {type: 'integer'},
        lessonNum: {type: 'integer'},
        hourForLearn: {type: 'integer'},
        usedNum: {type: 'integer'},
        recommendNum: {type: 'integer'},
        bookDetails: {
            collection: 'BookDetail',
            via: 'bookMaster'
        },
        selfLearnings: {
            collection: 'SelfLearning',
            via: 'bookMaster'
        },
        bookUseHistories: {
          collection: 'BookUseHistory',
          via: 'bookMaster'
        },
    }
};

