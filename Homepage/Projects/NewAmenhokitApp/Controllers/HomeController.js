var HomeController = function () {
    HomeController.$inject = ["$rootScope", "$scope", "$state", "DataService"];

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
                    var sessionDate = result.data[i].DateTime;
                    var dateSplit = sessionDate.split('-');
                    var outobj = {};
                    outobj.Name = playerName;
                    outobj.Score = finalScore;                    

                    if (dateSplit.length >= 2) {
                        var year = dateSplit[0];
                        var month = dateSplit[1];
                        var day = dateSplit[2];
                        outobj.Date = new Date(year, month, day);
                    }
                 
                    if (playerName == "mort") {
                        outputArray.push(outobj);
                    }

                    
                }

                self.allScores = outputArray;

                google.charts.setOnLoadCallback(drawChart);

            });


        function drawChart() {

            var bowlingData = self.allScores;

            var testArr = [['A', 'B']];
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn('date', 'Date');
            dataTable.addColumn('number', 'Score');

            var testRows = [];
            for (var i = 0; i < bowlingData.length; i++) {
                var testKey = i;
                var dateKey = new Date(1900, 1, 1);

                var bowlingDate = bowlingData[i].Date;
     

                var testVal = bowlingData[i].Score;
                var testElem = [testKey, testVal];
                testArr.push(testElem);
                var testElem2 = [bowlingDate, testVal];
                testRows.push(testElem2);
            }
      
            dataTable.addRows(testRows);     

            var options = {
                title: 'All scores',
                hAxis: {
                    format: 'd/M/yy',
                    gridlines:{count:15}
                },
                vAxis: { title: 'Score', minValue: 0, maxValue: 250 },
                legend: 'none'
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

            chart.draw(dataTable, options);
        }

    }

    HomeController.prototype.drawChart = function () {

        var blarg = this;
        /*

        var testArr = [['A', 'B']];

        for (var i = 0; i < bowlingData.length; i++) {
            var testKey = i;
            var testVal = bowlingData[i].Score;
            var testElem = [testKey, testVal];
            testArr.push(testElem);
        }

      //  var data = google.visualization.arrayToDataTable(testArr);
        */

    //    google.charts.load('current', { 'packages': ['corechart'] });


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


    return HomeController;

}();