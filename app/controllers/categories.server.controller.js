'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Category = mongoose.model('Category'),
    _ = require('lodash');

/**
 * Create a Category
 */
exports.create = function(req, res) {
  var category = new Category(req.body);

  category.save(function(err) {
    if (err) {
      return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.status(201).json(category);
    }
  });
};

/**
 * Show the current Category
 */
exports.read = function(req, res) {
    Category.findById(req.params.categoryId).exec(function(err, category) {
        if (err) {
          return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
          });
      } else {
         if (!category) {
                return res.status(404).send({
                    message: 'Category not found'
                });
            }
            res.json(category);
      }
    });
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
  var category = req.category;
 
  category = _.extend(category, req.body);
 
  category.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * Delete an Category
 */
exports.delete = function(req, res) {
  var category = req.category;
 
  category.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
  Category.find().exec(function(err, categories) {
      if (err) {
          return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
          });
      } else {
          res.json(categories);
      }
  });
};

/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) {
 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Category is invalid'
    });
  }
 
  Category.findById(id).exec(function(err, category) {
    if (err) return next(err);
    if (!category) {
      return res.status(404).send({
          message: 'Category not found'
        });
    }
    req.category = category;
    next();
  });
};