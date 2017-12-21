using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Homepage.Models.Amenhokit.Database;

namespace Homepage.Models.Amenhokit.JsonModels
{
    public class TeamReport
    {
        public Game BestGame { get; set; }
        public int BestTeamScore { get; set; }        
        public int PlayerCount { get; set; }
        public float ScorePerPlayer { get; set; }
    }
}