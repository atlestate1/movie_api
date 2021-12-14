const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('common'));

//Create directory of movies with at least one actor//
let topMovies = [
  {
    title: 'Soul Food',
    actor: 'Nia Long'
  },
  {
    title: 'Waiting to Exhale',
    actor: 'Whitney Houston'
  },
  {
    title: 'Paid In Full',
    actor: 'Mehki Pfiher'
  },
  {
    title: 'Boomerang',
    actor: 'Eddie Murphy'
  },
  { 
    title: 'Love Jones',
    actor: 'Larenz Tate'
  },
  { 
    title: 'Hav Plenty',
    actor: 'Robinne Lee'
  },
  {
    title: 'The Best Man',
    actor: 'Taye Diggs'
  },
  {
    title: 'Boyz In The Hood',
    actor: 'Morris Chestnut'
  },
  {
    title: 'Equalizer',
    actor: 'Denzel Washington'
  },
  {
    title: 'Set It Off',
    actor: 'Vivica Fox'
  }
];

//static request//
app.use(express.static('public'));

// create GET requests //
app.get('/', (req, res) => {
  res.send('Welcome to MyFlix!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//error handling//
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests //
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});