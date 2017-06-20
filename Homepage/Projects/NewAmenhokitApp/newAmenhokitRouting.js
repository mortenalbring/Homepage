﻿var NewAmenhokitRouting = function () {
    NewAmenhokitRouting.$inject = ["$stateProvider", "$urlRouterProvider"];

    function NewAmenhokitRouting($stateProvider, $urlRouterProvider) {
        'ngInject';
        $urlRouterProvider.otherwise("/");

        $stateProvider.state("home",
        {
            url: "/",
            templateUrl: "/Projects/NewAmenhokitApp/Views/home.html",
            controller: "HomeController",
            controllerAs: "vm"
        })
        .state("sessions",
        {
            url: "/sessions/:sessionId",
            templateUrl: "/Projects/NewAmenhokitApp/Views/sessions.html",
            controller: "SessionsController",
            controllerAs: "sc"
        })
        .state("player",
        {
            url: "/player/:playerId",
            templateUrl: "/Projects/NewAmenhokitApp/Views/player.html",
            controller: "PlayerController",
            controllerAs: "pc"
        })
        ;


    }

    return NewAmenhokitRouting;
}();