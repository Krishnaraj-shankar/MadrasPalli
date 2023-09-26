require("dotenv").config();
const express = require("express");
const { Client } = require("pg");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cors = require("cors");
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

const app = express();
app.use(cors());
const port = 3000;

//Loads the handlebars module
const { engine } = require("express-handlebars");
// const client = require('pg/lib/native/client');
//Sets our app to use the handlebars engine
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
  // req.user ? next() : res.redirect("/login");
  // res.render('login')
  if (req.user) {
    console.log("req.user", req.user);
    next();
  } else if (req.headers.authorization) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) res.render("login");

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      // console.log(err)
      if (err) return res.render("login");
      console.log("user: ", user);
      req.user = user;
      next();
    });
    // console.log({"req.headers.authorization" : req.headers.authorization});
    // console.log("here we should authenticate with jwt.verify");
    // next();
  } else {
    res.render("login");
  }
}
//ended

app.get("/", (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"

  //newly added
  if (req.user) {
    console.log("req.user.accessTokenJWT: ", req.user.accessTokenJWT);
    res.render("main", {
      layout: "index",
      accessTokenJWT: req.user.accessTokenJWT,
    });
  } else {
    res.render("template", { layout: "index" });
  }
  //ended
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

// app.get('/', (req, res) => {
// //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
// res.render('main', {layout: 'index'});
// });

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

//about us route
app.get("/about", isLoggedIn, (req, res) => {
  res.render("about", {
    title: "About us",
  });
});

app.get("/videos", (req, res) => {
  res.render("video", { title: "video" });
});

// app.get('/subject', async (req,res) => {

//     let data = () =>{
//         client.query(`select youtube_link from maths_10th where (chapter_no=1 and exercise_no=2 and problem_no=2)`,(err,res)=>{
//             if(!err){
//                 console.log("outuput: ",res.rows);
//                 return res.rows
//             }
//             else console.log("err: ",err.message);
//             client.end();
//         })
//     }

//     res.render('subject', {
//         layout : 'index',
//         title: 'Subject',
//         data: await data()
//     });
// });

// app.get('/subject', (req,res) => {

//     const chapterNum = req.query.chapterNum;

//     function fetchData() {
//         return new Promise((resolve, reject) => {
//             client.query(`SELECT id FROM maths_10th WHERE (chapter_no = 1 AND exercise_no = 2 AND problem_no = 2)`, (err, result) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     console.log(result.rows)
//                     resolve(result.rows);
//                 }
//             });
//         });
//     }

//     fetchData()
//         .then(rows => {
//             res.render('subject', {
//                 layout: 'index',
//                 title: 'Subject',
//                 data: JSON.stringify(rows)
//             });
//         })
//         .catch(error => {
//             console.error('Error:', error.message);
//             res.status(500).send('An error occurred');
//         });

// });

// Mathematics - 10, 11, 12

app.get("/10thmath", isLoggedIn, (req, res) => {
  res.render("10thmath", {
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
  });
});

app.get("/11thmath", isLoggedIn, (req, res) => {
  res.render("11thmath", {
    layout: "index",
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
  });
});

app.get("/12thmath", isLoggedIn, (req, res) => {
  res.render("12thmath", {
    layout: "index",
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
  });
});

// Physics - 11, 12

app.get("/11thphy", isLoggedIn, (req, res) => {
  res.render("11thphy", {
    layout: "index",
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
  });
});

app.get("/12thphy", isLoggedIn, (req, res) => {
  res.render("12thphy", {
    layout: "index",
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
  });
});

//Chemistry - 11, 12

app.get("/12thchem", isLoggedIn, (req, res) => {
  res.render("12thchem", {
    layout: "index",
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
  });
});

app.get("/11thchem", isLoggedIn, (req, res) => {
  res.render("11thchem", {
    layout: "index",
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
  });
});

//10th Science, Social

app.get("/10thScience", isLoggedIn, (req, res) => {
  res.render("10thscience", {
    layout: "index",
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
  });
});

app.get("/10thSocial", isLoggedIn, (req, res) => {
  res.render("10thsocial", {
    layout: "index",
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
  });
});

app.listen(port, () => console.log(`App listening to port ${port}`));

//example for database
app.post("/maths_10th", isLoggedIn, (req, res) => {
  //in request you should give (chapter, exercise or example that may be boolean, problem_number);
  let chapter = req.body.chapter;
  let exercise = req.body.exercise;
  // client.query(`select youtube_link from maths_10th where (chapter=${chapter} and exercise=${exercise} and problem_number=${problem_number}`)
});

// {/* <iframe width="1022" height="575" src="https://www.youtube.com/embed/_n-Ai30C1qs" title="How to Connect Node js to PostgreSQL Database and Fetch data" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}