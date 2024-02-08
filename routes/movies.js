const { celebrate, Joi } = require('celebrate');
const Router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/cards');

Router.get('/movies', getMovies);
Router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    trailerLink: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    thumbnail: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    owner: Joi.string().length(24).hex().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createCard);
Router.delete('/movies/:_Id', celebrate({
  params: Joi.object().keys({
    _Id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = Router;
