'use strict';

//Setting up route
angular.module('dishes').config(['$stateProvider',
	function($stateProvider) {
		// Dishes state routing
		$stateProvider.
		state('listDishes', {
			url: '/dishes',
			templateUrl: 'modules/dishes/views/list-dishes.client.view.html'
		}).
		state('createDish', {
			url: '/dishes/create',
			templateUrl: 'modules/dishes/views/create-dish.client.view.html'
		}).
		state('viewDish', {
			url: '/dishes/:dishId',
			templateUrl: 'modules/dishes/views/view-dish.client.view.html'
		}).
		state('editDish', {
			url: '/dishes/:dishId/edit',
			templateUrl: 'modules/dishes/views/edit-dish.client.view.html'
		});
	}
]);