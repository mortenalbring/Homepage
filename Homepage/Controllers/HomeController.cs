using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Homepage.Models;
using Homepage.Models.Amenhokit;
using Homepage.Models.Amenhokit.PdfScan;

namespace Homepage.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            var player = new PlayerInfo();
            player.ScoreString = "MORT 5 2 6 / 9 - 5 - 7 2 7 - 9 / 7 1 X 1 4";

            player.ParseScoreString();

            return View("Index");
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


       

    }
}
