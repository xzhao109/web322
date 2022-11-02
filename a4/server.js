/*********************************************************************************
 * WEB322 – Assignment 04
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Xiaoyue Zhao
 * Student ID: 124899212
 * Date: Oct 28
 *
 ********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;
var data = require("./modules/officeData.js");

// use the built in “express.urlencoded” middleware to handle regular text submissions
// and access the data on req.body
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.urlencoded({ extended: true }));

// call this function after the http server starts listening for requests
onHttpStart = () => {
  console.log("server listening on port: " + HTTP_PORT);
};

// setup a 'route' to listen on the default url path (http://localhost:8080)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/home.html"));
});

// setup another route to listen on /audio
app.get("/audio", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/audio.html"));
});

// setup another route to listen on /video
app.get("/video", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/video.html"));
});

// setup another route to listen on /table
app.get("/table", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/table.html"));
});

// setup another route to listen on /list
app.get("/list", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/list.html"));
});

// setup another route to listen on /storefront
app.get("/storefront", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/storefront.html"));
});

// setup another route to listen on [ no matching route ]
app.use((req, res) => {
  res.status(404).end("Page Not Found");
});

// setup http server to listen on HTTP_PORT
data
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart());
  })
  .catch((err) => {
    console.log(err);
  });
