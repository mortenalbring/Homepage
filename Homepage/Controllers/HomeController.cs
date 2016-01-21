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
            var file = Server.MapPath("~/tempfiles/test2.pdf");
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

            var xx = 42;

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
