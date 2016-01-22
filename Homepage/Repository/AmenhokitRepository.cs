using Homepage.Models.Amenhokit;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Homepage.Repository
{
	public class AmenhokitRepository
	{
        public List<GameInfo> ReadFromPdf(string file)
        {            
            var lineArray = ConstructLineArrayFromFile(file);

            var gamesDetails = ConstructGameInfo(lineArray);


            return gamesDetails;

        }

        private List<GameInfo> ConstructGameInfo(List<string> lineArray)
        {
            var GameInfoList = new List<GameInfo>();

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
                GameInfoList.Add(gameInfo);
            }

            return GameInfoList;
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

        private List<int> GetGameInfoLines(List<string> lineArray)
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

        private List<string> FindLinesBetween(List<string> lines, int start, int end)
        {
            return lines.Where((t, i) => (i > start) && (i < end)).ToList();
        }


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