var amenhokit = angular.module("amenhokit", ["ngRoute"]);
amenhokit.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/file/:filename', {
            templateUrl: '/Projects/AmenhokitApp/home.html',
            controller: 'HomeController'
        }).otherwise({
            templateUrl: '/Projects/AmenhokitApp/home.html',
            controller: 'HomeController'
        });
}]);

amenhokit.controller("HomeController", HomeController);