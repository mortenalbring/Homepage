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
angularClicker.directive('playerFace', function () {
    return {
        scope: {
            pstatus: '='
        },
        template:
        '<pre ng-if= "pstatus == 0" >' + '\n' +
'  __)),' + '\n' +
' //_ _)' + '\n' +
' ( &quot;&bsol;&quot;' + '\n' +
 '  &bsol;_-/' + '\n' +
 '</pre>' + 
'<pre ng-if= "pstatus == 1" >' + '\n' +
'  __)),' + '\n' +
' //_ _)' + '\n' +
' ( &quot;&bsol;&quot;' + '\n' +
 '  &bsol;_O/' + '\n' +
 '</pre>' +
'<pre ng-if= "pstatus == 2" >' + '\n' +
'  __)),' + '\n' +
' //   )' + '\n' +
' ( -&bsol;-' + '\n' +
 '  &bsol;_-/' + '\n' +
 '</pre>' + "<br>" +


 '{{pstatus}}'
    }


})

angularClicker.controller("HomeController", function ($interval, $scope) {
    $scope.Player = {
        Name: "",
        Status: 0,
        XP: 0,
        Gold: 10,
        AttackDamage: 1,
        AutoAttackDamage: 0,
        AutoBury: false
    }

    $scope.EnemyTypes = [
        {
            Type: "Mouse",
            Image: ""
        }
    ]

    $scope.Enemies = [];
    $scope.Graveyard = [];

    $scope.MessageLog = [];


    $scope.Shop = [
    {
        Title: "Attack Boost",
        Cost: 5,
        RunFunction: function () {
            $scope.buyAttackBoost(this);
        }
    },
    {
        Title: "Buy Auto Turret",
        Cost: 10,
        RunFunction: function () {
            $scope.buyAutoTurret(this);
        }
    },
    {
        Title: "Bury dead",
        Cost: 1,
        RunFunction: function () {
            $scope.buryDeadEnemies(this.Cost);
        }
    },
    {
        Title: "Hire gravedigger",
        Cost: 20,
        RunFunction: function () {
            $scope.hireGravedigger(this);
        }
    },
    {
        Title: "Visit graveyard",
        Cost: 0,
        RunFunction: function () {
            $scope.visitGraveyard();
        }
    },

    ];

    $scope.hireGravedigger = function (element) {
        if (!$scope.subtractCost(element.Cost)) {
            return;
        }

        $scope.Player.AutoBury = true;
        var indx = $scope.Shop.indexOf(element);
        $scope.Shop.splice(indx, 1);

    }
    $scope.buyAttackBoost = function (element) {
        if (!$scope.subtractCost(element.Cost)) {
            return;
        }
        $scope.increaseAttack(1);

        element.Cost = element.Cost + 1;
    }

    $scope.upgradeAutoTurret = function (element) {
        if (!$scope.subtractCost(element.Cost)) {
            return;
        }
        $scope.increaseAutoAttack(1);
        element.Cost = element.Cost + 2;


    }
    $scope.buyAutoTurret = function (element) {
        if (!$scope.subtractCost(element.Cost)) {
            return;
        }

        $scope.Player.AutoAttackDamage = 2;

        var indx = $scope.Shop.indexOf(element);
        $scope.Shop.splice(indx, 1);
        var upgrade = {
            Title: "Upgrade Auto Turret",
            Cost: 10,
            RunFunction: function () {
                $scope.upgradeAutoTurret(this);
            }
        };
        $scope.Shop.push(upgrade);
    }


    $scope.visitGraveyard = function () {
        
        if ($scope.Graveyard.length == 0) {
            $scope.MessageLog.push("There is nothing here but an empty meadow");
        } else {
            $scope.Player.Status = 2;
            $scope.MessageLog.push("You solemnly mourn the " + $scope.Graveyard.length + " graves in the graveyard");
        }
    }

    $scope.subtractCost = function (cost) {
        if ($scope.Player.Gold >= cost) {
            $scope.Player.Gold = $scope.Player.Gold - cost;
            return true;
        }
        return false;


    }

    $scope.buryDeadEnemies = function (cost, autobury) {
        var deadEnemies = $scope.Enemies.filter(function (e) {
            return e.Alive != true;
        });
        if (deadEnemies.length == 0) {
            return;
        }

        if (!$scope.subtractCost(cost)) {
            return;
        }
        if (autobury) {
            $scope.MessageLog.push("The gravedigger buries " + deadEnemies.length + " dead enemies");
        } else {
            $scope.Player.Status = 2;
            $scope.MessageLog.push("You bury " + deadEnemies.length + " dead enemies");
        }


        for (var i = 0; i < deadEnemies.length; i++) {
            var indx = $scope.Enemies.indexOf(deadEnemies[i]);
            $scope.Enemies.splice(indx, 1);
            $scope.Graveyard.push(deadEnemies[i]);
        }

    }

    $scope.generateEnemies = function (number) {

        if (!number) { number = 1 };

        for (var i = 0; i < number; i++) {

            var enemyID = guid();

            var enemy = {
                ID: enemyID,
                Name: "Mouse",
                Alive: true,
                Health: 10
            }
            $scope.Enemies.push(enemy);
        }
    }

    $scope.increaseAttack = function (val) {
        $scope.Player.AttackDamage = $scope.Player.AttackDamage + val;
    }

    $scope.increaseAutoAttack = function (val) {
        $scope.Player.AutoAttackDamage = $scope.Player.AutoAttackDamage + val;
    }

    $scope.manualAttack = function (ID) {
        console.log(ID);
        $scope.Player.Status = 1;
        $scope.reduceEnemyHealth(ID, $scope.Player.AttackDamage);

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
        $scope.Player.Status = 0;

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

        if ($scope.Player.AutoBury) {
            $scope.buryDeadEnemies(0, true);
        }

        var rand = Math.random();

        var aliveEnemies = $scope.Enemies.filter(function (e) { return e.Alive == true; })

        if ((rand > 0.5) && (aliveEnemies.length < 5)) {
            var message = "A new enemy has appeared!";
            $scope.MessageLog.push(message);
            $scope.generateEnemies(1);
        }

    }, 1000);


    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }

});