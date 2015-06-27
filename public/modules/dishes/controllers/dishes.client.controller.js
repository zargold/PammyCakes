'use strict';

// Dishes controller
angular.module('dishes').controller('DishesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dishes',
	function($scope, $stateParams, $location, Authentication, Dishes) {
		$scope.authentication = Authentication;

		// Create new Dish
		$scope.create = function() {
			// Create new Dish object
			var dish = new Dishes ({
				name: this.name
			});

			// Redirect after save
			dish.$save(function(response) {
				$location.path('dishes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dish
		$scope.remove = function(dish) {
			if ( dish ) { 
				dish.$remove();

				for (var i in $scope.dishes) {
					if ($scope.dishes [i] === dish) {
						$scope.dishes.splice(i, 1);
					}
				}
			} else {
				$scope.dish.$remove(function() {
					$location.path('dishes');
				});
			}
		};

		// Update existing Dish
		$scope.update = function() {
			var dish = $scope.dish;

			dish.$update(function() {
				$location.path('dishes/' + dish._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dishes
		$scope.find = function() {
			$scope.dishes = Dishes.query();
		};

		// Find existing Dish
		$scope.findOne = function() {
			$scope.dish = Dishes.get({ 
				dishId: $stateParams.dishId
			});
		};
	}
]);