// "use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();
const bcrypt = require('bcrypt');
//const cookieSession = require('cookie-session');

module.exports = function(DataHelpers) {

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
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
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
     //check if email and password field filled
    // if(req.body.email === "" ||  req.body.password === ""){
    //   res.status(400).send("Please fill in both email and password");
    //   return;
    // }
    DataHelpers.checkUserExists(req.body.email, (err, user) => {
      if (!(user[0] === undefined)) {
        return;
      };
      user = {
        email: req.body.email,
        name: req.body.name,
        handler: req.body.handler,
        password: bcrypt.hashSync(req.body.password, 10)
      };
      DataHelpers.createUser(user, (err) => {
        console.log('done');
        // if (err) {
        //   res.status(500).json({ error: err.message });
        // } else {
        //   res.status(201).send();
        // }
      });
      req.session.user = req.body.handler;
      res.redirect('/');
    });

  });

  tweetsRoutes.post("/logout", function(req, res) {
    req.session=null;
    res.redirect('/');
  });

  tweetsRoutes.post("/login", function(req, res) {

    console.log('e');

    if(req.body.email === "" ||  req.body.password === "" ){ //if user or pass left empty
      res.status(400).send("Please fill in both email and password");
      return;
    }
    let user = {
      "email": req.body.email,
      "password": req.body.password
    };

    DataHelpers.checkUserMatch(user, (err, match) => {
      console.log(match[0].password)
      console.log(user.password);
      console.log((bcrypt.compareSync(user.password, match[0].password)));
      if((match[0] === undefined) || !(bcrypt.compareSync(user.password, match[0].password))){
        res.status(403).send("Invalid Username/Password");
        return;
      } else if((bcrypt.compareSync(user.password, match[0].password))) {
        req.session.user = match[0];
        res.redirect('/');
      }


    });

//   let match = findLoginMatch(user); //return 1 if wrong pass, 2 if email doesn't exist, users id if pass and user match
//   switch (match) {
//     case 1:
//       res.status(403).send("Invalid Password");
//       break;
//     case 2:
//       res.status(403).send("Email not found");
//       break
//     default:
//       //set cookie parameter to value submitted in request body form username
//       req.session.username = users[match];
//       res.redirect('/');
//   }
// });




  });


  return tweetsRoutes;

}
