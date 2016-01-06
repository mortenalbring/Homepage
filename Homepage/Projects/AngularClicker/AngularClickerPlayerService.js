var AngularClickerPlayerService = function () {
    this.Player = {
        Name: "Bob",
        Status: 0,
        XP: 0,
        Gold: 20,
        AttackDamage: 1,
        AutoAttackDamage: 0,
        AutoBury: false,
        SubtractCost: function (cost) {
            if (this.Gold >= cost) {
                this.Gold = this.Gold - cost;
                return true;
            }
            return false;
        },
        IncreaseAttack: function (val) {
            this.AttackDamage = this.AttackDamage + val;
        },
        IncreaseAutoAttack: function (val) {
            this.AutoAttackDamage = this.AutoAttackDamage + val;
        },
        IncreaseXP: function (val) {
            this.XP = this.XP + val;
        },
        IncreaseGold: function (val) {
            this.Gold = this.Gold + val;
        }

    }

}