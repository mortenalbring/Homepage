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

        public IActionResult FractalChaos()
        {
            ViewBag.Section = 1;
            return View("FractalChaos/FractalChaos");
        }
        public IActionResult FractalChaos2()
        {
            ViewBag.Section = 2;
            return View("FractalChaos/FractalChaos");
        }
        public IActionResult FractalChaos3()
        {
            ViewBag.Section = 3;
            return View("FractalChaos/FractalChaos");
        }
        public IActionResult FractalChaos4()
        {
            ViewBag.Section = 4;
            return View("FractalChaos/FractalChaos");
        }

        public IActionResult FractalChaos5()
        {
            ViewBag.Section = 5;
            return View("FractalChaos/FractalChaos");
        }
        public IActionResult FractalChaos6()
        {
            ViewBag.Section = 6;
            return View("FractalChaos/FractalChaos");
        }
        
        public IActionResult FractalChaos7()
        {
            ViewBag.Section = 7;
            return View("FractalChaos/FractalChaos");
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