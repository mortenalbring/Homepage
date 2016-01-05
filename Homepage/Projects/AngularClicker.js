var angularClicker = angular.module("AngularClicker", []);

angularClicker.directive('enemyMouse', function () {
    return {
        template: '<pre>' +
            '   )' + '\n' +
            '   (' + '\n' +
            ' ()-()' + '\n' +
            '_(o o)_  ' + '\n' +
            ' /&bsol;o/&bsol; ' + '\n' +
        '    </pre>'
    }
});
angularClicker.directive('deadMouse', function () {
    return {
        template: '<pre>' +
            '   )' + '\n' +
            '   (' + '\n' +
            ' ()-()' + '\n' +
            '_(x x)_  ' + '\n' +
            ' /&bsol;o/&bsol; ' + '\n' +
        '    </pre>'
    }
});

angularClicker.controller("HomeController", function ($interval, $scope) {
    $scope.Player = {
        Name: "",
        XP: 0,
        Gold: 1,
        AttackDamage: 1,
        AutoAttackDamage: 0
    }

    $scope.EnemyTypes = [
        {
            Type: "Mouse",
            Image: ""
        }
    ]

    $scope.Enemies = [];

    $scope.MessageLog = [];


    $scope.Shop = [
    {
        Title: "Attack Boost",
        Cost: 5,
        RunFunction: function () {
            $scope.increaseAttack(5, 1);
        }
    },
    {
        Title: "Auto Turret",
        Cost: 10,
        RunFunction: function () {
            $scope.increaseAutoAttack(10, 1);
        }

    }];

    $scope.generateEnemies = function (number) {

        if (!number) { number = 1 };

        for (var i = 0; i < number; i++) {

            var enemyID = $scope.Enemies.length + 1;

            var enemy = {
                ID: enemyID,
                Name: "Mouse",
                Alive: true,
                Health: 10
            }
            $scope.Enemies.push(enemy);
        }
    }

    $scope.increaseAttack = function (cost, val) {
        if ($scope.Player.Gold >= cost) {
            $scope.Player.AttackDamage = $scope.Player.AttackDamage + val;
            $scope.Player.Gold = $scope.Player.Gold - cost;
        }
    }

    $scope.increaseAutoAttack = function (cost, val) {
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
            if (enemy[0].Health <= 0) {
                $scope.MessageLog.push(enemy[0].Name + " is already quite dead");
                return;
            }
            enemy[0].Health = enemy[0].Health - damage;
            $scope.MessageLog.push("You attack " + enemy[0].Name + " for " + damage + " pts of damage");

            if (enemy[0].Health <= 0) {
                enemy[0].Alive = false;
                $scope.MessageLog.push(enemy[0].Name + " is dead");
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

        var aliveEnemies = $scope.Enemies.filter(function (e) { return e.Alive == true; })

        if ((rand > 0.1) && (aliveEnemies.length < 20)) {
            var message = "A new enemy has appeared!";
            $scope.MessageLog.push(message);
            $scope.generateEnemies(1);
        }

    }, 1000);

});