const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const movieAPI = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movieAPI', { useNewUrlParser: true, useUnifiedTopology: true });

const bodyParser = require('body-parser');



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('common'));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//static request//
app.use(express.static('public'));

// create GET requests //
app.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.send('Welcome to MyFlix!');
});

app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  movieAPI.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
  movieAPI.findOne({ Title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/genres/:genre', passport.authenticate('jwt', {session: false}), (req, res) => {
  movieAPI.findOne({ 'Genre.Name': req.params.genre })
  .then((movie) => {
    if (movie) {
    res.json(movie.Genre);
  } else {
    res.json("There is no movie with this genre.");
  }
})
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/directors/:director', passport.authenticate('jwt', {session: false}), (req, res) => {
  movieAPI.findOne({ 'Director.Name': req.params.director })
  .then((movie) => {
    if (movie) {
      res.json(movie.Director);
    } else {
    res.json("There is no director with that name.");
  }
})
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.post('/users', (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        Users.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

app.put('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, { $set:
    {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.post('/users/:username/:movieId', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({username: req.params.username}, {
    $push: {favoriteMovies: req.params.movieId}
},
{ new: true},
(err, updatedUser) => {
   if (err) {
       console.error(err);
       res.status(500).send('Error' + err);
   } else {
       res.json(updatedUser);
   }
});
});

app.delete('/users/:username/:movieId', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({username: req.params.username}, {
    $pull: {favoriteMovies: req.params.movieId}
},
{ new: true},
(err, updatedUser) => {
   if (err) {
       console.error(err);
       res.status(500).send('Error' + err);
   } else {
       res.json(updatedUser);
   }
});
});

app.delete('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({username: req.params.username})
    .then((user) =>{
        if (!user) {
            res.status(400).send(req.params.username + ' was not found');
        } else {
            res.status(200).send(req.params.username + ' was deleted');
        }
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
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