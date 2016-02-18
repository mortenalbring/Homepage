var DisplayController = function ($routeParams, $scope, DataService, GraphService) { 
    $scope.sessions = DataService.sessions;
    $scope.games = DataService.games;
    $scope.playerscores = DataService.playerscores;
    $scope.players = DataService.players;
    $scope.loading = false;

    $scope.salesData =[
    {
        hour: 1, sales : 54
        },
        {hour: 2, sales: 66
    },
    {
        hour: 3, sales: 77
    },
        {hour : 4, sales: 70},
        {hour : 5, sales: 60
    },
        {hour : 6, sales : 63},
    {
        hour: 7, sales: 55},
        {hour : 8, sales: 47
        },
    {
            hour: 9, sales: 55
    },
        {hour : 10, sales: 30
        }
        ];

    function drawGraph() {

    var m =[10, 80, 25, 80] // margins: top, left, bottom, right
    var w = $(window).width() - m[1] -m[3] // width
    var h = 150 -m[0]-m[2] // height

        var x_data = [1, 2, 3, 4, 5, 5.5, 7, 8, 9, 12];
        var y_data =[1, 5, 4, 6, 4, 3, 5, 6, 7, 8];

    var x = d3.scale.linear().domain([0, d3.max(x_data)]).range([0, w])
    var y = d3.scale.linear().domain([0, d3.max(y_data)]).range([h, 0])

    var line = d3.svg.line()
        .x(function(d, i) {
            return x(d)
        })
        .y(function(d, i) {
            return y(y_data[i])
            })

    var test1 = angular.element('#graph-container');

    var test2 = $('#graph-container');

    var test3 = angular.element(document.getElementById('graph-container'));

        var test4 = angular.element.find('#graph-container');


        

        var xx = 42;

    var graph = d3.select("#graph-container").append("svg:svg")
        .attr("width", w +m[1]+m[3])
        .attr("height", h +m[0]+m[2])
        .append("svg:g")
        .attr("transform", "translate(" +m[3]+ "," +m[0]+ ")")

    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
    graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," +(h) + ")")
        .call(xAxis);

            // Add the y-axis
            var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
            graph.append("svg:g")
                .attr("class", "y axis")
        .attr("transform", "translate(-25,0)")
        .call(yAxisLeft);

    graph.append("svg:path").attr("d", line(x_data))
        .attr("stroke", "#ff0000")
    }


    var finalCallback = function () {
        $scope.loading = false;
    }

    function calculateStats() {
        var highestgame = {};
        highestgame.Score = 0;
        var scoresum = 0;

        var lanestotal = [];

        $.each($scope.selectedPlayerScores, function (i, o) {
            if (o.Score > highestgame.Score) {
                highestgame = o;
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

            drawGraph();

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