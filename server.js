var express = require("express");
var bodyParser = require("body-parser");
// var logger = require("morgan");
var mongoose = require("mongoose");

var Article = require("./models/Article.js");
var CNN = require("./models/Comment.js");

var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var app = express();
var port = process.env.PORT || 3000;
// app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static("public"));

var db = process.env.MONGODB_URL || "mongodb://localhost/mongooseCNNScraper";

// db.on("error", function(error) {
//   console.log("Mongoose error: ",error);
// });

mongoose.connect(db, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("Mongoose connection successful.");
  }
});

//routes

app.get("/scrape", function(req, res) {
  request("https://www.cryptocoinsnews.com/", function(err, res, html) {
    var $ = cheerio.load(html);

    $(".grid-wrapper div").each(function(i, element) {
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      var entry = new Article(result);
      entry.save(function(err, doc) {
        if(err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    });
  });
  res.send("Scraping Complete");
})

//to display html with buttons and articles
app.get("/articles", function(req, res) {
  Article.find({}, function(err, data) {
    if(err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
})

// app.post("/comments", function(req, res) {
//
//   var newComment = new Comment(req.body);
//
//   newComment.save(function(err, data) {
//     if(err) {
//       console.log(err);
//     } else {
//       Article.findOne
//     }
//   })
// })
app.listen(port, function() {
  console.log("App running on port " + port);
})
