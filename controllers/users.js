const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const { getJwtToken } = require('../utils/jwt');
const BadRequestError = require('../errors/bad-request-error');
const NotRightError = require('../errors/not-right-error');
const ConflictError = require('../errors/conflict-error');

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      email,
      password: hash,
      name,
    }))
    .then((data) => res.status(201).send({
      _id: data._id,
      email: data.email,
      name: data.name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Incorrect user info error'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('User with an email address exists'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotRightError('user not found');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotRightError('password is not correct'));
          }
          const token = getJwtToken({ _id: user._id });
          return res.status(200).send({ token });
        });
    })
    .catch(next);
};

const updateUser = (req, res, next) => UserModel
  .findByIdAndUpdate(req.user, req.body, { new: true, runValidators: true })
  .then((data) => res.status(200).send(data))
  .catch((err) => {
    console.log(err);
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Incorrect user info'));
    }
    return next(err);
  });

const getUser = (req, res, next) => UserModel
  .findById(req.user._id)
  .then((data) => res.status(200).send(data))
  .catch(next);

module.exports = {
  getUser,
  updateUser,
  login,
  createUser,
};
