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

//static request//
app.use(express.static('public'));

// create GET requests //
app.get('/', (req, res) => {
  res.send('Welcome to MyFlix!');
});

app.get('/movies', (req, res) => {
  movieAPI.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:title', (req, res) => {
  movieAPI.findOne({ Title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/genres/:genre', (req, res) => {
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

app.get('/directors/:director', (req, res) => {
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
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
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

app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
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

app.post('/users/:username/:favoriteMovies', (req, res) => {
  Users.findOneAndUpdate({userName: req.params.userName}, {
    $push: {FavoriteMovies: req.params.title}
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

app.delete('/users/:username/:favoriteMovies', (req, res) => {
  Users.findOneAndUpdate({userName: req.params.userName}, {
    $pull: {FavoriteMovies: req.params.title}
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

app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({ userName: req.params.deleteUser})
    .then((user) =>{
        if (!user) {
            res.status(400).send(req.params.userName + ' was not found');
        } else {
            res.status(200).send(req.params.userName + ' was deleted');
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


