var AngularClickerEnemyService = function () {
    var self = this;

    this.Enemies = [];
    this.Graveyard = [];

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

}