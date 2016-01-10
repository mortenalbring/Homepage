var AngularClickerPlayerService = function ($interval) {
    /// <summary>
    /// This service is responsible for storing 
    /// </summary>
    var self = this;
    this.PlayerStatuses = {
        Normal: 0,
        Angry: 1,
        Solemn: 2,
        Surprised: 3,
    }


    this.Player = {
        Name: "Bob",
        Status: self.PlayerStatuses.Normal,
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

    this.SetStatus = function(Status, Duration, ResetStatus) {
        if (!ResetStatus) {
            ResetStatus = self.PlayerStatuses.Normal;
        }
        if (!Duration) {
            Duration = 1000;
        }

        self.Player.Status = Status;
        $interval(function () {
            self.Player.Status = ResetStatus;
        }, Duration, 1);
    }

 
}