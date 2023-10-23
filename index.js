require("dotenv").config();
const express = require("express");
const { Client } = require("pg");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { engine } = require("express-handlebars");
const fs = require("fs");
const cookieParser = require("cookie-parser");
require("./auth");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "madrasPalli",
});

client.connect();

// client.query(`select youtube_link from maths_10th where (chapter_no=1 and exercise_no=2 and problem_no=2)`,(err,res)=>{
//     if(!err) console.log("outuput: ",res.rows);
//     else console.log("err: ",err.message);
//     client.end();
// })

// client.query(`select * from maths_10th`,(err,res)=>{
//     //possible data are rowCount->number of rows we got, command->we given command, rows -> values
//     if(!err) console.log(res.rows);
//     else console.log(err);
//     client.end();
// })

const port = 3000;
const app = express();
app.use(cors());
app.use(cookieParser());

app.set("view engine", "handlebars");

//Sets handlebars configurations (we will go through them later on)
app.engine(
  "handlebars",
  engine({
    layoutsDir: __dirname + "/views/layouts",
    defaultLayout: "index",
    partialsDir: __dirname + "/views/partials/",
  })
);
app.use(express.static("public"));

// Use built-in middleware to parse JSON request bodies
app.use(express.json());

// Use built-in middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

//newly added
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
  if (req.user) {
    req.user.displayName = req.user.displayName;
    console.log("req.user", req.user);
    next();
  } else if (req.cookies["daeb2y5p8"]) {
    let token = req.cookies["daeb2y5p8"];

    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];
    if (token == null) res.render("login");

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return res.render("login");
      console.log("user: ", user);
      req.user = user;
      next();
    });
  } else {
    res.render("login");
  }
}

