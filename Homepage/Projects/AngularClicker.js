var angularClicker = angular.module("AngularClicker",[]);

angularClicker.controller("HomeController", function ($scope) {
    $scope.Player = {
        Name: "",
        XP: 0,
        Gold: 0
    }

    $scope.Enemies = [];

    $scope.generateEnemies = function() {
        var enemyID = $scope.Enemies.length + 1;
        
        var enemy = { ID: enemyID, Health: 10 }
        $scope.Enemies.push(enemy);

    }


    $scope.reduceEnemyHealth = function (ID) {
        var enemy = $scope.Enemies.filter(function(e) {
            return e.ID == ID;
        });
        if (enemy.length == 1) {
            enemy[0].Health = enemy[0].Health - 1;

            if (enemy[0].Health <= 0) {
                var indx = $scope.Enemies.indexOf(enemy[0]);
                $scope.Enemies.splice(indx, 1);
                $scope.Player.XP = $scope.Player.XP + 1;
                $scope.Player.Gold = $scope.Player.Gold + 10;
            }
        }        
    }

    $scope.generateEnemies();
    $scope.generateEnemies();
    $scope.generateEnemies();
    $scope.generateEnemies();
    $scope.generateEnemies();

});