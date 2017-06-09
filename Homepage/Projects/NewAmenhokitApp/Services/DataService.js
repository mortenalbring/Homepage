var DataService = function() {
    DataService.$inject = ["$http"];

    function DataService($http) {
        this.$http = $http;

    }

    DataService.prototype.getAllScores = function() {
        return this.$http.get('/Amenhokit/GetAllScores');
    }

    return DataService;
}();