app.get("/", isLoggedIn, (req, res) => {
  if (req.user) {
    console.log(
      "req.user.accessTokenJWT from root route: ",
      req.user.accessTokenJWT,
      req.user.displayName,
      req.user.email
    );
    res.render("template", {
      title: "index",
      accessTokenJWT: req.user.accessTokenJWT,
      userName: req.user.displayName,
      userEmail: req.user.email,
    });
  } else {
    res.render("template", { title: "index", header: true });
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/api/sessions/oauth/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/failure", (req, res) => {
  console.log("authentication failed");
  res.render("login", { authenticationStatus: "failed" });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

app.get("/about", isLoggedIn, (req, res) => {
  res.render("about", {
    title: "About us",
  });
});

app.get("/videos", (req, res) => {
  res.render("video", { title: "video" });
});

// Mathematics - 10, 11, 12

app.get("/10thmath", isLoggedIn, (req, res) => {
  console.log("loggedIn /10thmath");
  debugger;
  console.log("10th: ", req.user.displayName);
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/10thmath.handlebars",
    "utf-8"
  );
  res.json({
    fileContent: fileContent,
    title: "10th Mathematics",
    chapter: [
      {
        name: "Relations and Functions",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        name: "Numbers and Sequences",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
      {
        name: "Algebra",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      {
        name: "Geometry",
        exercise: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Coordinate Geometry",
        exercise: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Trigonometry",
        exercise: [1, 2, 3],
      },
      {
        name: "Mensuration",
        exercise: [1, 2, 3, 4, 5],
      },
      {
        name: "Statistics and Probability",
        exercise: [1, 2, 3, 4, 5, 6],
      },
    ],
    userName: req.user.displayName,
    userEmail: req.user.user,
  });
});

app.get("/11thmath", isLoggedIn, (req, res) => {
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/11thmath.handlebars",
    "utf-8"
  );
  res.json({
    fileContent: fileContent,
    title: "11th Mathematics",
    chapter: [
      {
        name: "Sets, Relations and Functions",
        exercise: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        name: "Basic Algebra",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        name: "Trigonometry",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      {
        name: "Combinatorics and Mathematical Induction",
        exercise: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Binomial Theorem, Sequences and Series",
        exercise: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Two Dimensional Analytical Geometry",
        exercise: [1, 2, 3, 4, 5],
      },
      {
        name: "Matrices and Determinants",
        exercise: [1, 2, 3],
      },
      {
        name: "Vector Algebra",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        name: "Differential Calculus - Limits and Continuity",
        exercise: [1, 2, 3],
      },
      {
        name: "Differential Calculus - Differentiability and Methods of Differentiation",
        exercise: [1, 2, 3, 4],
      },
      {
        name: "Integral Calculus",
        exercise: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        name: "Introduction to probability\xa0theory",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8],
      },
    ],
    userName: req.user.displayName,
    userEmail: req.user.user,
  });
});

app.get("/12thmath", isLoggedIn, (req, res) => {
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/12thmath.handlebars",
    "utf-8"
  );
  res.json({
    fileContent: fileContent,
    title: "12th Mathematics",
    chapter: [
      {
        name: "Applications of Matrices and Determinants",
        exercise: [1, 2, 3, 4, 5],
      },
      {
        name: "Complex Numbers",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        name: "Theory of Equations",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      {
        name: "Inverse Trigonometric Functions",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        name: "Two Dimensional Analytical Geometry-II",
        exercise: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        name: "Applications of Vector Algebra",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        name: "Applications of Differential Calculus",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        name: "Differentials and Partial Derivatives",
        exercise: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Applications of Integration",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      {
        name: "Ordinary Differential Equations",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        name: "Probability Distributions",
        exercise: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Discrete Mathematics",
        exercise: [1, 2, 3],
      },
    ],
    userName: req.user.displayName,
    userEmail: req.user.user,
  });
});

// Physics - 11, 12

app.get("/11thphy", isLoggedIn, (req, res) => {
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/11thphy.handlebars",
    "utf-8"
  );
  res.json({
    fileContent: fileContent,
    title: "11th Physics",
    chapter: [
      "Nature of Physical World and Measurement",
      "Kinematics",
      "Laws of Motion",
      "Work, Energy and Power",
      "Motion of System of Particles and Rigid Bodies",
      "Gravitation",
      "Properties of Matter",
      "Heat and Thermodynamics",
      "Kinetic Theory of Gases",
      "Oscillations",
      "Waves",
    ],
    userName: req.user.displayName,
    userEmail: req.user.user,
  });
});

app.get("/12thphy", isLoggedIn, (req, res) => {
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/12thphy.handlebars",
    "utf-8"
  );
  res.json({
    fileContent: fileContent,
    title: "12th Physics",
    chapter: [
      "Electrostatics",
      "Current Electricity",
      "Magnetism and magnetic effects of electric current",
      "Electromagnetic Induction And Alternating Current",
      "Electromagnetic waves",
      "Ray Optics",
      "Wave Optics",
      "Dual Nature of Radiation and Matter",
      "Atomic and Nuclear physics",
      "Electronics and Communication",
      "Recent Developments in Physics",
    ],
    userName: req.user.displayName,
    userEmail: req.user.user,
  });
});

//Chemistry - 11, 12

app.get("/12thchem", isLoggedIn, (req, res) => {
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/12thchem.handlebars",
    "utf-8"
  );
  res.json({
    fileContent: fileContent,
    title: "12th Chemistry",
    chapter: [
      "Metallurgy",
      "p-Block Elements-I",
      "p-Block Elements - II",
      "Transition and Inner Transition Elements",
      "Coordination Chemistry",
      "Solid State",
      "Chemical Kinetics",
      "Ionic Equilibrium",
      "Electro Chemistry",
      "Surface Chemistry",
      "Hydroxy Compounds and Ethers",
      "Carbonyl Compounds and Carboxylic Acids",
      "Organic Nitrogen Compounds",
      "Biomolecules",
      "Chemistry in Everyday Life",
    ],
    userName: req.user.displayName,
    userEmail: req.user.user,
  });
});

app.get("/11thchem", isLoggedIn, (req, res) => {
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/11thchem.handlebars",
    "utf-8"
  );
  res.json({
    fileContent: fileContent,
    title: "11th Chemistry",
    chapter: [
      "Basic Concepts of Chemistry and Chemical Calculations",
      "Quantum Mechanical Model of Atom",
      "Periodic Classification Of Elements",
      "Hydrogen",
      "Alkali and Alkaline Earth Metals",
      "Gaseous State",
      "Thermodynamics",
      "Physical and Chemical Equilibrium",
      "Solutions",
      "Chemical Bonding",
      "Fundamentals of Organic Chemistry",
      "Fundamentals of Organic Chemistry",
      "Hydrocarbons",
      "Haloalkanes and Haloarenes",
      "Environmental Chemistry",
    ],
    userName: req.user.displayName,
    userEmail: req.user.user,
  });
});

