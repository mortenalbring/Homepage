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
        .otherwise({
            templateUrl: '/Projects/AmenhokitApp/Templates/display.html',
            controller: 'DisplayController'
        });
}]);
amenhokit.factory('FileUploadService', ["$rootScope", "$http", "$q", "Upload", FileUploadService]);
amenhokit.factory('AjaxService', ["$http", AjaxService]);
amenhokit.service('DataService', ["$q", "AjaxService", DataService]);
amenhokit.controller("HomeController", HomeController);
amenhokit.controller("DisplayController", ["$routeParams", "$scope", "DataService", DisplayController]);

amenhokit.controller("UploadController", ["FileUploadService", "$scope", UploadController]);


amenhokit.filter('titlecase', function () {
    return function (s) {
        s = (s === undefined || s === null) ? '' : s;
        return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
            return ch.toUpperCase();
        });
    };
});