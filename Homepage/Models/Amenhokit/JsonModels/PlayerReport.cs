using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Homepage.Models.Amenhokit.Database;

namespace Homepage.Models.Amenhokit.JsonModels
{
    public class PlayerReport
    {
        public Player Player { get; set; }
        public float AverageScore { get; set; }
        public int HighestScore { get; set; }
        public PlayerScore HighestSessionScore { get; set; }
    }
}