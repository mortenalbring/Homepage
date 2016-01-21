using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homepage.Models.Amenhokit
{
    public class GameInfo
    {
        public int Lane { get; set; }
        public int GameNumber { get; set; }
        public DateTime Date { get; set; }
        public List<PlayerInfo> PlayerScores = new List<PlayerInfo>();
    }
}
