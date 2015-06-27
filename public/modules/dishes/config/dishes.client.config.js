'use strict';

// Configuring the Articles module
angular.module('dishes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Dishes', 'dishes', 'dropdown', '/dishes(/create)?');
		Menus.addSubMenuItem('topbar', 'dishes', 'List Dishes', 'dishes');
		Menus.addSubMenuItem('topbar', 'dishes', 'New Dish', 'dishes/create');
	}
]);