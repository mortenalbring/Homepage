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
            templateUrl: '/Projects/AmenhokitApp/home.html',
            controller: 'HomeController'
        });
}]);
amenhokit.factory('FileUploadService', ["$rootScope", "$http", "$q", "Upload", FileUploadService]);
amenhokit.controller("HomeController",  HomeController);
amenhokit.controller("UploadController",["FileUploadService","$scope", UploadController]);