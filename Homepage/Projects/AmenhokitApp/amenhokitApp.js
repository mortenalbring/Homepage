var amenhokit = angular.module("amenhokit", []);

amenhokit.controller("HomeController", function ($http,$scope) {
    $scope.test = "moop";

    $scope.gameInfo = [];

    $http({
        method: 'GET',
        url: '/Projects/GetGameInfo'
    }).then(function (response) {

        var data = response.data;

        for (var i = 0; i < data.length; i++) {
            $scope.gameInfo.push(data[i]);

        }

        var xx = 42;
    })
});