const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Configure Handlebars as the view engine
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials',
  })
);
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views'));


// Define a route to render the template
app.get('/', (req, res) => {
  const data = {
    title: 'My Blog',
    author: 'John Doe',
    items: ['Item 1', 'Item 2', 'Item 3']
  };
  
  res.render('index', data);
});

// Start the server
app.listen(1234, () => {
  console.log('Server started on port 1234');
});