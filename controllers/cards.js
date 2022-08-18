const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ForbiddenError = require('../errors/forbidden-err');
const ServerError = require('../errors/server-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new ServerError('Произошла ошибка на сервере')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Введены некорректные данные'));
      }
      next(new ServerError('Произошла ошибка на сервере'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('Можно удалять только свои карточки');
      }
    })
    .then(() => {
      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          res.status(200).send({ data: card });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Введены некорректные данные'));
      } if(err.statusCode === 404 || err.statusCode === 403) {
        return next(err);
      }
      next(new ServerError('Произошла ошибка на сервере'));
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Введены некорректные данные'));
      } if(err.statusCode === 404) {
        return next(err);
      }
      next(new ServerError('Произошла ошибка на сервере'));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Введены некорректные данные'));
      } if(err.statusCode === 404) {
        return next(err);
      }
      next(new ServerError('Произошла ошибка на сервере'));
    });
};
