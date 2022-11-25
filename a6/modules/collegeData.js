const Sequelize = require("sequelize");

// define the connection to Postgres instance
var sequelize = new Sequelize(
  "arhdmrib",
  "arhdmrib",
  "4JwPq8vIPvO04U7HMrYODC9Oi5hn7J5L",
  {
    host: "peanut.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

// Creating Data Models
const Student = sequelize.define("student", {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING,
});

const Course = sequelize.define("course", {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING,
});

// hasMany Relationship
Course.hasMany(Student, { foreignKey: "course" });

// Update Existing collegeData.js functions
module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(resolve("successful sync!"))
      .catch(reject("unable to sync the database"));
  });
};

module.exports.getAllStudents = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(resolve(Student.findAll()))
      .catch(reject("no results returned"));
  });
};

module.exports.getStudentsByCourse = (course) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        course: course,
      },
    })
      .then(resolve(Student.findAll({ where: { course: course } })))
      .catch(reject("no results returned"));
  });
};

module.exports.getStudentByNum = (num) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        studentNum: num,
      },
    })
      .then((data) => resolve(data))
      .catch("no results returned");
  });
};

module.exports.getCourses = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(resolve(Course.findAll()))
      .catch(reject("no results returned"));
  });
};

module.exports.getCourseById = (id) => {
  return new Promise((resolve, reject) => {
    Course.findAll({
      where: {
        courseId: id,
      },
    })
      .then(resolve(Course.findAll({ where: { courseId: id } })))
      .catch(reject("no results returned"));
  });
};

module.exports.addStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;

    for (let i in studentData) {
      if (studentData[i] == "") {
        studentData[i] = null;
      }
    }

    Student.create(studentData)
      .then(resolve(Student.findAll()))
      .catch(reject("unable to create student"));
  });
};

module.exports.updateStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;

    for (let i in studentData) {
      if (studentData[i] == "") {
        studentData[i] = null;
      }
    }

    sequelize
      .sync()
      .then(
        Student.update(studentData, {
          where: {
            studentNum: studentData.studentNum,
          },
        })
      )
      .then(
        resolve(
          Student.update(studentData, {
            where: { studentNum: studentData.studentNum },
          })
        )
      )
      .catch(reject("unable to update student"));
  });
};

// Adding new collegeData.js functions
module.exports.addCourse = (courseData) => {
  return new Promise((resolve, reject) => {
    for (let i in courseData) {
      if (courseData[i] == "") {
        courseData[i] = null;
      }
    }

    Course.create(courseData)
      .then(resolve(Course.findAll()))
      .catch(reject("unable to create course"));
  });
};

module.exports.updateCourse = (courseData) => {
  return new Promise((resolve, reject) => {
    for (let i in courseData) {
      if (courseData[i] == "") {
        courseData[i] = null;
      }
    }

    sequelize
      .sync()
      .then(
        Course.update(courseData, {
          where: {
            courseId: courseData.courseId,
          },
        })
      )
      .then(
        resolve(
          Course.update(courseData, {
            where: { courseId: courseData.courseId },
          })
        )
      )
      .catch(reject("unable to update course"));
  });
};

module.exports.deleteCourseById = (id) => {
  return new Promise((resolve, reject) => {
    Course.destroy({
      where: {
        courseId: id,
      },
    })
      .then(resolve("destroyed"))
      .catch(reject("unable to delete course"));
  });
};

module.exports.deleteStudentByNum = (studentNum) => {
  return new Promise((resolve, reject) => {
    Student.destroy({
      where: {
        studentNum: studentNum,
      },
    })
      .then(resolve("destroyed"))
      .catch(reject("unable to delete student"));
  });
};
