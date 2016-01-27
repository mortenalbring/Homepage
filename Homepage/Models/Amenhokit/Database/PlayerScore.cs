using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homepage.Models.Amenhokit.Database
{
    public class PlayerScore
    {
        public int ID { get; set; }
        public int Session { get; set; }
        public int Game { get; set; }
        public int Score { get; set; }
        public string Scorestring { get; set; }
    }
}
