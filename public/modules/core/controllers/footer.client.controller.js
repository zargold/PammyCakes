'use strict';
angular.module('core').controller('FooterController', ['$scope',
  function($scope) {
    $scope.copyYear = new Date().getFullYear();
  }
]);