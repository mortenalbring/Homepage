var AngularClickerEnemyService = function (MessageService) {
    var self = this;

    this.Enemies = [];
    this.Graveyard = [];

    this.ReduceEnemyHealth = function(ID, damage) {
        var enemy = self.Enemies.filter(function (e) {
            return e.ID == ID;
        });

        if (enemy.length == 1) {
            if (enemy[0].Health <= 0) {
                MessageService.MessageLog.push(enemy[0].Name + " is already quite dead");
                return false;
            }
            enemy[0].Health = enemy[0].Health - damage;
            MessageService.MessageLog.push("You attack " + enemy[0].Name + " for " + damage + " pts of damage");

            if (enemy[0].Health <= 0) {
                enemy[0].Alive = false;
                MessageService.MessageLog.push(enemy[0].Name + " is dead");
                return true;
            }
        }
        return false;
    }

    this.BuryDead = function() {
        var deadEnemies = self.Enemies.filter(function (e) {
            return e.Alive != true;
        });

        for (var i = 0; i < deadEnemies.length; i++) {
            var indx = self.Enemies.indexOf(deadEnemies[i]);
            self.Enemies.splice(indx, 1);
            self.Graveyard.push(deadEnemies[i]);
        }

        return deadEnemies.length;
    }

    this.GenerateEnemies = function(number) {
        if (!number) { number = 1 };

        for (var i = 0; i < number; i++) {

            var enemyID = guid();

            var enemy = {
                ID: enemyID,
                Name: "Mouse",
                Type: "Mouse",
                Alive: true,
                Health: 10,
                MaxHealth: 10
            }
            self.Enemies.push(enemy);
        }
    }

    this.AddNewEnemy = function(enemy) {
        
        if (!enemy.ID) {
            enemy.ID = guid();
        }
        self.Enemies.push(enemy);
    }


    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }


}