require('dotenv').config();

const express = require('express');
const { Client } = require('pg');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken')
const cors = require('cors');
require('./auth');

const client = new Client({
    host:'localhost',
    user:'postgres',
    port:5432,
    password:"root",
    database:"madrasPalli"
})

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
const {engine} = require('express-handlebars');
// const client = require('pg/lib/native/client');
//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');
//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', engine({
layoutsDir: __dirname + '/views/layouts',
defaultLayout: 'index',
partialsDir: __dirname + '/views/partials/',
}));
app.use(express.static('public'))



// Use built-in middleware to parse JSON request bodies
app.use(express.json());

// Use built-in middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


function isLoggedIn(req, res, next) {
    // req.user ? next() : res.redirect("/login");
    // res.render('login')
    if(req.user){
      console.log("req.user",req.user);
      next();
    } else if(req.headers.authorization) {

      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      if (token == null) res.render('login');
    
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        // console.log(err)
        if (err) return res.render('login');
        console.log("user: ",user);
        req.user = user;
        next()
      })

        // console.log({"req.headers.authorization" : req.headers.authorization});
        // console.log("here we should authenticate with jwt.verify");
        // next();
    } else {
      res.render('login');
    }
  }

app.get("/main", isLoggedIn, (req,res)=>{
    res.render('main');
})



app.get('/',(req, res) => {
//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
// if(req.user){
//     console.log("req.user.accessTokenJWT" , req.user.accessTokenJWT);
//     res.render('main',{accessTokenJWT : req.user.accessTokenJWT});
//   } else {
//     console.log("I'm home");
//     res.send("Not to be printed inside '/' route ");
//   }

// if(req.user){
//   console.log("req.user from '/' : ",req.user);
//   res.render('main')
// }

if(req.user){
  console.log("req.user.accessTokenJWT: ",req.user.accessTokenJWT);
  res.render('main',{accessTokenJWT : req.user.accessTokenJWT});
}
else{
  res.render('main');
}
// res.render('main', {layout : 'index'});
});


app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/api/sessions/oauth/google',
  passport.authenticate( 'google', {
    successRedirect: '/',
    failureRedirect: '/auth/google/failure'
  })
);


app.get('/auth/google/failure', (req, res) => {
  console.log("authentication failed");
    res.render('login');
  });

app.get('/about',isLoggedIn , (req,res) => {
    res.render('about', {
        title: 'About us',
    });
});


app.get('/login', (req,res)=>{
    res.render('login');
})


app.get("/subject",isLoggedIn ,(req,res)=>{
    res.render('subject')
        
})

app.post('/subject',isLoggedIn , function (req, res) {
    console.log("data: ",req.body);
  res.send('welcome, ' + req.body)
})

app.get('/10th/physics', isLoggedIn, function(req,res){
  res.render('physics10th');
})


app.listen(port, () => console.log(`App listening to port ${port}`));





