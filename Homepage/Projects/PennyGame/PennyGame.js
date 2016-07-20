var pennyGame = angular.module("PennyGame", []);

pennyGame.controller("HomeController", function ($scope) {
    $scope.test = "moop";

    $scope.results = [];

    $scope.flipCoin = function (iterations) {
        for (var i = 0; i < iterations; i++) {
            var randNumber = Math.random();

            if (randNumber < 0.5) {
                $scope.result = "H";
            }
            else {
                $scope.result = "T";
            }
            $scope.results.push($scope.result);
        }

    }

    $scope.headstotal = $scope.results.filter(function (e) {
        return e == "H"
    });

})