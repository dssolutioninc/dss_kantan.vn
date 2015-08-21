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
        // 0: chua ket ban
        // 1: da yeu cau ket ban
        // 2: da la ban
        statusBuddy: {
            type: 'integer'

        },
        buddyOf: {
            model: 'User'
        }


    }

};

