var pennyGame = angular.module("PennyGame", []);

pennyGame.controller("HomeController", function ($interval, $timeout, $scope) {
    $scope.results = [];

    $scope.pennyInput = ["T", "H", "H"];


    $scope.inputOne = null;
    $scope.input = [$scope.inputOne, "H", "H"];
    $scope.inputTwo = null;
    $scope.inputThree = null;

    $scope.history = [];

    $scope.maxGames = 0;
    $scope.gameSpeed = 1000;

    $scope.reset = function () {
        $scope.winner = false;
        $scope.results.length = 0;
        $scope.userWins = 0;
        $scope.pennyWins = 0;
        $scope.totalHeads = 0;
        $scope.totalTails = 0;
        $scope.totalWins = 0;
        $scope.gameNumber = 0;
        $scope.history.length = 0;

    }
    $scope.reset();

    var gameLoop;

    $scope.stopLoop = function () {

        if (angular.isDefined(gameLoop)) {
            $interval.cancel(gameLoop);
        }
    }

    $scope.goFaster = function () {
        $scope.gameSpeed = $scope.gameSpeed / 2;

        if ($scope.gameSpeed <= 5) {
            $scope.gameSpeed = 5;
        }
    }
    $scope.goSlower = function () {
        $scope.gameSpeed = $scope.gameSpeed * 2;
        if ($scope.gameSpeed >= 1000) {
            $scope.gameSpeed = 1000;
        }

    }

    $scope.playGames = function (max, gamespeed) {
        if ((!$scope.inputOne) || (!$scope.inputTwo) || (!$scope.inputThree)) {
            return;
        }
        $scope.input = [$scope.inputOne, $scope.inputTwo, $scope.inputThree];
        $scope.playing = true;

        if (gamespeed) {
            $scope.gameSpeed = gamespeed;
        }
        $scope.maxGames = max;
        $scope.reset();

        var shouldStop = false;
        var loop = function () {
            if (!shouldStop) {

                if ($scope.gameNumber == $scope.maxGames) {
                    shouldStop = true;
                    $scope.playing = false;
                }
                $scope.flipCoin(1);
                if ($scope.winner) {
                    $scope.gameNumber++;
                    $scope.results.length = 0;
                }

                $timeout(loop, $scope.gameSpeed)

            }

        }
        loop();
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
            var h = {
                result: resultsString,
                winner: "User",
                winnerInput: inputString,
                game: $scope.gameNumber
            }
            $scope.history.push(h);
            return;
        }
        if (resultsString.indexOf(pennyString) > -1) {
            $scope.winner = true;
            $scope.pennyWins++;
            var h = {
                result: resultsString,
                winner: "Penny",
                winnerInput: pennyString,
                game: $scope.gameNumber
            }
            $scope.history.push(h);
            return;
        }

        $scope.winner = false;
    }


});

pennyGame.filter('highlight', function ($sce) {
    return function (text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
          '<span class="highlighted">$1</span>')

        return $sce.trustAsHtml(text)
    }
})