//10th Science, Social

app.get("/10thScience", isLoggedIn, (req, res) => {
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/10thscience.handlebars",
    "utf-8"
  );
  res.json({
    fileContent: fileContent,
    title: "10th Science",
    chapter: [
      "Laws of Motion",
      "Optics",
      "Thermal Physics",
      "Electricity",
      "Acoustics",
      "Nuclear Physics",
      "Atoms and Molecules",
      "Periodic Classification of Elements",
      "Solutions",
      "Types of Chemical Reactions",
      "Carbon and its Compounds",
      "Plant Anatomy and Plant Physiology",
    ],
    userName: req.user.displayName,
    userEmail: req.user.user,
  });
});

app.get("/10thSocial", isLoggedIn, (req, res) => {
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/10thsocial.handlebars",
    "utf-8"
  );
  res.json({
    fileContent: fileContent,
    title: "10th Social",
    sub: [
      {
        name: "History",
        chaps: [
          "Outbreak of World War I and Its Aftermath",
          "The World between two World Wars",
          "World war II",
          "The World after World War II",
          "Social and Religious Reform Movements in the 19th Century",
          "Early Revolts against British Rule in Tamil Nadu",
          "Anti-Colonial Movements and the Birth of Nationalism",
          "Nationalism: Gandhian Phase",
          "Freedom Struggle in Tamil Nadu",
          "Social Transformation in Tamil Nadu",
        ],
      },
      {
        name: "Geography",
        chaps: [
          "India - Location, Relief and Drainage",
          "Climate and Natural Vegetation of India",
          "India - Agriculture",
          "India - Resources and Industries",
          "India - Population, Transport, Communication and Trade",
          "Physical Geography of Tamil Nadu",
          "Human Geography of Tamil Nadu",
        ],
      },
      {
        name: "Civics",
        chaps: [
          "Indian Constitution",
          "Central Government",
          "State Government",
          "India’s Foreign Policy",
          "India’s International Relations",
        ],
      },
      {
        name: "Economics",
        chaps: [
          "Gross Domestic Product and its Growth: an Introduction",
          "Globalization and Trade",
          "Food Security and Nutrition",
          "Government and Taxes",
          "Industrial Clusters in Tamil Nadu",
        ],
      },
    ],
    userName: req.user.displayName,
    userEmail: req.user.user,
  });
});

//maps are used for data sanitization from the user to prevent sql injection
let numberMap = new Map([
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
  ["6", "6"],
  ["7", "7"],
  ["8", "8"],
  ["9", "9"],
  ["10", "10"],
  ["11", "11"],
  ["12", "12"],
  ["13", "13"],
  ["14", "14"],
  ["15", "15"],
  ["16", "16"],
  ["17", "17"],
  ["18", "18"],
  ["19", "19"],
  ["20", "20"],
  ["21", "21"],
  ["22", "22"],
  ["23", "23"],
  ["24", "24"],
  ["25", "25"],
]);

let example_exercise_map = new Map([
  ["Examples", "example_no"],
  ["Exercise", "exercise_no"],
]);

//example for database
app.post("/10thmath/chapter", isLoggedIn, (req, res) => {
  debugger;
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/videotemplate.handlebars",
    "utf-8"
  );
  //in request you should give (chapter, exercise or example that may be boolean, problem_number);
  let data = req.body;
  console.log(data);
  let chapter = data.chapter_exercise.split("-")[0];
  chapter = numberMap.get(chapter);
  let exercise = data.chapter_exercise.split("-")[1];
  exercise = numberMap.get(exercise);
  let type = data.type.split(" ")[0];
  type = example_exercise_map.get(type);
  console.log("type: ", type, "chapter: ", chapter, "exercise: ", exercise);

  //query
  function fetchData() {
    return new Promise((resolve, reject) => {
      client.query(
        `SELECT problem_no, youtube_link, image FROM maths10 WHERE chapter_no = ${chapter} AND ${type} = ${exercise} ORDER BY problem_no ASC;`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(result.rows);
            resolve(result.rows);
          }
        }
      );
    });
  }

  fetchData()
    .then((rows) => {
      res.send(JSON.stringify({ data: rows, fileContent: fileContent }));
    })
    .catch((error) => {
      console.error("Error:", error.message);
      res.status(500).send("An error occurred");
    });
});

