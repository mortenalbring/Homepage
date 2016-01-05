var angularClicker = angular.module("AngularClicker",[]);

angularClicker.controller("HomeController", function($scope) {
    $scope.test = "Moop";
    $scope.EnemyHealth = 10;

    $scope.reduceEnemyHealth = function() {
        $scope.EnemyHealth = $scope.EnemyHealth - 1;
    }

});