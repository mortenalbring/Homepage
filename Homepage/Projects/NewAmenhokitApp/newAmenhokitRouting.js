var NewAmenhokitRouting = function () {
    NewAmenhokitRouting.$inject = ["$stateProvider", "$urlRouterProvider"];

    function NewAmenhokitRouting($stateProvider, $urlRouterProvider) {
        'ngInject';
        $urlRouterProvider.otherwise("/");

        $stateProvider.state("home",
        {
            url: "/",
            templateUrl: "/AngularApps/NewExport/Views/home.html",
            controller: "HomeController",
            controllerAs: "vm"
        });


    }

    return NewAmenhokitRouting;
}();