//This app simulates Walter Penney's binary sequence game with two players. 
//The user plays one player, and the AI will play the second player.
var pennyGame = angular.module("PennyGame", []);

pennyGame.controller("HomeController", function ($interval, $timeout, $scope) {
    //Stores the game results
    $scope.results = [];

    //Stores the user input
    $scope.input = [];
    //Stores the AI input
    $scope.pennyInput = [];
    //The values for the different coins
    $scope.inputOne = null;
    $scope.inputTwo = null;
    $scope.inputThree = null;

    //Stores the history of all previous games played
    $scope.history = [];

    $scope.maxGames = 20;
    $scope.gameSpeed = 1000;


    $scope.reset = function () {
        //Resets the game state
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


    $scope.pennyResult = function () {
        //Calculates Penny's choice based on the user input
        $scope.pennyInput = [];
        if ((!$scope.inputOne) || (!$scope.inputTwo) || (!$scope.inputThree)) {
            return;
        }
        $scope.pennyThinking = true;
        $scope.reset();

        $interval(function () {
            //I added a timer here to simulate 'thinking', as it felt a little unnatural to have the choice come up immediately
            $scope.pennyThinking = false;

            if ($scope.inputTwo == 'H') {
                $scope.pennyInput.push('T');
            }
            if ($scope.inputTwo == 'T') {
                $scope.pennyInput.push('H');
            }
            $scope.pennyInput.push($scope.inputOne);
            $scope.pennyInput.push($scope.inputTwo);

            $scope.input.length = 0;
            $scope.input.push($scope.inputOne);
            $scope.input.push($scope.inputTwo);
            $scope.input.push($scope.inputThree);

        }, 1000, 1);
    }

    $scope.playGames = function (max, gamespeed) {
        //Triggers the autoplay
        $scope.autoplay = true;
        //Some error checking
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

                if ($scope.gameNumber == ($scope.maxGames)) {
                    shouldStop = true;
                    $scope.playing = false;
                    $scope.results.length = 0;
                    $scope.result = null;
                }
                $scope.flipCoin(1);

                $timeout(loop, $scope.gameSpeed);
            }
        }
        loop();
    }



    $scope.flipCoin = function (iterations) {
        //This flips the coin manually a specified number of times
        if ($scope.winner) {
            $scope.gameNumber++;
            $scope.results.length = 0;
        }
        for (var i = 0; i < iterations; i++) {

            //Simulates the random coin flip
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

            //We need to check if there's a winner
            checkForWinner();

            if ($scope.winner) {
                break;
            }
        }
    }



    function checkForWinner() {
        //This checks if the user sequence has appeared in the game yet
        var inputString = $scope.input.join();
        var pennyString = $scope.pennyInput.join();
        var resultsString = $scope.results.join();

        if (resultsString.indexOf(inputString) > -1) {
            $scope.winner = true;
            $scope.userWins++;
            $scope.history.push({
                result: resultsString,
                winner: "You",
                winnerInput: inputString,
                game: $scope.gameNumber
            });
            return;
        }
        if (resultsString.indexOf(pennyString) > -1) {
            $scope.winner = true;
            $scope.pennyWins++;
            $scope.history.push({
                result: resultsString,
                winner: "Penny",
                winnerInput: pennyString,
                game: $scope.gameNumber
            });
            return;
        }

        $scope.winner = false;
    }


});

pennyGame.filter('highlight', function ($sce) {
    //Handles the yellow highlighting in the sequence table
    return function (text, phrase) {
        if (phrase)
            text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
                '<span class="highlighted">$1</span>');

        return $sce.trustAsHtml(text);
    }
})