using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Homepage.Models;
using Homepage.Models.Amenhokit;

namespace Homepage.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            using (var db = new DataContext())
            {
                var testplayer = new PlayerInfo();
                testplayer.Name = "MOOP";
                db.Player.Add(testplayer);
                db.SaveChanges();

            }

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
