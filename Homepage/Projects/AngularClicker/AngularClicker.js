var angularClicker = angular.module("AngularClicker", []);

angularClicker.service('MessageService', AngularClickerMessageService);
angularClicker.service('EnemyService', ['MessageService', AngularClickerEnemyService]);
angularClicker.service('PlayerService', AngularClickerPlayerService);
angularClicker.service('ShopService', ['MessageService', 'PlayerService', 'EnemyService', AngularClickerShopService]);


angularClicker.directive('turret', function () {
    return {
        template: '<pre>' +
'&nbsp;&nbsp;&nbsp;_\n' +
'&nbsp;&nbsp;/&nbsp;&bsol;_\n' +
'&nbsp;&nbsp;&bsol;_/\n' +
'&nbsp;&nbsp;/|&bsol;\n' +
'</pre>'
    }
});

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
angularClicker.directive('graveDigger', function() {
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
});
angularClicker.directive('deadGraveDigger', function () {
    return {
        template: '<pre>' +
            '     _' + '\n' +
            '    / &bsol;' + '\n' +
            '    &bsol; /' + '\n' +
            '   /&bsol;Y/&bsol;' + '\n' +
            '  || : ||' + '\n' +
            '  (|---|)' + '\n' +
            '   | | |' + '\n' +
            '   |_|_|' + '\n' +
            '   (/ &bsol;)' +
            '</pre>'
    }
});



angularClicker.directive('playerFace', function() {
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
                '</pre>' + "<br>"                
    }
});

angularClicker.controller("HomeController", function (MessageService, PlayerService, EnemyService, ShopService, $interval, $scope) {
    $scope.Player = PlayerService.Player;    
    $scope.Enemies = EnemyService.Enemies;
    $scope.Graveyard = EnemyService.Graveyard;
    $scope.MessageLog = MessageService.MessageLog;
    $scope.Shop = ShopService.Shop; 
   
    $scope.manualAttack = function (ID) {        
        $scope.Player.Status = 1;
        $scope.attackEnemy(ID, $scope.Player.AttackDamage);
    }

    $scope.attackEnemy = function (ID, damage,autoAttack) {
        var killed = EnemyService.ReduceEnemyHealth(ID, damage,autoAttack);
        if (killed) {
            PlayerService.Player.IncreaseXP(10);
            PlayerService.Player.IncreaseGold(1);
        }
    }


    $scope.getColour = function (enemy) {
        var frac = (enemy.Health / enemy.MaxHealth);
        var outcss = "rgba(" + parseInt(frac * 255) + ",0,0,1)";
        return outcss;
    }

    $scope.initialise = function () {
        $scope.started = true;

        EnemyService.GenerateEnemies(5);
    }

    $interval(function () {
        $scope.Player.Status = 0;
        if (!$scope.started) {
            return;
        }
        if ($scope.Player.AutoAttackDamage > 0) {

            for (var i = 0; i < $scope.Enemies.length; i++) {
                if ($scope.Enemies[i].Alive) {
                    $scope.attackEnemy($scope.Enemies[i].ID, $scope.Player.AutoAttackDamage, true);
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
            MessageService.MessageLog.push(message);
            EnemyService.GenerateEnemies(1);
        }

    }, 1000);  
});