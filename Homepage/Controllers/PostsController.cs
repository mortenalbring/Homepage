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
            return View("FractalChaos/FractalChaos");
        }

        public ActionResult FractalChaos2()
        {
            return View("FractalChaos/FractalChaos2");
        }
        public ActionResult FractalChaos3()
        {
            return View("FractalChaos/FractalChaos3");
        }
        public ActionResult FractalChaos4()
        {
            return View("FractalChaos/FractalChaos4");
        }

    }
}
