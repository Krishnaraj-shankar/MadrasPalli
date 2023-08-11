const express = require('express');
const { Client } = require('pg');

const client = new Client({
    host:'localhost',
    user:'postgres',
    port:5432,
    password:"root",
    database:"madrasPalli"
})

client.connect();

client.query(`select youtube_link from maths_10th where (chapter_no=1 and exercise_no=2 and problem_no=2)`,(err,res)=>{
    if(!err) console.log("outuput: ",res.rows);
    else console.log("err: ",err.message);
    client.end();
})

// client.query(`select * from maths_10th`,(err,res)=>{
//     //possible data are rowCount->number of rows we got, command->we given command, rows -> values 
//     if(!err) console.log(res.rows);
//     else console.log(err);
//     client.end();
// })


const app = express();
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








app.get('/', (req, res) => {
//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
res.render('main', {layout : 'index'});
});

// app.get('/', (req, res) => {
// //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
// res.render('main', {layout: 'index'});
// });

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About us',
    });
});




app.get('/subject', (req,res) => {
    res.render('subject', {
        layout : 'index',
        title: 'Subject',
    });
});

app.listen(port, () => console.log(`App listening to port ${port}`));






//example for database
app.post("/maths_10th",(req,res)=>{
    //in request you should give (chapter, exercise or example that may be boolean, problem_number);
    let chapter = req.body.chapter;
    let exercise = req.body.exercise;
    // client.query(`select youtube_link from maths_10th where (chapter=${chapter} and exercise=${exercise} and problem_number=${problem_number}`)
})




// {/* <iframe width="1022" height="575" src="https://www.youtube.com/embed/_n-Ai30C1qs" title="How to Connect Node js to PostgreSQL Database and Fetch data" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}