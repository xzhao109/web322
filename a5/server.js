/*********************************************************************************
 * WEB322 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Xiaoyue Zhao
 * Student ID: 124899212
 * Date: Nov 16
 *
 ********************************************************************************/

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const data = require("./modules/officeData.js");
const HTTP_PORT = process.env.PORT || 8080;

const A5ASSETS = "./views/";
const parser = require("body-parser");

app.use(parser.urlencoded({ extended: true }));
app.use(express.static(A5ASSETS));

app.set("views", A5ASSETS);
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");

// GET "/employees" route
app.get("/employees", (req, res) => {
  data
    .getAllEmployees()
    .then((data) => {
      res.render("employees", { employees: data });
    })
    .catch((error) => {
      res.render({ message: "no results" });
    });
});

// GET "/employees/add" route
app.get("/employees/add", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/addEmployee.html"));
});

// POST "/employees/add" route
app.post("/employees/add", (req, res) => {
  data.addEmployee(req.body).then(() => {
    res.redirect("/employees");
  });
});

// GET "/description" route
app.get("/description", (req, res) => {
  res.render("description");
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

data
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, function () {
      console.log("app listening on: " + HTTP_PORT);
    });
  })
  .catch(function (err) {
    console.log("unable to start server: " + err);
  });
