const MovieModel = require('../models/movie');
const BadRequestError = require('../errors/badrequest-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN} = req.body;
  return MovieModel.create({ country, director, duration, year, description, image, trailerLink, thumbnail, owner: req.user, movieId, nameRU, nameEN })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Movie not added: ${err.name}: ${err.message}`));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  CardModel.find()
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  MovieModel.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Card not found');
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Card not deleted');
      }
      movie.deleteOne()
        .then(() => res.status(200).send(movie))
        .catch(next);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        next(new BadRequestError(`Invalid Card Id: ${err.name}: ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
