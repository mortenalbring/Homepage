var angularClicker = angular.module("AngularClicker", []);

angularClicker.service('MessageService', AngularClickerMessageService);
angularClicker.service('EnemyService', AngularClickerEnemyService);
angularClicker.service('PlayerService', AngularClickerPlayerService);
angularClicker.service('ShopService', ['MessageService', 'PlayerService', 'EnemyService', AngularClickerShopService]);

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
angularClicker.directive('graveDigger', function () {
    return {
        template: '<pre>' +
'     _' + '\n' +
'   _/_&bsol;_' + '\n' +
'    &bsol;_/' + '\n' +
'   /&bsol;Y/&bsol;' + '\n' +
'  || : ||' + '\n' +
'  (|---|)' + '\n' +
'   | | |¦' + '\n' +
'   |_|_|¦' + '\n' +
'   (/ &bsol;)#' +
'</pre>'
    }
})
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

angularClicker.controller("HomeController", function (MessageService, PlayerService, EnemyService, ShopService, $interval, $scope) {
    $scope.Player = PlayerService.Player;

    $scope.subtractCost = function (cost) {
        if ($scope.Player.Gold >= cost) {
            $scope.Player.Gold = $scope.Player.Gold - cost;
            return true;
        }
        return false;


    }

    $scope.EnemyTypes = [
        {
            Type: "Mouse",
            Image: ""
        }
    ]

    $scope.Enemies = EnemyService.Enemies;
    $scope.Graveyard = [];

    $scope.MessageLog = MessageService.MessageLog;


    $scope.Shop = ShopService.Shop;


    $scope.generateEnemies = function (number) {

        if (!number) { number = 1 };

        for (var i = 0; i < number; i++) {

            var enemyID = guid();

            var enemy = {
                ID: enemyID,
                Name: "Mouse",
                Alive: true,
                Health: 10,
                MaxHealth: 10
            }
            EnemyService.Enemies.push(enemy);
        }
    }

   
    $scope.manualAttack = function (ID) {        
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


    $scope.getColour = function (enemy) {

        var frac = (enemy.Health / enemy.MaxHealth);

        var outcss = "rgba(" + parseInt(frac * 255) + ",0,0,1)";
        return outcss;
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
            var buried = EnemyService.BuryDead();
            if (buried > 0) {
                MessageService.MessageLog.push("The gravedigger buries " + buried + " dead enemies");
            }


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