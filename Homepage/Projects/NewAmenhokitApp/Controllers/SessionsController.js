var SessionsController = function() {
    SessionsController.$inject = ["$rootScope", "$scope","$state", "$stateParams", "DataService"];

    function SessionsController($rootScope, $scope, $state, $stateParams, DataService) {

        var sessionId = parseInt($stateParams.sessionId);

        this.dataService = DataService;

        this.dataService.getScoresBySession(sessionId).then(function(result) {
            var yy = 42;

        });

        var xx = 42;
    }

    return SessionsController;
}();