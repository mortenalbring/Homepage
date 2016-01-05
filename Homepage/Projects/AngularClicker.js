var angularClicker = angular.module("AngularClicker",[]);

angularClicker.controller("HomeController", function ($interval,$scope) {
    $scope.Player = {
        Name: "",
        XP: 0,
        Gold: 100,
        AutoAttack: 0
    }

    $scope.Enemies = [];

    $scope.generateEnemies = function() {
        var enemyID = $scope.Enemies.length + 1;
        
        var enemy = { ID: enemyID, Health: 10 }
        $scope.Enemies.push(enemy);

    }

    $scope.increaseAutoAttack = function() {
        if ($scope.Player.Gold >= 10) {
            $scope.Player.AutoAttack = $scope.Player.AutoAttack + 1;
            $scope.Player.Gold = $scope.Player.Gold - 10;
        }
    }
    $scope.reduceEnemyHealth = function (ID,damage) {
        var enemy = $scope.Enemies.filter(function(e) {
            return e.ID == ID;
        });
        if (enemy.length == 1) {
            enemy[0].Health = enemy[0].Health - damage;

            if (enemy[0].Health <= 0) {
                var indx = $scope.Enemies.indexOf(enemy[0]);
                $scope.Enemies.splice(indx, 1);
                $scope.Player.XP = $scope.Player.XP + 1;
                $scope.Player.Gold = $scope.Player.Gold + 10;
            }
        }        
    }
    $interval(function() {
        if ($scope.Player.AutoAttack > 0) {

            for (var i = 0; i < $scope.Enemies.length; i++) {
                $scope.reduceEnemyHealth($scope.Enemies[i].ID, $scope.Player.AutoAttack);
            }

        }

    }, 1000);

    $scope.generateEnemies();
    $scope.generateEnemies();
    $scope.generateEnemies();
    $scope.generateEnemies();
    $scope.generateEnemies();

});