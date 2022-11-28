/*********************************************************************************
 * WEB322 – Assignment 06
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Xiaoyue Zhao
 * Student ID: 124899212
 * Date: Nov 27
 *
 ********************************************************************************/

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const clientSessions = require("client-sessions");
const data = require("./modules/collegeData.js");
const HTTP_PORT = process.env.PORT || 8080;

// create a user object
const user = {
  username: "sampleuser",
  password: "samplepassword",
};

// helper middleware function
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

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
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

// Setup client-sessions
app.use(
  clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "assignment6_web322", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
  })
);

// login/logout route
app.get("/login", (req, res) => {
  res.render("login", {
    layout: false, // do not use the default Layout (main.hbs)
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    // Render 'missing credentials'
    return res.render("login", {
      errorMsg: "Type in username or password!",
      layout: false, // do not use the default Layout (main.hbs)
    });
  }
  // use sample "user" (declared above)
  if (username === user.username && password === user.password) {
    // Add the user on the session and redirect them to the home page.
    req.session.user = {
      username: user.username,
    };
    res.redirect("/students");
  } else {
    // render 'invalid username or password'
    res.render("login", {
      errorMsg: "Invalid username or password!",
      layout: false, // do not use the default Layout (main.hbs)
    });
  }
});

app.get("/logout", ensureLogin, (req, res) => {
  req.session.reset();
  res.redirect("/login");
});

// LEFT nav pages
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo");
});

// student routes
app.get("/students", ensureLogin, (req, res) => {
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

app.get("/students/add", ensureLogin, (req, res) => {
  data
    .getCourses()
    .then((data) => res.render("addStudent", { courses: data }))
    .catch((err) => res.render("addStudent", { courses: [] }));
});

app.post("/students/add", (req, res) => {
  data.addStudent(req.body).then(() => {
    res.redirect("/students");
  });
});

app.get("/student/:studentNum", ensureLogin, (req, res) => {
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

app.post("/student/update", ensureLogin, (req, res) => {
  data.updateStudent(req.body).then(() => {
    res.redirect("/students");
  });
});

app.get("/student/delete/:studentNum", ensureLogin, (req, res) => {
  data
    .deleteStudentByNum(req.params.studentNum)
    .then((data) => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Student / Student not found");
    });
});

// course routes
app.get("/courses", ensureLogin, (req, res) => {
  if (data.length > 0) {
    data
      .getCourseById(req.query.id)
      .then((data) => {
        res.render("courses", { courses: data });
      })
      .catch((err) => {
        res.render("courses", { message: "no results" });
      });
  } else {
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

app.get("/courses/add", ensureLogin, (req, res) => {
  res.render("addCourse");
});

app.post("/courses/add", (req, res) => {
  data.addCourse(req.body).then(() => {
    res.redirect("/courses");
  });
});

app.get("/course/:id", ensureLogin, (req, res) => {
  data
    .getCourseById(req.params.id)
    .then((data) => {
      res.render("course", { course: data });
    })
    .catch((err) => {
      res.status(404).send("Course Not Found");
    });
});

app.post("/course/update", ensureLogin, (req, res) => {
  data.updateCourse(req.body).then(() => {
    res.redirect("/courses");
  });
});

app.get("/course/delete/:id", ensureLogin, (req, res) => {
  data
    .deleteCourseById(req.params.id)
    .then((data) => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Course / Course not found");
    });
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