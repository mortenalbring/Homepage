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

                output.AddRange(pscs.Select(psc => new PlayerSessionScore(psc.player, psc.playerscore, psc.session, psc.game)));
            }
            return output;
        }

        public static void WriteTeamReports()
        {
            
            var allData = GetAllData();

            var groupedByGame = allData.GroupBy(e => e.Game);

            float highestTeamScore = 0;
            
            var bestGame = new Game();

            var teamReports = new List<TeamReport>();
            
            foreach (var game in groupedByGame)
            {
                var teamReport = new TeamReport();



                var playerCount = game.Count();

                if (playerCount == 1)
                {
                    continue;
                }
                

                var teamScore = 0;

                foreach (var s in game)
                {
                    teamScore = teamScore + s.PlayerScore.Score;
                }

                var scorePerPlayer = (float)teamScore / playerCount;



                    teamReport.BestGame = game.Key;
                    teamReport.BestTeamScore = teamScore;
                    teamReport.PlayerCount = playerCount;
                    teamReport.ScorePerPlayer = scorePerPlayer;
                    
                teamReports.Add(teamReport);

            }

            var orderedReports = teamReports.OrderByDescending(e => e.ScorePerPlayer).Take(10).ToList();


          
            WriteToFile(orderedReports, "teamreport.txt");

        }

        public static void WritePlayerReports()
        {
            var allData = GetAllData();

            var players = allData.Select(e => e.Player).DistinctBy(e => e.ID).ToList();

            var output = new List<PlayerReport>();

            foreach (var player in players)
            {
                var playerReport = new PlayerReport {Player = player};
                
                
                

                var playerData = allData.Where(e => e.Player.ID == player.ID).ToList();
                playerReport.NumberOfGames = playerData.Count;

                var scoreSum = 0;
                var highestScore = 0;
                var totalStrikes = 0;
                var totalSpares = 0;
                var totalTurkeys = 0;
                var totalGutters = 0;
                var totalNineNineNines = 0;
                var highestScoreSession = new PlayerScore();
                foreach (var score in playerData)
                {
                    var scoreString = score.PlayerScore.Scorestring.Replace(" ", "").ToLower();
                    scoreString = scoreString.Replace(score.Player.Name.ToLower(), "");


                    scoreSum = scoreSum + score.PlayerScore.Score;
                    if (score.PlayerScore.Score > highestScore)
                    {
                        highestScore = score.PlayerScore.Score;
                        highestScoreSession = score.PlayerScore;
                    }
                    
                    totalStrikes = totalStrikes + scoreString.Count(e => e == 'x');
                    totalGutters = totalGutters + scoreString.Count(e => e == '-');
                  
                    totalNineNineNines = totalNineNineNines + CountStringOccurrences(scoreString, "9-9-9-");

                    if (totalNineNineNines > 0)
                    {
                        var xx = 42;
                    }

                    totalTurkeys = totalTurkeys + CountStringOccurrences(scoreString, "xxx");                    
                    totalSpares = totalSpares + score.PlayerScore.Scorestring.Count(e => e == '/');                                        
                }

                float averageScore = (float)scoreSum / playerData.Count;

                playerReport.AverageScore = averageScore;
                playerReport.HighestScore = highestScore;
                playerReport.HighestSessionScore = highestScoreSession;
                playerReport.TotalNumberOfStrikes = totalStrikes;
                playerReport.TotalNumberOfSpares = totalSpares;
                playerReport.TotalNumberOfTurkeys = totalTurkeys;
                playerReport.TotalNumberOfGutterballs = totalGutters;
                playerReport.Total999s = totalNineNineNines;

                playerReport.StrikesPerGame = (float)playerReport.TotalNumberOfStrikes / playerReport.NumberOfGames;
                output.Add(playerReport);
            }

            WriteToFile(output,"playerReports.txt");
        }


        private static int CountStringOccurrences(string text, string pattern)
        {
            // Loop through all instances of the string 'text'.
            int count = 0;
            int i = 0;
            while ((i = text.IndexOf(pattern, i)) != -1)
            {
                i += pattern.Length;
                count++;
            }
            return count;
        }

    

        private static void WriteToFile<T>(List<T> objects, string filename)
        {
            var filePath = HttpContext.Current.Server.MapPath("~/Content/datafiles/" + filename);
            RemoveFile(filePath);

            var json = JsonConvert.SerializeObject(objects.ToArray());

            System.IO.File.WriteAllText(filePath, json);

        }


        public static void WriteAll()
        {
            WriteAllScores();
            WriteTeamReports();
            WritePlayerReports();
            WriteUniquePlayers();
        }


        public static void WriteUniquePlayers()
        {
            using (var db = new DataContext())
            {
                var players = db.Player.ToList();                
                WriteToFile(players,"uniquePlayers.txt");
            }

        }

        private static void RemoveFile(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.SetAttributes(filePath, FileAttributes.Normal);
                System.IO.File.Delete(filePath);
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

             
                var obj = pscs.Select(p => new GraphDisplay
                {
                    SessionId = p.session.ID,
                    ScoreString = p.playerscore.Scorestring.ToLower().Replace(p.player.Name.ToLower(),"").Replace(" ","").ToUpper(),
                    SessionDate = p.session.Date,
                    Score = p.playerscore.Score,
                    Name = p.player.Name,
                    DateString = p.session.Date.ToString("yyyy-MM-dd")
                }).ToList();

                WriteToFile(obj,"graphOutput.txt");


            }



        }
    }
}