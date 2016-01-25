var HomeController = function($routeParams, $http, $scope) {

    $scope.test = "moop";

    $scope.selectedFile = null;

    $scope.gameInfo = [];

    $scope.filelist = [];

    $scope.testscorestring = "1 2 X 1 / 1 4 3 / 1 2 X 3 X 2 3 2";

    $scope.calculateScore = function() {
        $http({
            method: 'POST',
            url: '/Projects/CalculateScore',
            data: JSON.stringify({ scorestring: $scope.testscorestring })
        }).then(function(response) {
            if (response.data.success) {
                var xx = 42;
                $scope.testscorestringscore = response.data.data;
            } else {
                $scope.testscorestringscore = response.data.message;
            }
        });
    }
    $scope.calculateScore();

    $scope.process = function(file) {
        $http({
            method: 'POST',
            url: '/Projects/ProcessFile',
            data: JSON.stringify({ filename: file })
        }).then(function(response) {
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
        }).then(function(response) {
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
    }).then(function(response) {

        var data = response.data;

        for (var i = 0; i < data.length; i++) {

            console.log(data[i]);

            var spl = data[i].split("\\");
            var filename = spl[spl.length - 1];

            $scope.filelist.push(filename);


        }


    });


    $scope.displayGameInfo = function(data) {

        if (data.success) {
            for (var i = 0; i < data.data.length; i++) {
                $scope.gameInfo.push(data.data[i]);

            }

        } else {
            console.log(data.message);
        }


    }
};