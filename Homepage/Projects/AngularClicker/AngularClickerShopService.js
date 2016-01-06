var AngularClickerShopService = function (MessageService, PlayerService, EnemyService) {
    var self = this;

    this.Shop = [
    {
        Title: "Attack Boost",
        Cost: 5,
        RunFunction: function () {
            buyAttackBoost(this);
        }
    },
    {
        Title: "Buy Auto Turret",
        Cost: 10,
        RunFunction: function () {
            buyAutoTurret(this);
        }
    },
    {
        Title: "Bury dead",
        Cost: 1,
        RunFunction: function () {
            buryDeadEnemies(this);
        }
    },
    {
        Title: "Hire gravedigger",
        Cost: 20,
        RunFunction: function () {
            hireGraveDigger(this);
        }
    },
    {
        Title: "Visit graveyard",
        Cost: 0,
        RunFunction: function () {
            visitGraveyard();
        }
    },

    ];

    function visitGraveyard() {
        if (EnemyService.Graveyard.length == 0) {
            MessageService.MessageLog.push("There is nothing here but an empty meadow");
        } else {
            PlayerService.Player.Status = 2;
            MessageService.MessageLog.push("You solemnly mourn the " + EnemyService.Graveyard.length + " graves in the graveyard");
        }
    }
    
    function buryDeadEnemies(element) {
        var deadEnemies = EnemyService.Enemies.filter(function (e) {
            return e.Alive != true;
        });
        if (deadEnemies.length == 0) {
            return;
        }

        if (!PlayerService.Player.SubtractCost(element.Cost)) {
            return;
        }

        PlayerService.Player.Status = 2;

        var buried = EnemyService.BuryDead();

        MessageService.MessageLog.push("You bury " + buried + " dead enemies");
        
        
        
    }

    function hireGraveDigger(element) {
        if (!PlayerService.Player.SubtractCost(element.Cost)) {
            return;
        }

        MessageService.MessageLog.push("You hire a kindly old gravedigger to clear out corpses for you");
        PlayerService.Player.AutoBury = true;
        var indx = self.Shop.indexOf(element);
        self.Shop.splice(indx, 1);
    }

    function buyAttackBoost(element) {
        if (!PlayerService.Player.SubtractCost(element.Cost)) {
            return;
        }
        PlayerService.Player.IncreaseAttack(1);

        element.Cost = element.Cost + 1;
    }

    function buyAutoTurret(element) {
        if (!PlayerService.Player.SubtractCost(element.Cost)) {
            return;
        }
        PlayerService.Player.IncreaseAutoAttack(1);
        
        var indx = self.Shop.indexOf(element);
        self.Shop.splice(indx, 1);
        var upgrade = {
            Title: "Upgrade Auto Turret",
            Cost: 10,
            RunFunction: function () {
                upgradeAutoTurret(this);
            }
        };
        self.Shop.push(upgrade);
    }

    function upgradeAutoTurret(element) {
        if (!PlayerService.Player.SubtractCost(element.Cost)) {
            return;
        }
        PlayerService.Player.IncreaseAutoAttack(2);
        element.Cost = element.Cost + 2;

    }


}