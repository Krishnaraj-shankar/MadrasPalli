const express = require('express');
const { Client } = require('pg');

const client = new Client({
    host:'localhost',
    user:'postgres',
    port:5432,
    password:"admin",
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



// Mathematics

app.get("/10thmath",(req,res)=>{
    res.render('10thmath', {
        title: '10th Mathematics',
        chapter: [{
            name: "Sets",
            exercise: [1,2,3,]
        },
        {
            name: "Calculus",
            exercise: [1,2,3,4,5,6]
        },
    ]
    })
        
})

app.get("/11thmath",(req,res)=>{
    res.render('11thmath', {
        layout: 'index',
        title: '11th Mathematics',
        chapter: [{
            name: "Sets",
            exercise: [1,2,3,]
        },
        {
            name: "Calculus",
            exercise: [1,2,3,4,5,6]
        },
    ]
    })
        
})

app.get("/12thmath",(req,res)=>{
    res.render('12thmath', {
        layout: 'index',
        title: '12th Mathematics',
        chapter: [{
            name: "Sets",
            exercise: [1,2,3,]
        },
        {
            name: "Calculus",
            exercise: [1,2,3,4,5,6]
        },
    ]
    })
        
})


// Physics

app.get("/11thphy",(req,res)=>{
    res.render('11thphy', {
        layout: 'index',
        title: '11th Physics',
        chapter: [{
            name: "Sets",
            exercise: [1,2,3,]
        },
        {
            name: "Calculus",
            exercise: [1,2,3,4,5,6]
        },
    ]
    })
        
})

app.get("/12thphy",(req,res)=>{
    res.render('12thphy', {
        layout: 'index',
        title: '12th Physics',
        chapter: [{
            name: "Sets",
            exercise: [1,2,3,]
        },
        {
            name: "Calculus",
            exercise: [1,2,3,4,5,6]
        },
    ]
    })
        
})








app.listen(port, () => console.log(`App listening to port ${port}`));






//example for database
app.post("/maths_10th",(req,res)=>{
    //in request you should give (chapter, exercise or example that may be boolean, problem_number);
    let chapter = req.body.chapter;
    let exercise = req.body.exercise;
    // client.query(`select youtube_link from maths_10th where (chapter=${chapter} and exercise=${exercise} and problem_number=${problem_number}`)
})




// {/* <iframe width="1022" height="575" src="https://www.youtube.com/embed/_n-Ai30C1qs" title="How to Connect Node js to PostgreSQL Database and Fetch data" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}