app.post("/11thmath/chapter", isLoggedIn, (req, res) => {
  debugger;
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/videotemplate.handlebars",
    "utf-8"
  );
  //in request you should give (chapter, exercise or example that may be boolean, problem_number);
  let data = req.body;
  console.log(data);
  let chapter = data.chapter_exercise.split("-")[0];
  chapter = numberMap.get(chapter);
  let exercise = data.chapter_exercise.split("-")[1];
  exercise = numberMap.get(exercise);
  let type = data.type.split(" ")[0];
  type = example_exercise_map.get(type);
  console.log("type: ", type, "chapter: ", chapter, "exercise: ", exercise);

  //query
  function fetchData() {
    return new Promise((resolve, reject) => {
      client.query(
        `SELECT problem_no, youtube_link, image FROM maths11 WHERE chapter_no = ${chapter} AND ${type} = ${exercise} ORDER BY problem_no ASC;`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(result.rows);
            resolve(result.rows);
          }
        }
      );
    });
  }

  fetchData()
    .then((rows) => {
      res.send(JSON.stringify({ data: rows, fileContent: fileContent }));
    })
    .catch((error) => {
      console.error("Error:", error.message);
      res.status(500).send("An error occurred");
    });
});

app.post("/12thmath/chapter", isLoggedIn, (req, res) => {
  debugger;
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/videotemplate.handlebars",
    "utf-8"
  );
  //in request you should give (chapter, exercise or example that may be boolean, problem_number);
  let data = req.body;
  console.log(data);
  let chapter = data.chapter_exercise.split("-")[0];
  chapter = numberMap.get(chapter);
  let exercise = data.chapter_exercise.split("-")[1];
  exercise = numberMap.get(exercise);
  let type = data.type.split(" ")[0];
  type = example_exercise_map.get(type);
  console.log("type: ", type, "chapter: ", chapter, "exercise: ", exercise);

  //query
  function fetchData() {
    return new Promise((resolve, reject) => {
      client.query(
        `SELECT problem_no, youtube_link, image FROM maths12 WHERE chapter_no = ${chapter} AND ${type} = ${exercise} ORDER BY problem_no ASC;`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(result.rows);
            resolve(result.rows);
          }
        }
      );
    });
  }

  fetchData()
    .then((rows) => {
      res.send(JSON.stringify({ data: rows, fileContent: fileContent }));
    })
    .catch((error) => {
      console.error("Error:", error.message);
      res.status(500).send("An error occurred");
    });
});

//10th social post request
app.post("/10thsocial/chapter", (req, res) => {
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/videotemplateSocial.handlebars",
    "utf-8"
  );

  let chapter = req.body.chapter_no;

  //query
  function fetchData() {
    return new Promise((resolve, reject) => {
      client.query(
        `SELECT topic, youtube_link FROM social10 WHERE chapter = ${chapter} order by id asc;`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(result.rows);
            resolve(result.rows);
          }
        }
      );
    });
  }

  fetchData()
    .then((rows) => {
      res.send(JSON.stringify({ data: rows, fileContent: fileContent }));
    })
    .catch((error) => {
      console.error("Error:", error.message);
      res.status(500).send("An error occurred");
    });
});

//server starts
app.listen(port, () => console.log(`App listening to port ${port}`));

//testing purpose

app.get("/demo", (req, res) => {
  console.log("loggedIn /10thmath");
  debugger;
  let fileContent = fs.readFileSync(
    "/Users/krishnaraj/Downloads/Personal/MadrasPalli/MadrasPalli/views/demo.handlebars",
    "utf-8"
  );
  res.json({
    fileContent: fileContent,
    title: "demo Mathematics",
    chapter: [
      {
        name: "Relations and Functions",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        name: "Numbers and Sequences",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
      {
        name: "Algebra",
        exercise: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      {
        name: "Geometry",
        exercise: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Coordinate Geometry",
        exercise: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Trigonometry",
        exercise: [1, 2, 3],
      },
      {
        name: "Mensuration",
        exercise: [1, 2, 3, 4, 5],
      },
      {
        name: "Statistics and Probability",
        exercise: [1, 2, 3, 4, 5, 6],
      },
    ],
  });
});
