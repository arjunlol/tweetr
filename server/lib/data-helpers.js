"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
const ObjectID = require('mongodb').ObjectID;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection('tweets').insertOne(newTweet);
      callback(null,true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
 //     const sortNewestFirst = (a, b) => a.created_at - b.created_at;
      db.collection('tweets').find().toArray(callback);
    },

    checkUserExists: function(email, callback) {
      db.collection('users').find({"email":email}).toArray(callback);
    },

    createUser: function(user, callback) {
      db.collection('users').insertOne(user);
      callback(null,true);
    },

    checkUserMatch: function(user, callback) {
      db.collection('users').find({"email": user.email}).toArray(callback);
    },

    //unlikes tweet
    changeLikesDown: function(name, tweetID, callback) {
      db.collection('tweets').updateOne(
        {'_id': ObjectID(tweetID)},
        {$pull: {"likes": name}},
        callback(null,true)
      );
    },

    //likes tweet
    changeLikesUp: function(name, tweetID, callback) {
      db.collection('tweets').updateOne(
        {'_id': ObjectID(tweetID)},
        {$addToSet: {"likes": name}},
        callback(null,true)
      );

    }
  };
}
