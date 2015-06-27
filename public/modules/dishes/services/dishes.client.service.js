'use strict';

//Dishes service used to communicate Dishes REST endpoints
angular.module('dishes').factory('Dishes', ['$resource',
	function($resource) {
		return $resource('dishes/:dishId', { dishId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);