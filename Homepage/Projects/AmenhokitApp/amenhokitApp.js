var amenhokit = angular.module("amenhokit", ["ngRoute"]);
amenhokit.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/file/:filename', {
            templateUrl: '/Projects/AmenhokitApp/home.html',
            controller: 'HomeController'
        }).otherwise({
            templateUrl: '/Projects/AmenhokitApp/home.html',
            controller: 'HomeController'
        });
}]);

amenhokit.controller("HomeController", function ($routeParams,$http,$scope) {
    $scope.test = "moop";

    console.log("started");

    $scope.gameInfo = [];

    $scope.filelist = [];

    $scope.process = function (file) {
        $http({
            method: 'POST',
            url: '/Projects/ProcessFile',
            data: JSON.stringify({ filename: file })
        }).then(function (response) {
            $scope.gameInfo = [];
            var data = response.data;
            $scope.displayGameInfo(data);
        });
    }


    if ($routeParams.filename) {
        $scope.process($routeParams.filename);

    } else {
        $http({
            method: 'GET',
            url: '/Projects/GetGameInfo'
        }).then(function (response) {
            console.log(response);
            var data = response.data;

            $scope.displayGameInfo(data);

        }), function error(response) {
            console.log(response);
        };
    }

   
    

    $http({
        method: 'GET',
        url: '/Projects/ListFiles'
    }).then(function (response) {

        var data = response.data;

        for (var i = 0; i < data.length; i++) {

            console.log(data[i]);

            var spl = data[i].split("\\");
            var filename = spl[spl.length - 1];            

            $scope.filelist.push(filename);


        }


    });

   
    $scope.displayGameInfo = function (data) {

        if (data.success) {
            for (var i = 0; i < data.data.length; i++) {
                $scope.gameInfo.push(data.data[i]);

            }

        } else {
            console.log(data.message);
        }

      

    }
    
});