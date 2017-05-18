"use strict";

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

  const PORT          = 8080;
  const express       = require("express");
  const bodyParser    = require("body-parser");
  const app           = express();
  const cookieSession = require('cookie-session');
  const methodOverride = require('method-override');

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(cookieSession({
    name: 'session',
    keys: ['secret'],
    maxAge: 24*60*60*1000 //24 hours
  }));
MongoClient.connect(MONGODB_URI, (err, db) => {

  // The in-memory database of tweets. It's a basic object with an array in it.
  // const db = require("./lib/in-memory-db");

  // The `data-helpers` module a an interface to the database of tweets.
  // This simple interface layer has a big benefit: we could switch out the
  // actual database it uses and see little to no changes elsewhere in the code
  // (hint hint).
  //
  // Because it exports a function that expects the `db` as a parameter, we can
  // require it and pass the `db` parameter immediately:
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
  // so it can define routes that use it to interact with the data layer.
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });

});