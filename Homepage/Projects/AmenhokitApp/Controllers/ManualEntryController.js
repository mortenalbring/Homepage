var ManualEntryController = function ($routeParams, $scope, $http, DataService,AjaxService, BowlingService) {

    $scope.players = [];
    $scope.errors = [];

    $scope.exampleString = "53X1122XX53223/21";

    $scope.gameNumbers = [1, 2, 3, 4, 5];

    $scope.activePlayer = null;
    $scope.activeGame = null;

    $scope.playerErrorMsg = "No active player set";
    $scope.activeGameErrorMsg = "No active game set";
    $scope.setActiveGame = function(num) {
        $scope.activeGame = num;
    }
 

    $scope.$watch('activePlayer',
        function (player) {
            if (player == null) {
                return;
            }
            var indx = $scope.errors.indexOf($scope.playerErrorMsg);
            if (indx > -1) {
                $scope.errors.splice(indx, 1);
            }
        });
    $scope.$watch('activeGame',
    function (player) {
        if (player == null) {
            return;
        }
        var indx = $scope.errors.indexOf($scope.activeGameErrorMsg);
        if (indx > -1) {
            $scope.errors.splice(indx, 1);
        }
    });

 
    AjaxService.GetPlayers()
        .then(function (r) {
            var response = r.data;
            
            for (var i = 0; i < response.players.length; i++) {
                $scope.players.push(response.players[i]);
            }

        });

    $scope.savedScores = [];

    $scope.saveScore = function() {
        var gameDate = $scope.gameDate;
        var gameNumber = $scope.activeGame;
        var player = $scope.activePlayer;
        var scorestring = $scope.manualScoreString;
        var score = $scope.scoreStringCalculated;
        var finalFrame = score[score.length - 1];
        var finalScore = finalFrame.Cumulative;

        var zz = 42;

        $http.post("/Amenhokit/AddNewScore",
        {
            playerId: player.ID,
            gameDate: gameDate,
            gameNumber: gameNumber,
            lane: 0,
            scoreString: scorestring,
            finalScore: finalScore
        });


    }
    
    $scope.calculateScore = function (string) {
        

        var score = BowlingService.CalculateFrameScores(string);
        var errors = BowlingService.CheckForErrors(score);

        if (!$scope.activePlayer) {
            errors.push($scope.playerErrorMsg);
        }
        if (!$scope.activeGame) {
            errors.push($scope.activeGameErrorMsg);
        }


        $scope.errors = errors;
        $scope.scoreStringCalculated = score;

    }
}