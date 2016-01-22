var amenhokit = angular.module("amenhokit", []);

amenhokit.controller("HomeController", function ($http,$scope) {
    $scope.test = "moop";

    $scope.gameInfo = [];

    $scope.filelist = [];

    $http({
        method: 'GET',
        url: '/Projects/GetGameInfo'
    }).then(function(response) {

        var data = response.data;
        $scope.displayGameInfo(data);

    });
    

    $http({
        method: 'GET',
        url: '/Projects/ListFiles'
    }).then(function (response) {

        var data = response.data;

        for (var i = 0; i < data.length; i++) {
            var spl = data[i].split("\\");
            var filename = spl[spl.length - 1];

            $scope.filelist.push(filename);


        }


    });

    $scope.process = function(file) {
        $http({
            method: 'POST',
            url: '/Projects/ProcessFile',
            data: JSON.stringify({filename : file})
        }).then(function (response) {
            $scope.gameInfo = [];
            var data = response.data;
            $scope.displayGameInfo(data);



        });
    }

    $scope.displayGameInfo = function(data) {
        for (var i = 0; i < data.length; i++) {
            $scope.gameInfo.push(data[i]);

        }

    }
    
});