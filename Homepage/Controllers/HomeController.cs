using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Homepage.Models.Amenhokit;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;

namespace Homepage.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ReadFromPdf();

            return View("Redesign");
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        public void ReadFromPdf()
        {
            var file = Server.MapPath("~/tempfiles/test4.pdf");
            var lineArray = makeLineList(file);

            var gameInfoLines = GetGameInfoLines(lineArray);

            var playerInfoLines = new List<string>();


            for (int i = 0; i < (gameInfoLines.Count-1); i++)
            {

                var gameInfoLine = lineArray[gameInfoLines[i]];

                var gameInfo = GetGameAndLaneInfo(gameInfoLine);
                if (gameInfo == null) { continue; }


                var linesBetween = findLinesBetween(lineArray, gameInfoLines[i], gameInfoLines[i + 1]);
                if (linesBetween.Any())
                {
                    if (linesBetween[0].StartsWith("Player"))
                    {                   
                        var playerInfo = GetPlayerResults(linesBetween);
                        gameInfo.PlayerScores.AddRange(playerInfo);
                    }
                }

                var xxx = 42;

            }

            

            var xx = 42;

        }

        private GameInfo GetGameAndLaneInfo(string gameInfoLine)
        {

            var spl = gameInfoLine.Split(' ').Where(e => e != "").ToList();
            if (spl.Count == 1) { return null; }

            var GameInfo = new GameInfo();

            GameInfo.Lane = Convert.ToInt32(spl[3]);
            GameInfo.GameNumber = Convert.ToInt32(spl[5]);
            GameInfo.Date = Convert.ToDateTime(spl[6]);


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
        private List<PlayerInfo> GetPlayerResults(List<string> PlayerGameLines)
        {
            var playerInfoList = new List<PlayerInfo>();




            var playerInfoLines = new List<int>();
            playerInfoLines.Add(0);
            for (int i = 0; i < PlayerGameLines.Count; i++)
            {
                if (PlayerGameLines[i].StartsWith("Total"))
                {
                    playerInfoLines.Add(i);
                }                
            }

            for (int i = 0; i < (playerInfoLines.Count-1); i++)
            {
                var PlayerInfo = new PlayerInfo();
                var playerInfostr = findLinesBetween(PlayerGameLines, playerInfoLines[i], playerInfoLines[i + 1]);
                PlayerInfo.ScoreString = playerInfostr[0];
                playerInfoList.Add(PlayerInfo);

                var xx = 42;


            }


            return playerInfoList;

        }

        private List<string> findLinesBetween(List<string> lines, int start, int end)
        {
            var output = new List<string>();
            for (int i = 0; i < lines.Count; i++)
            {
                if ((i > start) && (i < end))
                {
                    output.Add(lines[i]);
                }
            }
            return output;
        }

        private List<string> makeLineList(string file)
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

            foreach (var text in textContent)
            {
                var lines = text.Split('\n');

                lineArray.AddRange(lines);
            }

            return lineArray;

        }
    }
}
