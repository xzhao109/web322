const fs = require("fs");

class Data {
  constructor(employees, classes) {
    this.employees = employees;
    this.classes = classes;
  }
}

let dataCollection = null;

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/classes.json", "utf8", (err, classesData) => {
      if (err) {
        reject("unable to load classes");
        return;
      }

      fs.readFile("./data/employees.json", "utf8", (err, employeeData) => {
        if (err) {
          reject("unable to load employees");
          return;
        }

        dataCollection = new Data(
          JSON.parse(employeeData),
          JSON.parse(classesData)
        );

        resolve();
      });
    });
  });
};

module.exports.getEmployeeByNum = function (num) {
  return new Promise((resolve, reject) => {
    var filteredemployees = [];

    for (let i = 0; i < dataCollection.employees.length; i++) {
      if (dataCollection.employees[i].employeeNum == num) {
        filteredemployees.push(
          dataCollection.employees[i].firstName +
            " " +
            dataCollection.employees[i].lastName
        );
      }
    }

    if (filteredemployees.length == 0) {
      reject("no results returned");
      return;
    }

    resolve(filteredemployees);
  });
};

module.exports.getPartTimers = function () {
  return new Promise(function (resolve, reject) {
    var filteredemployees = [];

    for (let i = 0; i < dataCollection.employees.length; i++) {
      if (dataCollection.employees[i].status == "Part Time") {
        filteredemployees.push(dataCollection.employees[i]);
      }
    }

    if (filteredemployees.length == 0) {
      reject("no results returned");
      return;
    }

    resolve(filteredemployees);
  });
};
