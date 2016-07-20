var pennyGame = angular.module("PennyGame", []);

pennyGame.controller("HomeController", function ($interval, $scope) {
    $scope.results = [];

    $scope.pennyInput = ["T", "T", "H"];

    $scope.input = ["H", "H", "T"];

    
    
    $scope.reset = function () {
        $scope.winner = false;
        $scope.results.length = 0;
        $scope.userWins = 0;
        $scope.pennyWins = 0;
        $scope.totalHeads = 0;
        $scope.totalTails = 0;
        $scope.totalWins = 0;
        $scope.gameNumber = 0;
    }
    $scope.reset();

    var gameLoop;

    $scope.stopLoop = function () {

        if (angular.isDefined(gameLoop)) {
            $interval.cancel(gameLoop);
        }
    }

    $scope.playGames = function (max) {
        $scope.reset();

        gameLoop = $interval(function () {           
            $scope.flipCoin(1);

            if ($scope.winner) {

                if ($scope.gameNumber == (max-1)) {
                    $scope.stopLoop();
                }

                $scope.gameNumber++;
                $scope.results.length = 0;
            }
        }, 10)
    }

    $scope.flipCoin = function (iterations) {
        for (var i = 0; i < iterations; i++) {

            var x = (Math.floor(Math.random() * 2) == 0);
            
            if (x) {
                $scope.result = "H";
                $scope.totalHeads++;
            }
            else {
                $scope.result = "T";
                $scope.totalTails++;
            }
            $scope.results.push($scope.result);

            checkForWinner();

            if ($scope.winner) {
                break;
            }
        }

    }

    function checkForWinner() {
        var inputString = $scope.input.join();
        var pennyString = $scope.pennyInput.join();
        var resultsString = $scope.results.join();

        if (resultsString.indexOf(inputString) > -1) {
            $scope.winner = true;
            $scope.userWins++;
            return;
        }
        if (resultsString.indexOf(pennyString) > -1) {
            $scope.winner = true;
            $scope.pennyWins++;
            return;
        }

        $scope.winner = false;
    }


})