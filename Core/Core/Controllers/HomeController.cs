using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Core.Models;
using Microsoft.Extensions.Localization;

namespace Core.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IStringLocalizer _localizer;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public HomeController(IStringLocalizer<HomeController> localizer,
            IStringLocalizer<SharedResource> sharedLocalizer, ILogger<HomeController> logger, IStringLocalizerFactory factory)
        {
            
            _localizer = localizer;
            _sharedLocalizer = sharedLocalizer;
            _logger = logger;
        }

        public IActionResult Index()
        {
            var msg = _sharedLocalizer["test"];
            var msg2 = _localizer["test"];

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel {RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier});
        }
    }
}