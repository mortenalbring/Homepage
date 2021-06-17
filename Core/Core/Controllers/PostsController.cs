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