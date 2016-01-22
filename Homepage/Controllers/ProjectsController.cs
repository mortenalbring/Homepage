using Homepage.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Homepage.Controllers
{
    public class ProjectsController : Controller
    {
        public ActionResult ProjectAngularD3()
        {
            return View();
        }

        public ActionResult ProjectAngularClicker()
        {
            return View();
        }

        public ActionResult ProjectAmenhokit()
        {
            var file = Server.MapPath("~/tempfiles/test4.pdf");

            var amenhokitRepository = new AmenhokitRepository();

            var gameDetails = amenhokitRepository.ReadFromPdf(file);

            return View();
        }
    }
}