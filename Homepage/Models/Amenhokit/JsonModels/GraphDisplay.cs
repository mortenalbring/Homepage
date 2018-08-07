using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Homepage.Models.Amenhokit.JsonModels
{
    public class GraphDisplay
    {
        public int SessionId { get; set; }
        public DateTime SessionDate { get; set; }
        public string DateString { get; set; }
        public string ScoreString { get; set; }
        public string Name { get; set; }
        public int Score { get; set; }
    }
    
}