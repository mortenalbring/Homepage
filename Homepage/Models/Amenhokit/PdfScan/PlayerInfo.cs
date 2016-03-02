using System;
using System.Linq;

namespace Homepage.Models.Amenhokit.PdfScan
{
    public class PlayerInfo
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int Score { get; set; }

        public string ScoreString { get; set; }

        public int NumberOfStrikes { get; set; }

        public void ParseScoreString()
        {
            var numberOfStrikes = this.ScoreString.Count(e => e == 'X');
            this.NumberOfStrikes = numberOfStrikes;
            var spl = this.ScoreString.Split(' ');
            var firstelem = spl.First();

            this.Name = firstelem.ToLower();

            var rest = string.Join("", spl.Skip(1));
            rest = rest.Replace('-', '0');

            var finalScore = CalculateScore(rest, 0);
            this.Score = finalScore;
        }



        private static int CalculateScore(string bowlingRecord, int ptr)
        {
            if (bowlingRecord.Length == ptr) return 0;

            var numBowls = bowlingRecord.Length;

            var threeFramesFromEnd = ptr >= (numBowls - 3);
            var twoFramesFromEnd = ptr >= (numBowls - 2);

            var c = bowlingRecord[ptr];
            switch (c)
            {
                case 'X':
                    if (threeFramesFromEnd)
                    {
                        return 10 + NextTwoAfterStrike(bowlingRecord, ptr); 
                    }
                    return 10 + NextTwoAfterStrike(bowlingRecord, ptr) + CalculateScore(bowlingRecord, ptr + 1);
                case '/':
                    if (twoFramesFromEnd)
                    {
                        return 10 - int.Parse(bowlingRecord[ptr - 1].ToString()) + NextOneAfterSpare(bowlingRecord, ptr);
                    }
                    return 10 - int.Parse(bowlingRecord[ptr - 1].ToString()) + NextOneAfterSpare(bowlingRecord, ptr) + CalculateScore(bowlingRecord, ptr + 1); // recursion
            }
            return int.Parse(c.ToString()) + CalculateScore(bowlingRecord, ptr + 1);
        }

        private static int NextOneAfterSpare(string bowlingRecord, int ptr)
        {
            if (bowlingRecord.Length == (ptr + 1)) return 0;
            var c = bowlingRecord[ptr + 1];
            return c == 'X' ? 10 : int.Parse(c.ToString());
        }

        private static int NextTwoAfterStrike(string bowlingRecord, int ptr)
        {
            if (bowlingRecord.Length == (ptr + 1)) return 0;
            var c = bowlingRecord[ptr + 1];
            var t = 0;

            switch (c)
            {
                case 'X':
                    t += 10;
                    break;
                case '/':
                    throw new Exception("spare found on first bowl?!");
                default:
                    t += int.Parse(c.ToString());
                    break;
            }

            if (bowlingRecord.Length == (ptr + 2)) return t;
            var c2 = bowlingRecord[ptr + 2];
            switch (c2)
            {
                case 'X':
                    t += 10;
                    break;
                case '/':
                    t += (10 - t);
                    break;
                default:
                    t += int.Parse(c2.ToString());
                    break;
            }
            return t;
        }
    }
}
