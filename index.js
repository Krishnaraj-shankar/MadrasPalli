const express = require('express');
const app = express();
const port = 3000;
//Loads the handlebars module
const {engine} = require('express-handlebars');
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