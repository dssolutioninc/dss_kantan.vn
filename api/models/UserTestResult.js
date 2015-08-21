/**
* UserTestResult.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      user:{
        model: 'User'
      },
      selfLearning:{
        model:'SelfLearning'
      },
      question:{
        model:'Question'
      },
      answer:{
        type:'string'
      },
      result:{
        type:'boolean'
      }
  }
};

