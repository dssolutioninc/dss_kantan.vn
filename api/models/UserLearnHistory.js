/**
 * Created by DongDL1 on 7/7/2015.
 */

module.exports = {

    attributes: {
        user: {
            model: 'User'
        },
        selfLearning: {
            model: 'SelfLearning'
        },
        bookDetail: {
            model: 'bookDetail'
        },
        status: {
            type: 'String'
        },
        lesson: {
            type: 'String'
        },
        mark: {
            type: 'float'
        },

        startDate: {
            type: 'datetime'
        },

        finishDate: {
            type: 'datetime'
        },
        bookUseHistory: {
            model: 'BookUseHistory'
        }
    }
};
