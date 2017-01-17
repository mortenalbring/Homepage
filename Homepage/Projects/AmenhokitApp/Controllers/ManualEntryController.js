var ManualEntryController = function ($routeParams, $scope, DataService,AjaxService, BowlingService) {

    $scope.players = [];
    $scope.errors = [];

    $scope.exampleString = "53X1122XX53223/21";

    $scope.gameNumbers = [1, 2, 3, 4, 5];

    $scope.activePlayer = null;
    $scope.activeGame = null;

    $scope.playerErrorMsg = "No active player set";
    $scope.setActiveGame = function(num) {
        $scope.activeGame = num;
    }
    $scope.setActivePlayer = function(player) {
        $scope.activePlayer = player;
        var indx = $scope.errors.indexOf($scope.playerErrorMsg);
        if (indx > -1) {
            $scope.errors.splice(indx, 1);
        }
    }

 
    AjaxService.GetPlayers()
        .then(function (r) {
            var response = r.data;
            
            for (var i = 0; i < response.players.length; i++) {
                $scope.players.push(response.players[i]);
            }

        });

    $scope.savedScores = [];

    $scope.saveScore = function() {
        var date = $scope.gameDate;
        var gameNumber = $scope.activeGame;
        var player = $scope.activePlayer;
        var scorestring = $scope.manualScoreString;
        var score = $scope.scoreStringCalculated;

        var zz = 42;


    }
    
    $scope.calculateScore = function (string) {
        

        var score = BowlingService.CalculateFrameScores(string);
        var errors = BowlingService.CheckForErrors(score);

        if (!$scope.activePlayer) {
            errors.push("No active player set");

        }


        $scope.errors = errors;
        $scope.scoreStringCalculated = score;

    }
}