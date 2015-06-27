'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories',
function($scope, $stateParams, $location, Authentication, Categories) {
  $scope.authentication = Authentication;
  $scope.currentPage = 1;
  $scope.pageSize = 10;
  $scope.offset = 0;

 // Page changed handler
 $scope.pageChanged = function() {
    $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
 };

  // Create new Category
  $scope.create = function() {
      // Create new Category object
    var category = new Categories ({
        name: this.name,
        description: this.description,
        icon: this.icon
    });

    // Redirect after save
    category.$save(function(response) {
        $location.path('categories/' + response._id);

        // Clear form fields
        $scope.name = '';
    }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
    });
  };

  // Remove existing Category
  $scope.remove = function(category) {
    if ( category ) { 
        category.$remove();

      for (var i in $scope.categories) {
        if ($scope.categories [i] === category) {
            $scope.categories.splice(i, 1);
        }
      }
    } else {
      $scope.category.$remove(function() {
        $location.path('categories');
      });
    }
  };

  // Update existing Category
  $scope.update = function() {
    var category = $scope.category;

    category.$update(function() {
      $location.path('categories/' + category._id);
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  // Find a list of Categories
  $scope.find = function() {
    $scope.categories = Categories.query();
  };

  // Find existing Category
  $scope.findOne = function() {
    $scope.category = Categories.get({ 
        categoryId: $stateParams.categoryId
    });
  };

  // Search for a category
  $scope.categorySearch = function(product) {
    $location.path('categories/' + product._id);
  };
}
]);