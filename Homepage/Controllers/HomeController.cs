using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
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

            var playerInfoLines = new List<string>();


            for (int i = 0; i < (gameInfoLines.Count-1); i++)
            {
                var gameInfoLine = lineArray[gameInfoLines[i]];
                

                var linesBetween = findLinesBetween(lineArray, gameInfoLines[i], gameInfoLines[i + 1]);
                if (linesBetween.Any())
                {
                    if (linesBetween[0].StartsWith("Player"))
                    {                   
                        GetPlayerResults(linesBetween);

                    }
                }

                var xxx = 42;

            }

            

            var xx = 42;

        }



        private void GetPlayerResults(List<string> PlayerGameLines)
        {
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
                var playerInfo = findLinesBetween(PlayerGameLines, playerInfoLines[i], playerInfoLines[i + 1]);

                var xx = 42;


            }

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
