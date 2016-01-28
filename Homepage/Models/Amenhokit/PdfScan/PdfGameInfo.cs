using System.Collections.Generic;

namespace Homepage.Models.Amenhokit.PdfScan
{
    public class PdfGameInfo
    {
        public int Lane { get; set; }
        public int GameNumber { get; set; }
        public string Date { get; set; }
        public List<PlayerInfo> PlayerScores = new List<PlayerInfo>();
    }
}
