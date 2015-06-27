'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Dish = mongoose.model('Dish'),
	_ = require('lodash');

/**
 * Create a Dish
 */
exports.create = function(req, res) {
	var dish = new Dish(req.body);
	dish.user = req.user;

	dish.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dish);
		}
	});
};

/**
 * Show the current Dish
 */
exports.read = function(req, res) {
	res.jsonp(req.dish);
};

/**
 * Update a Dish
 */
exports.update = function(req, res) {
	var dish = req.dish ;

	dish = _.extend(dish , req.body);

	dish.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dish);
		}
	});
};

/**
 * Delete an Dish
 */
exports.delete = function(req, res) {
	var dish = req.dish ;

	dish.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dish);
		}
	});
};

/**
 * List of Dishes
 */
exports.list = function(req, res) { 
	Dish.find().sort('-created').populate('user', 'displayName').exec(function(err, dishes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dishes);
		}
	});
};

/**
 * Dish middleware
 */
exports.dishByID = function(req, res, next, id) { 
	Dish.findById(id).populate('user', 'displayName').exec(function(err, dish) {
		if (err) return next(err);
		if (! dish) return next(new Error('Failed to load Dish ' + id));
		req.dish = dish ;
		next();
	});
};

/**
 * Dish authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.dish.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
