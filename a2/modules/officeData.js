const fs = require("fs"); // npm install fs
class Data {
  constructor(employees, classes) {
    this.employees = employees;
    this.classes = classes;
  }
}

let datacollection = null;

module.exports.initialize = function () {
  // place our code inside a "Promise" function
  return new Promise((resolve, reject) => {
    fs.readFile("./data/employees.json", "utf8", (err, employeeData) => {
      if (err) {
        reject("unable to read employees.json");
        return;
      }

      fs.readFile("./data/classes.json", "utf8", (err, classesData) => {
        if (err) {
          reject("unable to read classes.json");
          return;
        }

        datacollection = new Data(
          JSON.parse(employeeData),
          JSON.parse(classesData)
        );

        resolve(); // call "resolve" when the function has successfully completed
      });
    });
  });
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    if (datacollection.employees.length == 0) {
      reject("no results returned"); // call "reject" when the function encountered an error
      return;
    }
    resolve(datacollection.employees);
  });
};

module.exports.getEAs = function () {
  return new Promise(function (resolve, reject) {
    var filteredemployees = [];

    for (let i = 0; i < datacollection.employees.length; i++) {
      if (datacollection.employees[i].EA == true) {
        filteredemployees.push(datacollection.employees[i]);
      }
    }

    if (filteredemployees.length == 0) {
      reject("no results returned");
      return;
    }
    resolve(filteredemployees);
  });
};

module.exports.getClasses = function () {
  return new Promise((resolve, reject) => {
    if (datacollection.classes.length == 0) {
      reject("no results returned");
      return;
    }
    resolve(datacollection.classes);
  });
};

module.exports.getPartTimers = function () {
  return new Promise(function (resolve, reject) {
    var filteredemployees = [];

    for (let i = 0; i < datacollection.employees.length; i++) {
      if (datacollection.employees[i].status == "Part Time") {
        filteredemployees.push(datacollection.employees[i]);
      }
    }

    if (filteredemployees.length == 0) {
      reject("no results returned");
      return;
    }
    resolve(filteredemployees);
  });
};
