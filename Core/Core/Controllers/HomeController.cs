using System;
using System.Diagnostics;
using System.Globalization;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;

namespace Core.Controllers;

public class HomeController : Controller
{
    private readonly IStringLocalizer _localizer;
    private readonly ILogger<HomeController> _logger;
    private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

    public HomeController(IStringLocalizer<HomeController> localizer,
        IStringLocalizer<SharedResource> sharedLocalizer, ILogger<HomeController> logger)
    {
        _localizer = localizer;
        _sharedLocalizer = sharedLocalizer;
        _logger = logger;
    }

    public IActionResult About()
    {
        return View();
    }

    public IActionResult Contact()
    {
        return View();
    }


    public IActionResult Index()
    {
        var msg = _sharedLocalizer["test"];
        var msg2 = _localizer["test"];

        var vm = new HomeViewModel();
        vm.BlurbText1 = _localizer["IntroPart1"];
        vm.BlurbText1 = _sharedLocalizer["IntroPart1"];

        var test = Resources.Controllers.SharedResource.IntroPart1;

        var test2 = nameof(Resources.Controllers.SharedResource.IntroPart1);

        var test3 = _sharedLocalizer[nameof(Resources.Controllers.SharedResource.IntroPart1)];

        vm.BlurbText1 = _localizer[nameof(Resources.Controllers.HomeController.BlurbText1)];
        vm.BlurbText2 = _localizer[nameof(Resources.Controllers.HomeController.BlurbText2)];


        ViewData["NavbarCustomStyle"] = "navbar-ma-home";
        return View(vm);
    }

    [AllowAnonymous]
    [HttpPost]
    public IActionResult ToggleLanguage(string returnUrl)
    {
        var culture = "";

        var currentCulture = CultureInfo.CurrentCulture;

        culture = currentCulture.Name == "en-GB" ? "nb-NO" : "en-GB";

        Response.Cookies.Append(
            CookieRequestCultureProvider.DefaultCookieName,
            CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
            new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
        );

        returnUrl = returnUrl + "?culture=" + culture;
        return LocalRedirect(returnUrl);
    }

    [AllowAnonymous]
    [HttpPost]
    public IActionResult SetLanguage(string culture, string returnUrl)
    {
        Response.Cookies.Append(
            CookieRequestCultureProvider.DefaultCookieName,
            CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
            new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
        );


        return LocalRedirect(returnUrl);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}