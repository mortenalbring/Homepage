var amenhokit = angular.module("amenhokit", ["angularMoment", "ngFileUpload", "ngAnimate", "ngRoute"]);
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
            controller: 'PlayerDisplayController'
        })
         .when('/session/:sessionId', {
             templateUrl: '/Projects/AmenhokitApp/Templates/vwSessionInfo.html',
             controller: 'SessionDisplayController'
         })
               .when('/manualentry', {
                   templateUrl: '/Projects/AmenhokitApp/Templates/vwManualEntry.html',
                   controller: 'ManualEntryController'
               })
        .when('/tests', {
            templateUrl: '/Projects/AmenhokitApp/Templates/vwTests.html',
            controller: 'TestController'
        })
        .otherwise({
            templateUrl: '/Projects/AmenhokitApp/Templates/display.html',
            controller: 'DisplayController'
        });
}]);
amenhokit.factory('FileUploadService', ["$rootScope", "$http", "$q", "Upload", FileUploadService]);
amenhokit.factory('AjaxService', ["$http", AjaxService]);
amenhokit.factory('BowlingService', [BowlingService]);
amenhokit.service('DataService', ["$q", "AjaxService", DataService]);
amenhokit.controller("HomeController", HomeController);
amenhokit.controller("DisplayController", ["$routeParams", "$scope", "DataService", "BowlingService", DisplayController]);
amenhokit.controller("ManualEntryController", ["$routeParams", "$scope", "$http", "DataService","AjaxService", "BowlingService", ManualEntryController]);
amenhokit.controller("SessionDisplayController", ["$routeParams", "$scope", "DataService", "BowlingService", SessionDisplayController]);
amenhokit.controller("PlayerDisplayController", ["$routeParams", "$scope", "DataService", "BowlingService", PlayerDisplayController]);

amenhokit.controller("TestController", ["$scope","DataService","BowlingService", TestController]);

amenhokit.controller("UploadController", ["FileUploadService", "AjaxService", "$scope", UploadController]);


amenhokit.directive('drGraph', drGraph);
amenhokit.directive('drFramescoregraph', drFrameScoreGraph);
amenhokit.directive('drMultiplayergraph', drMultiplayerGraph);
amenhokit.directive('drLanebarchart', drLaneBarChart);
amenhokit.directive('drGamenumberbarchart', drGameNumberBarChart);


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