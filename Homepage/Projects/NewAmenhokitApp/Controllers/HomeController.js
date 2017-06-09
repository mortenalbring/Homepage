var HomeController = function () {
    HomeController.$inject = ["$rootScope", "$scope", "$state"];

    function HomeController($rootScope, $scope, $state) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.test = "moop";


    }






    return HomeController;

}();