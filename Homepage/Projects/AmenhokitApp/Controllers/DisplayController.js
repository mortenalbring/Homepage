var DisplayController = function ($routeParams, $scope, DataService) {
    $scope.sessions = DataService.sessions;
    $scope.games = DataService.games;
    $scope.playerscores = DataService.playerscores;
    $scope.players = DataService.players;
    $scope.loading = false;
    $scope.chartData = [];


    var finalCallback = function () {
        $scope.loading = false;
    }

    function calculateFrameScores(scoreString) {
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
   

        function nextTwoAfterStrikeFromFrameArray(index, array) {
            if ((index + 1) === array.length) {
                return 0;
            }
            var total = 0;

            var nextFrame = array[index + 1];
            if (nextFrame.Result.length === 1) {
                total = total + 10;

                if ((index + 2) === array.length) {
                    return total;
                }
                var frameAfterNext = array[index + 2];
                if (frameAfterNext.Result.length === 1) {
                    total = total + 10;
                } else {
                    total = total + parseInt(frameAfterNext.Result[0]);
                }

            } else {

                var c1 = parseInt(nextFrame.Result[0]);
                total = c1;

                var c2 = nextFrame.Result[1];
                if (c2 === "/") {
                    total += (10 - total);
                } else {
                    total = total + parseInt(c2);
                }

            }           
            return total;
        }

      

        function nextOneAfterSpareFromFrameArray(index, array) {
            if ((index + 1) === array.length) {
                return 0;
            }
            var nextArray = array[index + 1];
            if (nextArray.Result.length == 1) {
                return 10;
            }
            var r1 = nextArray.Result[0];
            return parseInt(r1);

        }

      

        function returnScoreFromFrameArray(index, array) {
            var results = array[index].Result;

            //If there's only one result, that frame was a strike
            if (results.length === 1) {
                var nextTwo = nextTwoAfterStrikeFromFrameArray(index, array);
                return 10 + nextTwo;
            }
            var r1 = results[0];
            var r2 = results[1];
            if (r2 === "/") {
                var nextOne = nextOneAfterSpareFromFrameArray(index, array);
                return 10 + nextOne;
            }
            return parseInt(r2) + parseInt(r1);

        }

   
        function constructFrameArray(scoreArray) {
            var frameArray = [];
            var frameCount = 1;
            for (var i = 0; i < scoreArray.length; i++) {
                var frame = {};
                frame.Frame = frameCount;
                frame.Result = [];
                if (frameCount === 10) {
                    for (var j = i; j < scoreArray.length; j++) {
                        frame.Result.push(scoreArray[j]);
                    }
                    frameArray.push(frame);
                    break;
                }
                if (scoreArray[i] === "X") {
                    frame.Result.push("X");

                    frameArray.push(frame);
                    frameCount++;
                    continue;
                }
                frame.Result.push(scoreArray[i]);
                frame.Result.push(scoreArray[i + 1]);
                i++;
                frameArray.push(frame);
                frameCount++;


            }

            return frameArray;

        }

        function calculateFrameArray(scoreArray) {
          
            var fArray = constructFrameArray(scoreArray);
            for (var j = 0; j < fArray.length; j++) {                           
                var fscore = returnScoreFromFrameArray(j, fArray);
                fArray[j].Score = fscore;
            }

          

        }



        var spl = scoreString.split(" ");
        spl.shift();

        var testss = "X 7 / 7 2 9 / X X X 2 3 6 / 7 / 3";
        var testssarr = testss.split(" ");

        calculateFrameArray(testssarr);

        var onlyss = scoreString.replace(spl[0], "");

        var scoreArray = onlyss.split(" ");


        calculateFrameArray(spl);

        var xx = 42;



    }

    function calculateStats() {
        var highestgame = {};
        highestgame.Score = 0;
        var scoresum = 0;

        var lanestotal = [];
        $scope.turkeyGames = [];
        $scope.cloverGames = [];

        $.each($scope.selectedPlayerScores, function (i, o) {
            if (o.Score > highestgame.Score) {
                highestgame = o;
            }

            var turkeyMatches = (o.Scorestring.match(/X X X/g) || []).length;
            if (turkeyMatches > 0) {
                $scope.turkeyGames.push(o);
            }
            var cloverMatches = (o.Scorestring.match(/X X X X/g) || []).length;
            if (cloverMatches > 0) {
                $scope.cloverGames.push(o);
            }


            scoresum = scoresum + o.Score;
            var lane = o.Lane;

            var matching = lanestotal.filter(function (e) {
                return e.Lane == lane;
            });
            if (matching.length == 1) {
                matching[0].Count = matching[0].Count + 1;
                matching[0].ScoreSum = matching[0].ScoreSum + o.Score;
            } else {
                lanestotal.push({
                    Lane: lane,
                    Count: 1,
                    ScoreSum: o.Score
                });
            }
        });
        $scope.lanestotals = [];
        $.each(lanestotal, function (i, o) {
            o.Average = parseInt(o.ScoreSum / o.Count);
            $scope.lanestotals.push(o);
        });


        $scope.averageScore = parseInt(scoresum / $scope.selectedPlayerScores.length);

        $scope.highestgame = highestgame;
    }

    if ($routeParams.playerId) {
        finalCallback = function () {
            var selectedPlayer = $scope.players.filter(function (e) {
                return e.ID == $routeParams.playerId;
            });
            if ((selectedPlayer) && (selectedPlayer.length == 1)) {
                $scope.selectedPlayer = selectedPlayer[0];
            }


            $scope.selectedPlayerScores = $scope.playerscores.filter(function (e) {
                return e.Player == $routeParams.playerId;
            });


            calculateStats();

            $scope.chartData = [];

            for (var i = 0; i < $scope.selectedPlayerScores.length; i++) {

                $scope.chartData.push($scope.selectedPlayerScores[i]);
            }

            $scope.chartData.sort(function (a, b) {
                return new Date(a.Date) - new Date(b.Date);
            });

            $scope.loading = false;
        }
    }
    if ($routeParams.sessionId) {

        finalCallback = function () {

            var selectedSession = $scope.sessions.filter(function (e) {
                return e.ID == $routeParams.sessionId;
            });
            if (selectedSession && selectedSession.length === 1) {
                $scope.selectedSession = selectedSession[0];
                $scope.activePlayers = [];

                for (var i = 0; i < $scope.selectedSession.Games.length; i++) {
                    for (var j = 0; j < $scope.selectedSession.Games[i].Scores.length; j++) {

                        var playerId = $scope.selectedSession.Games[i].Scores[j].Player;

                        var ss = $scope.selectedSession.Games[i].Scores[j].Scorestring;
                        calculateFrameScores(ss);

                        var indx = $scope.activePlayers.indexOf(playerId);
                        if (indx === -1) {
                            $scope.activePlayers.push(playerId);
                        }
                    }
                }

            }

            $scope.loading = false;
        }
    }


    if ($scope.sessions.length === 0) {
        $scope.loading = true;
        DataService.GetAllData(finalCallback);
    } else {
        finalCallback();
    }



}