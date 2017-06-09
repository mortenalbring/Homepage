var HomeController = function () {
    HomeController.$inject = ["$rootScope", "$scope", "$state","DataService"];

    function HomeController($rootScope, $scope, $state, DataService) {
        google.charts.load('current', { 'packages': ['corechart'] });

      

        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.test = "moop";
        this.dataService = DataService;

        this.allScores = [];
        var self = this;

        DataService.getAllScores()
            .then(function (result) {
                var outputArray = [];
               
                for (var i = 0; i < result.data.length; i++) {

                    var player = result.data[i].Player;
                    var playerScore = result.data[i].PlayerScore;
                    var session = result.data[i].Session;

                    var playerName = player.Name;
                    var finalScore = playerScore.Score;
                    var sessionDate = session.Date;

                    var outobj = {};
                    outobj.Name = playerName;
                    outobj.Score = finalScore;
                    outobj.Date = sessionDate;

                    outputArray.push(outobj);                    
                }

                self.allScores = outputArray;

                google.charts.setOnLoadCallback(drawChart);

            });

     
        function drawChart() {            

            var data = google.visualization.arrayToDataTable([
                ['Age', 'Weight'],
                [8, 12],
                [4, 5.5],
                [11, 14],
                [4, 5],
                [3, 3.5],
                [6.5, 7]
            ]);

            var options = {
                title: 'Age vs. Weight comparison',
                hAxis: { title: 'Age', minValue: 0, maxValue: 15 },
                vAxis: { title: 'Weight', minValue: 0, maxValue: 15 },
                legend: 'none'
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

            chart.draw(data, options);

        }
    }


    return HomeController;

}();