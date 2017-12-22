using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Homepage.Models;
using Homepage.Models.Amenhokit;
using Homepage.Models.Amenhokit.PdfScan;
using Homepage.Services.Amenhokit;

namespace Homepage.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
    
          WriteDataToJson.WriteAll();
        //    return RedirectToAction("ProjectAmenhokit", "Projects");

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
