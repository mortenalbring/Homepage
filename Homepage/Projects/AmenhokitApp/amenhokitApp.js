var amenhokit = angular.module("amenhokit", ["angularMoment","ngFileUpload", "ngRoute"]);
amenhokit.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/upload', {
            templateUrl: '/Projects/AmenhokitApp/Templates/upload.html',
            controller: 'UploadController'
        })
        .when('/file/:filename', {
            templateUrl: '/Projects/AmenhokitApp/Templates/home.html',
            controller: 'HomeController'
        })
        .when('/player/:playerId', {
            templateUrl: '/Projects/AmenhokitApp/Templates/playerinfo.html',
            controller: 'DisplayController'
        })
         .when('/session/:sessionId', {
             templateUrl: '/Projects/AmenhokitApp/Templates/rtSessionInfo.html',
             controller: 'DisplayController'
         })
        .otherwise({
            templateUrl: '/Projects/AmenhokitApp/Templates/display.html',
            controller: 'DisplayController'
        });
}]);
amenhokit.factory('FileUploadService', ["$rootScope", "$http", "$q", "Upload", FileUploadService]);
amenhokit.factory('AjaxService', ["$http", AjaxService]);
amenhokit.service('DataService', ["$q", "AjaxService", DataService]);
amenhokit.service('GraphService', [GraphService]);
amenhokit.controller("HomeController", HomeController);
amenhokit.controller("DisplayController", ["$routeParams", "$scope", "DataService","GraphService", DisplayController]);

amenhokit.controller("UploadController", ["FileUploadService","AjaxService","$scope", UploadController]);


amenhokit.directive('drGraph', function($rootScope,$window) {
    return {
        restrict: "EA",
        template: "<svg id='graph-container'></svg>" +
            "<br>{{selectedScore}}",
        link: function (scope, elem, attrs) {

            scope.selectedScore = 0;

            var salesDataToPlot = scope[attrs.chartData];
            var padding = 20;
            var pathClass = "path";
            var xScale, yScale, xAxisGen, yAxisGen, lineFun;

            var d3 = $window.d3;
            var rawSvg = elem.find("svg")[0];
            var svg = d3.select(rawSvg);

            var margin = { top: 30, right: 20, bottom: 60, left: 50 },
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

            function setChartParameters(container) {
                

                
                xScale = d3.time.scale()
                           .domain([salesDataToPlot[0].Date, salesDataToPlot[salesDataToPlot.length - 1].Date])
                           .range([0, width]);

                
                yScale = d3.scale.linear()
                  .domain([0, d3.max(salesDataToPlot, function (d) {
                      return d.Score;
                  })])
               .range([height, 0]);

                xAxisGen = d3.svg.axis()
                             .scale(xScale)
                             .orient("bottom")
                             .ticks(5);

                yAxisGen = d3.svg.axis()
                             .scale(yScale)
                             .orient("left")
                             .ticks(5);

                lineFun = d3.svg.line()
                            .x(function (d) {
                                return xScale(d.Date);
                            })
                            .y(function (d) {
                                return yScale(d.Score);
                            })
                            .interpolate("cardinal");

                var points = container.selectAll(".point")
                    .data(salesDataToPlot)
                    .enter().append("svg:circle")
                    .attr("stroke", "black")
                    .attr("fill", function(d, i) { return "black" })
                    .attr("cx", function(d, i) { return xScale(d.Date) })
                    .attr("cy", function(d, i) { return yScale(d.Score) })
                    .attr("r", function(d, i) { return 3 })
                    .on("mouseover", function (d) {
                        $rootScope.$apply(function() {


                            scope.selectedScore = d.Score;
                        });
                    });

                ;
            }

            function drawLineChart() {

                
                svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);
                    
                var container = svg.append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
             
                setChartParameters(container);

                container.append("g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0," + (height) + ")")
                   .call(xAxisGen);

                container.append("g")
                   .attr("class", "y axis")
                    //.attr("transform", "translate(0," + -1 * margin.bottom  + ")")
                   .call(yAxisGen);

                container.append("path")
                   .attr({
                       d: lineFun(salesDataToPlot),
                       "stroke": "blue",
                       "stroke-width": 2,
                       "fill": "none",
                       "class": pathClass
                   });
            }

            drawLineChart();

        }
    }
})


amenhokit.directive('drPlayerList', function () {
    return {        
        scope: {
            players: '=players',
            selectedPlayer: '=selectedPlayer',
            activePlayers: '=activePlayers'
        },
        templateUrl: '/Projects/AmenhokitApp/Templates/drPlayerList.html'
    }
})

amenhokit.filter('titlecase', function () {
    return function (s) {
        s = (s === undefined || s === null) ? '' : s;
        return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
            return ch.toUpperCase();
        });
    };
});