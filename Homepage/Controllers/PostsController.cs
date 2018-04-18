using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Homepage.Controllers
{
    public class PostsController : Controller
    {
        //
        // GET: /Posts/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ComputationsIrreversibility()
        {
            return View();
        }

        public ActionResult PovRayPeterdeJong()
        {
            return View();
        }

        public ActionResult LorenzAttractor()
        {
            return View();
        }

        public ActionResult MengerSponge()
        {
            return View();
        }

        public ActionResult TSUCS()
        {
            return View();
        }

        public ActionResult FractalChaos()
        {
            ViewBag.Section = 1;
            return View("FractalChaos/FractalChaos");
        }

        public ActionResult FractalChaos2()
        {
            ViewBag.Section = 2;
            return View("FractalChaos/FractalChaos2");
        }
        public ActionResult FractalChaos3()
        {
            ViewBag.Section = 3;
            return View("FractalChaos/FractalChaos3");
        }
        public ActionResult FractalChaos4()
        {
            ViewBag.Section = 4;
            return View("FractalChaos/FractalChaos4");
        }
        public ActionResult FractalChaos5()
        {
            ViewBag.Section = 5;
            return View("FractalChaos/FractalChaos5");
        }
        public ActionResult FractalChaos6()
        {
            ViewBag.Section = 6;
            return View("FractalChaos/FractalChaos6");
        }
        public ActionResult FractalChaos7()
        {
            ViewBag.Section = 7;
            return View("FractalChaos/FractalChaos7");
        }
    }
}
