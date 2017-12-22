using Homepage.Models.Amenhokit.Database;

namespace Homepage.Models.Amenhokit.JsonModels
{
    public class PlayerReport
    {
        public Player Player { get; set; }
        public float AverageScore { get; set; }
        public int HighestScore { get; set; }
        public PlayerScore HighestSessionScore { get; set; }    
        public int TotalNumberOfStrikes { get; set; }
        public int NumberOfGames { get; set; }
        public float StrikesPerGame { get; set; }
        public int TotalNumberOfSpares { get; set; }
        public int TotalNumberOfTurkeys { get; set; }
        public int TotalNumberOfGutterballs { get; set; }
        public int Total999s { get; set; }
    }
}