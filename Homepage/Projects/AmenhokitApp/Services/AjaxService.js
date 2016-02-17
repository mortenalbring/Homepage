var AjaxService = function($http) {
    var axj = {};

    axj.UpdateDatabase = function() {
        return $http({
            method: 'GET',
            url: '/Amenhokit/UpdateDatabase'
        });
    }

    axj.ListSessions = function() {
        return $http({
            method: 'GET',
            url: '/Amenhokit/ListSessions'
        });
    }

    axj.GetGames = function(sessionId) {
        return $http({
            method: 'POST',
            url: '/Amenhokit/GetGames',
            data: { sessionId: sessionId }
        });
    }

    axj.GetScores = function(sessionId, gameId) {
        return $http({
            method: 'POST',
            url: '/Amenhokit/GetScores',
            data: { sessionId: sessionId, gameId: gameId }
        });
    }

    axj.GetPlayer = function(playerId) {
        return $http({
            method: 'POST',
            url: '/Amenhokit/GetPlayer',
            data: { playerId: playerId }
        });
    }

    return axj;
}