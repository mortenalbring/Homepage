var ManualEntryController = function ($routeParams, $scope, DataService,AjaxService, BowlingService) {

    $scope.players = [];
    $scope.errors = [];

    $scope.exampleString = "5 3 X 1 1 2 2 X X 5 3 2 2 3 / 2 1";

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