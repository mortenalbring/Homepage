using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;

namespace Core.Controllers
{
    public class PostsController : Controller
    {
        private readonly IStringLocalizer _localizer;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;
        
        public PostsController(IStringLocalizer<PostsController> localizer,
            IStringLocalizer<SharedResource> sharedLocalizer, ILogger<PostsController> logger)
        {
            _localizer = localizer;
            _sharedLocalizer = sharedLocalizer;
        }


        public IActionResult CssReflect()
        {
            return View("CssReflect");
        }

        public IActionResult Words()
        {
            return View("Words/Words");
        }

        public IActionResult WordsSearch()
        {
            return View("Words/WordsSearch");
        }

      
        
        public IActionResult FractalChaos()
        {
            ViewBag.Section = 1;
            return View("FractalChaos/FractalChaos");
        }
        public IActionResult FractalChaos2()
        {
            ViewBag.Section = 2;
            return View("FractalChaos/FractalChaos2");
        }
        public IActionResult FractalChaos2b()
        {
            ViewBag.Section = 2.1;
            return View("FractalChaos/FractalChaos2b");
        }

        public IActionResult RenderBig(string imageLoc)
        {
            ViewBag.ImageLocation = imageLoc;
            return View("FractalChaos/RenderBig");
        }

        public IActionResult FractalChaos3()
        {
            ViewBag.Section = 3;
            return View("FractalChaos/FractalChaos3");
        }
        public IActionResult FractalChaos4()
        {
            ViewBag.Section = 4;
            return View("FractalChaos/FractalChaos4");
        }

        public IActionResult FractalChaos5()
        {
            ViewBag.Section = 5;
            return View("FractalChaos/FractalChaos5");
        }
        public IActionResult FractalChaos6()
        {
            ViewBag.Section = 6;
            return View("FractalChaos/FractalChaos6");
        }
        
        public IActionResult FractalChaos7()
        {
            ViewBag.Section = 7;
            return View("FractalChaos/FractalChaos7");
        }

        public IActionResult AngularD3()
        {
            return View("AngularD3/AngularD3");
        }

        public IActionResult ComputationsIrreversibility()
        {
            return View();
        }


        public IActionResult Lorenz()
        {
            return View();
        }

        public IActionResult PeterDeJong()
        {
            return View();
        }
        
        public IActionResult MengerSponge()
        {
            return View();
        }

        public IActionResult TSUCS()
        {
            return View();
        }
        
        public IActionResult Localisation()
        {
            return View();
        }
    }
}