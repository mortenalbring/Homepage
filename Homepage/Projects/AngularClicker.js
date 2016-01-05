var angularClicker = angular.module("AngularClicker", []);

angularClicker.controller("HomeController", function ($interval, $scope) {
    $scope.Player = {
        Name: "",
        XP: 0,
        Gold: 1,
        AttackDamage: 1,
        AutoAttackDamage: 0
    }

    $scope.Enemies = [];

    $scope.Shop = [
    {
        Title:"Attack Boost",
        Cost: 5,
        RunFunction: function() {
            $scope.increaseAttack(5,1);
        }
    },
    {        
        Title: "Auto Turret",
        Cost: 10,
        RunFunction: function() {
            $scope.increaseAutoAttack(10,1);
        }

    }];

    $scope.generateEnemies = function (number) {

        if (!number) { number = 1 };

        for (var i = 0; i < number; i++) {

            var enemyID = $scope.Enemies.length + 1;

            var enemy = { ID: enemyID, Alive:true, Health: 10 }
            $scope.Enemies.push(enemy);
        }
    }

    $scope.increaseAttack = function(cost,val) {
        if ($scope.Player.Gold >= cost) {
            $scope.Player.AttackDamage = $scope.Player.AttackDamage + val;
            $scope.Player.Gold = $scope.Player.Gold - cost;
        }
    }

    $scope.increaseAutoAttack = function (cost,val) {
        if ($scope.Player.Gold >= cost) {
            $scope.Player.AutoAttackDamage = $scope.Player.AutoAttackDamage + val;
            $scope.Player.Gold = $scope.Player.Gold - cost;
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
        if ($scope.Player.AutoAttackDamage > 0) {

            for (var i = 0; i < $scope.Enemies.length; i++) {
                if ($scope.Enemies[i].Alive) {
                    $scope.reduceEnemyHealth($scope.Enemies[i].ID, $scope.Player.AutoAttackDamage);
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