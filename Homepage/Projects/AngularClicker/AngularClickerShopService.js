var AngularClickerShopService = function (PlayerService) {
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

    function buyAttackBoost(element) {
        if (!PlayerService.Player.SubtractCost(element.Cost)) {
            return;
        }
        PlayerService.Player.IncreaseAttack(1);

        element.Cost = element.Cost + 1;
    }

}