/*********************************************************************************
 * WEB322 – Assignment 2
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 * *
 * Name: Xiaoyue Zhao
 * Student ID: 124899212
 * Date: Sep 26
 *
 * ********************************************************************************/

var data = require("./modules/officeData.js");

// when it is "resolved"
// (then) this function be called
data
  .initialize()
  .then(function () {
    data
      .getAllEmployees()
      .then(function (data) {
        console.log("Successfully retrieved " + data.length + " Employees");
      })
      // when it is "rejected"
      // this function catch the error and output a mesaage to the console
      .catch(function (err) {
        console.log(err);
      });

    data
      .getClasses()
      .then(function (data) {
        console.log("Successfully retrieved " + data.length + " Classes");
      })
      .catch(function (err) {
        console.log(err);
      });

    data
      .getEAs()
      .then(function (data) {
        console.log("Successfully retrieved " + data.length + " EAs");
      })
      .catch(function (err) {
        console.log(err);
      });

    data
      .getPartTimers()
      .then(function (data) {
        console.log("Successfully retrieved " + data.length + " Part Timers");
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
