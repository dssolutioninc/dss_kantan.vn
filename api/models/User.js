/**
 * User.js
 *
 * @description :: info collection user
 * @docs        :: http://sailsjs.org/#!documentation/models
 * author: tuyentv1
 * email:tuyentv1@fsoft.com
 */

module.exports = {
     schema: true,
    // adapter: 'mongo',
    attributes: {
        provider: {
            type: 'string'
        },
        uid: {
            type: 'string'
        },
        firstname: {
            type: 'string'
        },
        lastname: {
            type: 'string'
        },
        email: {
            type: 'string',
            required: true,
            unique: true
        },
        telephone: {
            type: 'string'
        },
        fax: {
            type: 'string'
        },
        yourAddress: {
            type: 'json'
        },
        gender: {
            type: 'integer'
        },
        birthday: {
            type: 'date'
        },
        language: {
            type: 'string'
        },
        website: {
            type: 'string'
        },
        avatar: {
            type: 'string'
        },
        active: {
            type: 'boolean',
            defaultsTo: false
        },
        lastLogin: {
            type: 'date'
        },
        creatingDate: {
            type: 'date'
        },
        currentLevel: {
            type: 'string'
        },
        currentLearningTime: {
            type: 'integer'
        },
        online: {
            type: 'boolean',
            defaultsTo: false
        },
        username: {
            type: 'string',
            required: true
        },
        admin: {
            type: 'boolean',
            defaultsTo: false
        },
        encryptedPassword: {
            type: 'string'
        },
        // Add a reference to User
        buddy: {
            collection: "Buddy",
            via: "buddyOf"
        },
        user_country: {
            model: 'country'
        },
        selfLearnings: {
            collection: 'SelfLearning',
            via: 'user'
        },
        userLearnHistories: {
            collection: 'UserLearnHistory',
            via: 'user'
        },
        bookUseHistories: {
            collection: 'BookUseHistory',
            via: 'user'
        },
        surveyResult: {
            collection: 'surveyResult',
            via: 'user'
        }
    },

    beforeCreate: function (values, next) {
        if (typeof values.provider !== 'undefined') {
            return next();
        }
        //This checks to make sure the password confirmation match before creating record
        if (!values.password || values.password != values.confirmation) {
            return next({err: ["Password doesn't match password confirmation."]});
        }
        require('bcryptjs').hash(values.password, 10, function passwordEncypted(err, encryptedPassword) {
            if (err) {
                return next(err);
            }
            values.encryptedPassword = encryptedPassword;
            //values.online = true;
            next();
        });

    }
};

