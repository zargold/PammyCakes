'use strict';

(function() {
	// Dishes Controller Spec
	describe('Dishes Controller Tests', function() {
		// Initialize global variables
		var DishesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Dishes controller.
			DishesController = $controller('DishesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dish object fetched from XHR', inject(function(Dishes) {
			// Create sample Dish using the Dishes service
			var sampleDish = new Dishes({
				name: 'New Dish'
			});

			// Create a sample Dishes array that includes the new Dish
			var sampleDishes = [sampleDish];

			// Set GET response
			$httpBackend.expectGET('dishes').respond(sampleDishes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dishes).toEqualData(sampleDishes);
		}));

		it('$scope.findOne() should create an array with one Dish object fetched from XHR using a dishId URL parameter', inject(function(Dishes) {
			// Define a sample Dish object
			var sampleDish = new Dishes({
				name: 'New Dish'
			});

			// Set the URL parameter
			$stateParams.dishId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/dishes\/([0-9a-fA-F]{24})$/).respond(sampleDish);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dish).toEqualData(sampleDish);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Dishes) {
			// Create a sample Dish object
			var sampleDishPostData = new Dishes({
				name: 'New Dish'
			});

			// Create a sample Dish response
			var sampleDishResponse = new Dishes({
				_id: '525cf20451979dea2c000001',
				name: 'New Dish'
			});

			// Fixture mock form input values
			scope.name = 'New Dish';

			// Set POST response
			$httpBackend.expectPOST('dishes', sampleDishPostData).respond(sampleDishResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dish was created
			expect($location.path()).toBe('/dishes/' + sampleDishResponse._id);
		}));

		it('$scope.update() should update a valid Dish', inject(function(Dishes) {
			// Define a sample Dish put data
			var sampleDishPutData = new Dishes({
				_id: '525cf20451979dea2c000001',
				name: 'New Dish'
			});

			// Mock Dish in scope
			scope.dish = sampleDishPutData;

			// Set PUT response
			$httpBackend.expectPUT(/dishes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dishes/' + sampleDishPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dishId and remove the Dish from the scope', inject(function(Dishes) {
			// Create new Dish object
			var sampleDish = new Dishes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dishes array and include the Dish
			scope.dishes = [sampleDish];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/dishes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDish);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dishes.length).toBe(0);
		}));
	});
}());