// "use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');


module.exports = function(DataHelpers) {


  tweetsRoutes.post("/like", function(req, res) {
    if(!req.session.user) {
      res.status(403).send('Please log in');
      return;
    }
    let name = req.session.user[0];
    let tweetID = req.body.id;
    let likesArray = req.body.likesArray || [];
    if(likesArray.indexOf(name) === -1) {
      DataHelpers.changeLikesUp(name, tweetID, (err, array) => {
        res.send(name);
      });
    } else {
      DataHelpers.changeLikesDown(name,tweetID, (err, array) => {
        res.send(name);
      });
    }
  });

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if(!req.session.user){
      res.status(403).send('please login or register');
      return;
    }
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    //const user =  req.session.user;
    const randomUser = userHelper.generateRandomUser();
    const tweet = {
      user: {name: req.session.user[0],
        handle: req.session.user[1],
        avatars: randomUser.avatars},
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: []
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  tweetsRoutes.post("/register", function(req, res) {
    DataHelpers.checkUserExists(req.body.email, (err, user) => {
      if (!(user[0] === undefined)) {
        return;
      }
      user = {
        email: req.body.email,
        name: req.body.name,
        handler: req.body.handler,
        password: bcrypt.hashSync(req.body.password, 10)
      };
      DataHelpers.createUser(user, (err) => {
      });
      req.session.user = [user['name'], user['handler']];
      res.redirect('/');
    });

  });

  tweetsRoutes.post("/logout", function(req, res) {
    req.session=null;
    res.redirect('/');
  });

  tweetsRoutes.post("/login", function(req, res) {

    if(req.body.email === "" ||  req.body.password === "" ){ //if user or pass left empty
      res.status(400).send("Please fill in both email and password");
      return;
    }
    let user = {
      "email": req.body.email,
      "password": req.body.password
    };

    DataHelpers.checkUserMatch(user, (err, match) => {
      if((match[0] === undefined) || !(bcrypt.compareSync(user.password, match[0].password))){
        res.status(403).send("Invalid Username/Password");
        return;
      } else if((bcrypt.compareSync(user.password, match[0].password))) {
        req.session.user = [match[0]['name'], match[0]['handler']];
        res.redirect('/');
      }


    });
  });


  return tweetsRoutes;

}
