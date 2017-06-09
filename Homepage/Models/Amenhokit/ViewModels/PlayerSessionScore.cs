using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Homepage.Models.Amenhokit.Database;

namespace Homepage.Models.Amenhokit.ViewModels
{
    public class PlayerSessionScore
    {
        public Player Player { get; set; }
        public PlayerScore PlayerScore { get; set; }
        public Session Session { get; set; }

        public PlayerSessionScore(Player player, PlayerScore playerScore, Session session)
        {
            Player = player;
            PlayerScore = playerScore;
            Session = session;
        }
    }

    
}