'use strict';

module.exports = function(app) {
	var dishes = require('../controllers/dishes.server.controller');
	var users = require('../controllers/users.server.controller');
	var apiAuth = require('../controllers/api.authorization.server.controller');
	
	app.route('/dishes')
		.get(apiAuth, users.requiresLogin, dishes.list)
		.post(apiAuth, users.requiresLogin, dishes.create);

	app.route('/dishes/:dishId')
		.get(apiAuth, users.requiresLogin, dishes.read)
		.put(apiAuth, users.requiresLogin, dishes.update)
		.delete(apiAuth, users.requiresLogin, dishes.delete);

	// Finish by binding the article middleware
	app.param('dishId', dishes.getByID);
};