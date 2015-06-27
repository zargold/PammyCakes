'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dish = mongoose.model('Dish'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dish;

/**
 * Dish routes tests
 */
describe('Dish CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Dish
		user.save(function() {
			dish = {
				name: 'Dish Name'
			};

			done();
		});
	});

	it('should be able to save Dish instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dish
				agent.post('/dishes')
					.send(dish)
					.expect(200)
					.end(function(dishSaveErr, dishSaveRes) {
						// Handle Dish save error
						if (dishSaveErr) done(dishSaveErr);

						// Get a list of Dishes
						agent.get('/dishes')
							.end(function(dishesGetErr, dishesGetRes) {
								// Handle Dish save error
								if (dishesGetErr) done(dishesGetErr);

								// Get Dishes list
								var dishes = dishesGetRes.body;

								// Set assertions
								(dishes[0].user._id).should.equal(userId);
								(dishes[0].name).should.match('Dish Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dish instance if not logged in', function(done) {
		agent.post('/dishes')
			.send(dish)
			.expect(401)
			.end(function(dishSaveErr, dishSaveRes) {
				// Call the assertion callback
				done(dishSaveErr);
			});
	});

	it('should not be able to save Dish instance if no name is provided', function(done) {
		// Invalidate name field
		dish.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dish
				agent.post('/dishes')
					.send(dish)
					.expect(400)
					.end(function(dishSaveErr, dishSaveRes) {
						// Set message assertion
						(dishSaveRes.body.message).should.match('Please fill Dish name');
						
						// Handle Dish save error
						done(dishSaveErr);
					});
			});
	});

	it('should be able to update Dish instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dish
				agent.post('/dishes')
					.send(dish)
					.expect(200)
					.end(function(dishSaveErr, dishSaveRes) {
						// Handle Dish save error
						if (dishSaveErr) done(dishSaveErr);

						// Update Dish name
						dish.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dish
						agent.put('/dishes/' + dishSaveRes.body._id)
							.send(dish)
							.expect(200)
							.end(function(dishUpdateErr, dishUpdateRes) {
								// Handle Dish update error
								if (dishUpdateErr) done(dishUpdateErr);

								// Set assertions
								(dishUpdateRes.body._id).should.equal(dishSaveRes.body._id);
								(dishUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dishes if not signed in', function(done) {
		// Create new Dish model instance
		var dishObj = new Dish(dish);

		// Save the Dish
		dishObj.save(function() {
			// Request Dishes
			request(app).get('/dishes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dish if not signed in', function(done) {
		// Create new Dish model instance
		var dishObj = new Dish(dish);

		// Save the Dish
		dishObj.save(function() {
			request(app).get('/dishes/' + dishObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dish.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dish instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dish
				agent.post('/dishes')
					.send(dish)
					.expect(200)
					.end(function(dishSaveErr, dishSaveRes) {
						// Handle Dish save error
						if (dishSaveErr) done(dishSaveErr);

						// Delete existing Dish
						agent.delete('/dishes/' + dishSaveRes.body._id)
							.send(dish)
							.expect(200)
							.end(function(dishDeleteErr, dishDeleteRes) {
								// Handle Dish error error
								if (dishDeleteErr) done(dishDeleteErr);

								// Set assertions
								(dishDeleteRes.body._id).should.equal(dishSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dish instance if not signed in', function(done) {
		// Set Dish user 
		dish.user = user;

		// Create new Dish model instance
		var dishObj = new Dish(dish);

		// Save the Dish
		dishObj.save(function() {
			// Try deleting Dish
			request(app).delete('/dishes/' + dishObj._id)
			.expect(401)
			.end(function(dishDeleteErr, dishDeleteRes) {
				// Set message assertion
				(dishDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dish error error
				done(dishDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Dish.remove().exec();
		done();
	});
});