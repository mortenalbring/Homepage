using Homepage.Models.Amenhokit;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using Homepage.Models;
using Homepage.Models.Amenhokit.Database;
using Homepage.Models.Amenhokit.PdfScan;

namespace Homepage.Repository
{
    public class AmenhokitRepository
    {
        public void ConstructDatabaseObjects(List<GameInfo> gameInfos, string PdfDocumentPath)
        {
            var i = 0;
            foreach (var gameInfo in gameInfos)
            {
                Debug.WriteLine(i + "/" + gameInfos.Count);
                i++;
                var session = SaveOrReturnSession(gameInfo, PdfDocumentPath);
                var game = SaveOrReturnGame(gameInfo, session);

                foreach (var playerInfo in gameInfo.PlayerScores)
                {
                    var player = SaveOrReturnPlayer(playerInfo);
                    var pscore = SavePlayerScore(playerInfo, game, session, player);
                }


            }

        }

        public void WipeTables()
        {
            using (var db = new DataContext())
            {
                db.Database.ExecuteSqlCommand("TRUNCATE TABLE [Games]");
                db.Database.ExecuteSqlCommand("TRUNCATE TABLE [Players]");
                db.Database.ExecuteSqlCommand("TRUNCATE TABLE [PlayerScores]");
                db.Database.ExecuteSqlCommand("TRUNCATE TABLE [Sessions]");
            }
        }

        private PlayerScore SavePlayerScore(PlayerInfo playerInfo, Game game, Session session, Player player)
        {
            using (var db = new DataContext())
            {
                var matching =
                    db.PlayerScore.FirstOrDefault(
                        e => e.Game == game.ID && e.Session == session.ID && e.Player == player.ID && e.Scorestring == playerInfo.ScoreString);

                if (matching == null)
                {
                    var playerScore = new PlayerScore();
                    playerScore.Game = game.ID;
                    playerScore.Session = session.ID;
                    playerScore.Player = player.ID;
                    playerScore.Score = playerInfo.Score;
                    playerScore.Scorestring = playerInfo.ScoreString;

                    db.PlayerScore.Add(playerScore);
                    db.SaveChanges();
                    matching = playerScore;
                }

                return matching;

            }

        }

        private Player SaveOrReturnPlayer(PlayerInfo playerInfo)
        {
            using (var db = new DataContext())
            {
                var matchingPlayer = db.Player.FirstOrDefault(e => e.Name == playerInfo.Name);
                if (matchingPlayer == null)
                {
                    var newPlayer = new Player();
                    newPlayer.Name = playerInfo.Name;
                    db.Player.Add(newPlayer);
                    db.SaveChanges();
                    matchingPlayer = newPlayer;
                }
                return matchingPlayer;
            }
        }

        private Game SaveOrReturnGame(GameInfo game, Session session)
        {
            using (var db = new DataContext())
            {
                var matchingGame = db.Game.FirstOrDefault(e => e.Session == session.ID && e.GameNumber == game.GameNumber);
                if (matchingGame == null)
                {
                    var newGame = new Game();
                    newGame.Session = session.ID;
                    newGame.Lane = game.Lane;
                    newGame.GameNumber = game.GameNumber;
                    db.Game.Add(newGame);
                    db.SaveChanges();
                    matchingGame = newGame;
                }
                return matchingGame;
            }

        }

        private Session SaveOrReturnSession(GameInfo game, string PdfDocumentPath)
        {
            using (var db = new DataContext())
            {
                var dateString = game.Date;
                var dateObject = DateTime.Parse(dateString);

                var matchingSession = db.Session.FirstOrDefault(e => e.Date == dateObject);

                if (matchingSession == null)
                {
                    var newSession = new Session();
                    newSession.Date = dateObject;
                    newSession.PdfDocument = PdfDocumentPath;
                    db.Session.Add(newSession);
                    db.SaveChanges();
                    matchingSession = newSession;
                }
                return matchingSession;
            }
        }


        public List<GameInfo> ReadFromPdf(string file)
        {
            var lineArray = ConstructLineArrayFromFile(file);

            var gamesDetails = ConstructGameInfo(lineArray);


            return gamesDetails;

        }

