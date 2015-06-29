'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Category = mongoose.model('Category'),
    _ = require('lodash');

var crud = require('./crud.server.controller')('Dish', 'name');

module.exports = crud;