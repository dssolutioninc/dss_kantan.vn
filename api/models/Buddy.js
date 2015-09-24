/**
 * Buddy.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        user_id: {
            type: 'string'
        },
        statusBuddy: {
            type: 'string',
            enum: ['pending', 'approved', 'denied']
        },
        buddyOf: {
            model: 'User'
        }


    }

};

