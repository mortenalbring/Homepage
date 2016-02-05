var amenhokit = angular.module("amenhokit", ["ngFileUpload","ngRoute"]);
amenhokit.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/upload', {
            templateUrl: '/Projects/AmenhokitApp/upload.html',
            controller: 'UploadController'
        })
        .when('/file/:filename', {
            templateUrl: '/Projects/AmenhokitApp/home.html',
            controller: 'HomeController'
        }).otherwise({
            templateUrl: '/Projects/AmenhokitApp/display.html',
            controller: 'DisplayController'
        });
}]);
amenhokit.factory('FileUploadService', ["$rootScope", "$http", "$q", "Upload", FileUploadService]);
amenhokit.factory('AjaxService', ["$http", AjaxService]);
amenhokit.service('DataService', ["$q","AjaxService", DataService]);
amenhokit.controller("HomeController", HomeController);
amenhokit.controller("DisplayController", ["$routeParams","$scope","DataService", DisplayController]);

amenhokit.controller("UploadController",["FileUploadService","$scope", UploadController]);