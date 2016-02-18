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


amenhokit.directive('drGraph', function($window) {
    return {
        restrict: "EA",
        template: "<svg width='850' height='200'></svg>",
        link: function(scope, elem, attrs) {
            var salesDataToPlot = scope[attrs.chartData];
            var padding = 20;
            var pathClass = "path";
            var xScale, yScale, xAxisGen, yAxisGen, lineFun;

            var d3 = $window.d3;
            var rawSvg = elem.find("svg")[0];
            var svg = d3.select(rawSvg);

            function setChartParameters() {
                xScale = d3.scale.linear()
                           .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length - 1].hour])
                           .range([padding + 5, rawSvg.clientWidth - padding]);

                yScale = d3.scale.linear()
                  .domain([0, d3.max(salesDataToPlot, function (d) {
                      return d.sales;
                  })])
               .range([rawSvg.clientHeight - padding, 0]);

                xAxisGen = d3.svg.axis()
                             .scale(xScale)
                             .orient("bottom")
                             .ticks(salesDataToPlot.length - 1);

                yAxisGen = d3.svg.axis()
                             .scale(yScale)
                             .orient("left")
                             .ticks(5);

                lineFun = d3.svg.line()
                            .x(function (d) {
                                return xScale(d.hour);
                            })
                            .y(function (d) {
                                return yScale(d.sales);
                            })
                            .interpolate("basis");
            }

            function drawLineChart() {

                setChartParameters();

                svg.append("svg:g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0,180)")
                   .call(xAxisGen);

                svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(20,0)")
                   .call(yAxisGen);

                svg.append("svg:path")
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