﻿var AjaxService = function($http) {
    var axj = {};    

    axj.UpdateScore = function (id,newScore) {
        return $http({
            method: 'POST',
            url: '/Amenhokit/UpdateScore',
            data: {
                id: id,
                newScore: newScore
            }
        });
    }

    axj.WipeTables = function () {
        return $http({
            method: 'GET',
            url: '/Amenhokit/WipeTables'
        });
    }

    axj.UpdatePlayerAliases = function () {
        return $http({
            method: 'GET',
            url: '/Amenhokit/UpdatePlayerScoresFromAliases'
        });
    }


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
    axj.GetPlayers = function () {
        return $http({
            method: 'POST',
            url: '/Amenhokit/GetPlayers'
        });
    }
    axj.GetSessionByDate = function (gameDate) {
        return $http({
            method: 'POST',
            url: '/Amenhokit/FindSessionByDate',
            data: { gameDate: gameDate }
        });
    }
    return axj;
}