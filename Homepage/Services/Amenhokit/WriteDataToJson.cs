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


        public static void WriteTeamReportsByPlayerCount()
        {
            var allData = GetAllData();

            var playerCountSearches = new int[] {2,3,4,5,6,7};

            var output = new Dictionary<int,List<TeamReport>>();
            foreach (var s in playerCountSearches)
            {
                var result = GetTeamReport(allData,s, 50);
                output.Add(s,result);
            }

            WriteToFile(output,"teamreportByPlayerCount.txt");

        }


        private static List<TeamReport> GetTeamReport(List<PlayerSessionScore> allData, int playerCountSearch, int maxRecords)
        {            

            var groupedByGame = allData.GroupBy(e => e.Game);


            var teamReports = new List<TeamReport>();

            foreach (var game in groupedByGame)
            {
                var teamReport = new TeamReport();
                var playerCount = game.Count();

                if (playerCount != playerCountSearch)
                {
                    continue;
                }

                var teamScore = 0;

                foreach (var s in game)
                {
                    teamScore = teamScore + s.PlayerScore.Score;
                }

                var scorePerPlayer = (float)teamScore / playerCount;
                teamReport.Players = game.Select(e => e.Player).Distinct().OrderBy(e => e.ID).ToList();
                teamReport.BestGame = game.Key;
                teamReport.BestSession = game.Select(e => e.Session).FirstOrDefault();
                teamReport.BestTeamScore = teamScore;
                teamReport.PlayerCount = playerCount;
                teamReport.ScorePerPlayer = scorePerPlayer;

                teamReports.Add(teamReport);

            }

            var orderedReports = teamReports.OrderByDescending(e => e.BestTeamScore).Take(maxRecords).ToList();

            return orderedReports;            
        }


        public static void WriteTeamReports()
        {
            var allData = GetAllData();

            var groupedByGame = allData.GroupBy(e => e.Game);


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
                var playerReport = new PlayerReport { Player = player };

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
                    totalNineNineNines = totalNineNineNines + CountStringOccurrences(scoreString, "9/9/9/");


                    totalTurkeys = totalTurkeys + CountStringOccurrences(scoreString, "xxx");
                    totalSpares = totalSpares + score.PlayerScore.Scorestring.Count(e => e == '/');
                }

                var playerSessions = playerData.GroupBy(e => e.Session);
                var totalBest = 0;
                var sessions = 0;
                foreach (var psesh in playerSessions)
                {
                    sessions++;
                    var sessionScores = psesh.Select(e => e.PlayerScore.Score).ToList();
                    var ordered = sessionScores.OrderByDescending(e => e);
                    var bestScore = ordered.First();
                    totalBest = totalBest + bestScore;
                }

                float averageBest = (float) totalBest / sessions;

                float averageScore = (float)scoreSum / playerData.Count;

                playerReport.AverageScore = averageScore;
                playerReport.AverageBestScore = averageBest;
                playerReport.HighestScore = highestScore;

                playerReport.NumberOfSessions = sessions;
                playerReport.HighestSessionScore = highestScoreSession;
                playerReport.TotalNumberOfStrikes = totalStrikes;
                playerReport.TotalNumberOfSpares = totalSpares;
                playerReport.TotalNumberOfTurkeys = totalTurkeys;
                playerReport.TotalNumberOfGutterballs = totalGutters;
                playerReport.Total999s = totalNineNineNines;

                playerReport.StrikesPerGame = (float)playerReport.TotalNumberOfStrikes / playerReport.NumberOfGames;
                output.Add(playerReport);
            }

            WriteToFile(output, "playerReports.txt");
        }


        public static void WriteLineChartData()
        {
            var allData = GetAllData();

            var uniqueSessionDates = allData.Select(e => e.Session.Date).Distinct().OrderBy(e => e).ToList();

           

            var uniquePlayers = allData.Select(e => e.Player.Name).Distinct().OrderBy(e => e).ToList();

            var allowedPlayers = new List<string>();
            foreach (var p in uniquePlayers)
            {
                var scoreCount = allData.Count(e => e.Player.Name == p);
                if (scoreCount > 50)
                {
                    allowedPlayers.Add(p);
                }
            }

            var output = "Date";

            foreach (var p in allowedPlayers)
            {
                output = output + "\t" + p;
            }
            output = output + "\n";

            foreach (var session in uniqueSessionDates)
            {
                output = output + session.ToString("yyyy-MM-dd") + "\t";

                foreach (var p in allowedPlayers)
                {
                    var r = "";
                    var scores = allData.Where(e => e.Session.Date == session && e.Player.Name == p).ToList();
                    if (scores.Count > 0)
                    {
                        var hscore = 0;
                        foreach (var s in scores)
                        {
                            if (s.PlayerScore.Score > hscore)
                            {
                                hscore = s.PlayerScore.Score;
                            }                            
                        }
                        r = hscore.ToString();
                   }
                    output = output + r + "\t";
                }
                output = output + "\n";
            }

            var filepath = HttpContext.Current.Server.MapPath("~/Content/datafiles/linechartdata.txt");

            File.WriteAllText(filepath,output);

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



        private static void WriteToFile<T>(Dictionary<int,T> objects, string filename)
        {
            var filePath = HttpContext.Current.Server.MapPath("~/Content/datafiles/" + filename);
            RemoveFile(filePath);

            var json = JsonConvert.SerializeObject(objects.ToArray());

            System.IO.File.WriteAllText(filePath, json);
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
            WriteTeamReportsByPlayerCount();

            WriteAllScores();
            WriteTeamReports();
            WritePlayerReports();
            WriteUniquePlayers();
            WriteLineChartData();
        }


        public static void WriteUniquePlayers()
        {
            using (var db = new DataContext())
            {
                var players = db.Player.ToList();
                WriteToFile(players, "uniquePlayers.txt");
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
                    ScoreString = p.playerscore.Scorestring.ToLower().Replace(p.player.Name.ToLower(), "").Replace(" ", "").ToUpper(),
                    SessionDate = p.session.Date,
                    Score = p.playerscore.Score,
                    Name = p.player.Name,
                    DateString = p.session.Date.ToString("yyyy-MM-dd")
                }).OrderByDescending(e => e.SessionDate).ToList();

                WriteToFile(obj, "graphOutput.txt");


            }



        }
    }
}