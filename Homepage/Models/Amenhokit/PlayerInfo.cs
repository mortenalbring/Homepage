using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homepage.Models.Amenhokit
{
    public class PlayerInfo
    {
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
            var rest = string.Join("", spl.Skip(1));
            rest = rest.Replace('-', '0');                                             

            var finalScore = FinalScore(rest, 0);
            this.Score = finalScore;
        }

        private static int FinalScore(string bowlingRecord, int ptr)
        {
            if (bowlingRecord.Length == ptr) return 0;

            char c = bowlingRecord[ptr];
            if (c == 'X')
            {
                return 10 +
                    NextTwoAfterStrike(bowlingRecord, ptr) +
                    FinalScore(bowlingRecord, ptr + 1); // recursion
            }
            else if (c == '/')
            {
                return 10 - int.Parse(bowlingRecord[ptr - 1].ToString()) +
                    NextOneAfterSpare(bowlingRecord, ptr) +
                    FinalScore(bowlingRecord, ptr + 1); // recursion
            }
            else
            {
                return int.Parse(c.ToString()) + FinalScore(bowlingRecord, ptr + 1);

            }

        }

        private static int NextOneAfterSpare(string bowlingRecord, int ptr)
        {
            if (bowlingRecord.Length == (ptr + 1)) return 0;
            char c = bowlingRecord[ptr + 1];
            if (c == 'X') return 10;
            return int.Parse(c.ToString());
        }

        private static int NextTwoAfterStrike(string bowlingRecord, int ptr)
        {
            if (bowlingRecord.Length == (ptr + 1)) return 0;
            char c = bowlingRecord[ptr + 1];
            var t = 0;

            if (c == 'X') t += 10;
            else if (c == '/') throw new Exception("spare found on first bowl !!");
            else t += int.Parse(c.ToString());

            if (bowlingRecord.Length == (ptr + 2)) return t;
            char c2 = bowlingRecord[ptr + 2];
            if (c2 == 'X') t += 10;
            else if (c2 == '/') t += (10 - t);
            else t += int.Parse(c2.ToString());
            return t;
        }
    }
}
