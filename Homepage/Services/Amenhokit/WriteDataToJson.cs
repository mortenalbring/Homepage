using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Homepage.Models;
using Homepage.Models.Amenhokit.Database;
using Homepage.Models.Amenhokit.JsonModels;
using Homepage.Models.Amenhokit.ViewModels;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;

namespace Homepage.Services.Amenhokit
{
    public class WriteDataToJson
    {

        private static List<PlayerSessionScore> GetAllData()
        {
            var output = new List<PlayerSessionScore>();

            using (var db = new DataContext())
            {
                var pscs = (from ps in db.PlayerScore
                            join p in db.Player on ps.Player equals p.ID
                            join g in db.Game on ps.Game equals g.ID
                            join s in db.Session on ps.Session equals s.ID
                            select new { player = p, playerscore = ps, session = s, game = g }
                ).ToList();

                foreach (var psc in pscs)
                {
                    output.Add(new PlayerSessionScore(psc.player, psc.playerscore, psc.session, psc.game));
                }
            }
            return output;
        }

        public static void WritePlayerReports()
        {
            var allData = GetAllData();

            var players = allData.Select(e => e.Player).DistinctBy(e => e.ID).ToList();

            var output = new List<PlayerReport>();

            foreach (var player in players)
            {
                var playerReport = new PlayerReport();
                playerReport.Player = player;
                var playerData = allData.Where(e => e.Player.ID == player.ID).ToList();

                var scoreSum = 0;
                var highestScore = 0;
                var highestScoreSession = new PlayerScore();
                foreach (var score in playerData)
                {
                    scoreSum = scoreSum + score.PlayerScore.Score;
                    if (score.PlayerScore.Score > highestScore)
                    {
                        highestScore = score.PlayerScore.Score;
                        highestScoreSession = score.PlayerScore;
                    }
                }

                float averageScore = (float)scoreSum / playerData.Count;

                playerReport.AverageScore = averageScore;
                playerReport.HighestScore = highestScore;
                playerReport.HighestSessionScore = highestScoreSession;

                output.Add(playerReport);
            }

            WriteToFile(output,"playerReports.json");
        }

        private static void WriteToFile2(string filename, List<PlayerReport> playerReports)
        {
            var filePath = HttpContext.Current.Server.MapPath("~/tempfiles/" + filename);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            var json = JsonConvert.SerializeObject(playerReports.ToArray());

            System.IO.File.WriteAllText(filePath, json);
        }

        private static void WriteToFile<T>(List<T> objects, string filename)
        {
            var filePath = HttpContext.Current.Server.MapPath("~/tempfiles/" + filename);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            var json = JsonConvert.SerializeObject(objects.ToArray());

            System.IO.File.WriteAllText(filePath, json);

        }

     



        public static void WriteUniquePlayers()
        {
            using (var db = new DataContext())
            {
                var players = db.Player.ToList();

                var filePath = HttpContext.Current.Server.MapPath("~/tempfiles/uniquePlayers.txt");

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                var json = JsonConvert.SerializeObject(players.ToArray());

                System.IO.File.WriteAllText(filePath, json);


            }

        }

        public static void WriteAllScores()
        {

            using (var db = new DataContext())
            {
                var pscs = (from ps in db.PlayerScore
                            join p in db.Player on ps.Player equals p.ID
                            join g in db.Game on ps.Game equals g.ID
                            join s in db.Session on ps.Session equals s.ID
                            select new { player = p, playerscore = ps, session = s, game = g }
                ).ToList();

                var graphFile = HttpContext.Current.Server.MapPath("~/tempfiles/graphOutput.txt");

                if (System.IO.File.Exists(graphFile))
                {
                    System.IO.File.Delete(graphFile);
                }
                System.IO.File.WriteAllText(graphFile, JsonConvert.SerializeObject(pscs.Select(p => new GraphDisplay
                {
                    SessionDate = p.session.Date,
                    Score = p.playerscore.Score,
                    Name = p.player.Name,
                    DateString = p.session.Date.ToString("yyyy-MM-dd")
                }).ToArray()));
            }



        }
    }
}