        private List<GameInfo> ConstructGameInfo(List<string> lineArray)
        {
            var gameInfoList = new List<GameInfo>();

            var gameInfoLines = GetGameInfoLines(lineArray);
            for (int i = 0; i < (gameInfoLines.Count - 1); i++)
            {

                var gameInfoLine = lineArray[gameInfoLines[i]];


                var gameInfo = GetGameAndLaneInfo(gameInfoLine);


                if (gameInfo == null) { continue; }
                var linesBetween = FindLinesBetween(lineArray, gameInfoLines[i], gameInfoLines[i + 1]);
                if (linesBetween.Any())
                {
                    if (linesBetween[0].StartsWith("Player"))
                    {
                        var playerInfo = ConstructPlayerInfo(linesBetween);
                        gameInfo.PlayerScores.AddRange(playerInfo);
                    }
                }
                gameInfoList.Add(gameInfo);
            }



            return gameInfoList;
        }



        private GameInfo GetGameAndLaneInfo(string gameInfoLine)
        {

            var spl = gameInfoLine.Split(' ').Where(e => e != "").ToList();
            if (spl.Count == 1) { return null; }

            var GameInfo = new GameInfo();

            GameInfo.Lane = Convert.ToInt32(spl[3]);
            GameInfo.GameNumber = Convert.ToInt32(spl[5]);
            GameInfo.Date = spl[6];


            return GameInfo;
        }

        /// <summary>
        /// Gets the list of line numbers that contain information about the 'Game' (such as date, lane number). 
        /// The lines between those that contain the word 'Team' contain information about the game.
        /// </summary>
        /// <param name="lineArray">Line array content from the document</param>
        /// <returns>List of line numbers</returns>
        private static List<int> GetGameInfoLines(List<string> lineArray)
        {
            var gameInfoLines = new List<int>();
            int l = 0;
            foreach (var line in lineArray)
            {
                if (line.StartsWith("Team"))
                {
                    gameInfoLines.Add(l);
                }
                l++;
            }
            return gameInfoLines;
        }

        /// <summary>
        /// Reads in the Player Info. The lines inbetween the lines that start with the string 'Total' contain the information about the Player. All we really need is the score string and most everything else can be extracted from that
        /// </summary>
        /// <param name="playerGameLines">The lines from which to extract data</param>
        /// <returns>List of populated PlayerInfo objects</returns>
        private List<PlayerInfo> ConstructPlayerInfo(List<string> playerGameLines)
        {
            var playerInfoList = new List<PlayerInfo>();

            var playerInfoLines = new List<int> { 0 };
            for (var i = 0; i < playerGameLines.Count; i++)
            {
                if (playerGameLines[i].StartsWith("Total"))
                {
                    playerInfoLines.Add(i);
                }
            }

            for (var i = 0; i < (playerInfoLines.Count - 1); i++)
            {
                var playerInfostr = FindLinesBetween(playerGameLines, playerInfoLines[i], playerInfoLines[i + 1]);

                var PlayerInfo = new PlayerInfo();
                PlayerInfo.ScoreString = playerInfostr[0];
                PlayerInfo.ParseScoreString();

                playerInfoList.Add(PlayerInfo);


            }


            return playerInfoList;

        }

        /// <summary>
        /// Finds the lines between two positions 
        /// </summary>
        /// <param name="lines">List of lines</param>
        /// <param name="start">Start position</param>
        /// <param name="end">End position</param>
        /// <returns></returns>
        private List<string> FindLinesBetween(List<string> lines, int start, int end)
        {
            return lines.Where((t, i) => (i > start) && (i < end)).ToList();
        }


        /// <summary>
        /// Reads in the PDF document and constructs a simple list of plaintext from the content in the document, split by newlines
        /// </summary>
        /// <param name="file">Filename of file</param>
        /// <returns>List of string</returns>
        private List<string> ConstructLineArrayFromFile(string file)
        {
            PdfReader pdfReader = new PdfReader(file);
            var textContent = new List<string>();
            for (var page = 1; page <= pdfReader.NumberOfPages; page++)
            {
                ITextExtractionStrategy strategy = new SimpleTextExtractionStrategy();
                var currentText = PdfTextExtractor.GetTextFromPage(pdfReader, page, strategy);
                textContent.Add(currentText);
            }
            var lineArray = new List<string>();
            foreach (var lines in textContent.Select(text => text.Split('\n')))
            {
                lineArray.AddRange(lines);
            }
            return lineArray;
        }

    }
}