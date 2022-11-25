const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const data = require("./modules/collegeData.js");
// const clientSessions = require("client-sessions");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// const user = {
//   username: "sampleuser",
//   password: "samplepassword",
// };

// function ensureLogin(req, res, next) {
//   if (!req.session.user) {
//     res.redirect("/login");
//   } else {
//     next();
//   }
// }

app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute
            ? ' class="nav-item active" '
            : ' class="nav-item" ') +
          '><a class="nav-link" href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);

app.set("view engine", ".hbs");
app.use(express.static("public"));

// // Setup client-sessions
// app.use(
//   clientSessions({
//     cookieName: "session", // this is the object name that will be added to 'req'
//     secret: "week10example_web322", // this should be a long un-guessable string.
//     duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
//     activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
//   })
// );

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo");
});

// students route
app.get("/students", (req, res) => {
  if (data.length > 0) {
    data
      .getStudentsByCourse(req.query.course)
      .then((data) => {
        res.render("students", { students: data });
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      });
  } else {
    data
      .getAllStudents()
      .then((data) => {
        res.render("students", { students: data });
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      });
  }
});

app.get("/students/add", (req, res) => {
  res.render("addStudent");
});

app.post("/students/add", (req, res) => {
  data.addStudent(req.body).then(() => {
    res.redirect("/students");
  });
});

app.get("/student/:studentNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  data
    .getStudentByNum(req.params.studentNum)
    .then((data) => {
      if (data) {
        viewData.student = data; //store student data in the "viewData" object as "student"
      } else {
        viewData.student = null; // set student to null if none were returned
      }
    })
    .catch(() => {
      viewData.student = null; // set student to null if there was an error
    })
    .then(data.getCourses)
    .then((data) => {
      viewData.courses = data; // store course data in the "viewData" object as "courses"
      // loop through viewData.courses and once we have found the courseId that matches
      // the student's "course" value, add a "selected" property to the matching
      // viewData.courses object
      for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
          viewData.courses[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.courses = []; // set courses to empty if there was an error
    })
    .then(() => {
      if (viewData.student == null) {
        // if no student - return an error
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData }); // render the "student" view
      }
    });
});

app.post("/student/update", (req, res) => {
  data.updateStudent(req.body).then(() => {
    res.redirect("/students");
  });
});
app.get("/student/delete/:studentNum", (req, res) => {
  data
    .deleteStudentByNum(req.params.studentNum)
    .then(res.redirect("/students"))
    .catch((err) =>
      res.status(500).send("Unable to Remove Student / Student not found")
    );
});
// courses route
app.get("/courses", (req, res) => {
  if (data.length > 0) {
    data
      .getCourses()
      .then((data) => {
        res.render("courses", { courses: data });
      })
      .catch((err) => {
        res.render("courses", { message: "no results" });
      });
  }
});

app.get("/courses/add", (req, res) => {
  res.render("addCourse");
});

app.post("/courses/add", (req, res) => {
  data.addCourse(req.body).then(() => {
    res.redirect("/courses");
  });
});

app.get("/course/:id", (req, res) => {
  data
    .getCourseById(req.params.id)
    .then((data) => {
      res.render("course", { course: data });
    })
    .catch((err) => {
      res.status(404).end("Course Not Found");
    });
});

app.post("/courses/update", (req, res) => {
  data.updateCourse(req.body).then(() => {
    res.redirect("/courses");
  });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.get("/course/delete/:id", (req, res) => {
  data
    .deleteCourseById(req.params.id)
    .then((data) => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Course / Course not found");
    });
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
