var angularClicker = angular.module("AngularClicker", []);

angularClicker.controller("HomeController", function ($interval, $scope) {
    $scope.Player = {
        Name: "",
        XP: 0,
        Gold: 100,
        AutoAttack: 0
    }

    $scope.Enemies = [];

    $scope.generateEnemies = function (number) {

        if (!number) { number = 1 };

        for (var i = 0; i < number; i++) {

            var enemyID = $scope.Enemies.length + 1;

            var enemy = { ID: enemyID, Alive:true, Health: 10 }
            $scope.Enemies.push(enemy);
        }


    }

    $scope.increaseAutoAttack = function () {
        if ($scope.Player.Gold >= 10) {
            $scope.Player.AutoAttack = $scope.Player.AutoAttack + 1;
            $scope.Player.Gold = $scope.Player.Gold - 10;
        }
    }
    $scope.reduceEnemyHealth = function (ID, damage) {
        var enemy = $scope.Enemies.filter(function (e) {
            return e.ID == ID;
        });
        if (enemy.length == 1) {
            enemy[0].Health = enemy[0].Health - damage;

            if (enemy[0].Health <= 0) {
                enemy[0].Alive = false;
                $scope.Player.XP = $scope.Player.XP + 1;
                $scope.Player.Gold = $scope.Player.Gold + 10;
            }
        }
    }

    $scope.initialise = function () {
        $scope.started = true;

        $scope.generateEnemies(5);



    }
    $interval(function () {
        if (!$scope.started) {
            return;
        }
        if ($scope.Player.AutoAttack > 0) {

            for (var i = 0; i < $scope.Enemies.length; i++) {
                if ($scope.Enemies[i].Alive) {
                    $scope.reduceEnemyHealth($scope.Enemies[i].ID, $scope.Player.AutoAttack);
                }
                
            }

        }
        var rand = Math.random();

        var aliveEnemies = $scope.Enemies.filter(function (e) { return e.Alive == true;})

        if ((rand > 0.5) && (aliveEnemies.length < 10)) {
            $scope.generateEnemies(1);
        }

    }, 1000);

});