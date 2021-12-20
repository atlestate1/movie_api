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

app.get('/movies/:title', (req, res) => {
  res.json('Show specific movie');
});

app.get('/genres/:genres', (req, res) => {
  res.send('Movie title and its genre');
});

app.get('/directors/:directors', (req, res) => {
  res.send('Director Info');
});

app.post('/users', (req, res) => {
  res.send('Registration completed');
});

app.put('/users/:username', (req, res) => {
  res.send('Information updated');
});

app.post('/users/:username/movies/:favorites', (req, res) => {
  res.send('Movie was added to favorites');
});

app.delete('/users/:username/movies/:favorites', (req, res) => {
  res.send('Movie was deleted from  your favorites');
});

app.delete('/users/:username', (req, res) => {
  res.send('Account deletion complete');
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

//database names: movies: movieAPI, genres: genresAPI, directors: directorsAPI, users: usersAPI//
