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
            .state("home.graph",
            {
                url: "graph",
                templateUrl: "/Projects/NewAmenhokitApp/Views/graph.html",
                controller: "GraphController",
                controllerAs: "gc"
            })
            .state("home.d3",
                {
                url: "d3",
            templateUrl: "/Projects/NewAmenhokitApp/Views/graphd3.html",
            controller: "GraphD3Controller",
            controllerAs: "gdt"
                }
        )

            .state("home.stats",
            {
                url: "stats",
                templateUrl: "/Projects/NewAmenhokitApp/Views/stats.html",
                controller: "StatsController",
                controllerAs: "ss"
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