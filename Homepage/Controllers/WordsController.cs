using System.Diagnostics;
using System.Web.Mvc;
using Homepage.Models.Words;
using Homepage.Projects.Words;

namespace Homepage.Controllers
{
    public class WordsController : Controller
    {
        [HttpGet]
        public ActionResult WordsVisualise()
        {
            var vm = new WordVisViewModel();
            vm.Search = "test";
            TempData["wordSearch"] = vm.Search;
            return View(vm);
        }
        
        [HttpPost]
        public ActionResult WordsVisualise(WordVisViewModel vm)
        {
            TempData["wordSearch"] = vm.Search;
            return View(vm);
        }

        [OutputCache(NoStore = true, Duration = 0)]
        public JsonResult GetWordsData()
        {
            var sw = new Stopwatch();
            sw.Start();
            var ws = new WordsService();
            var search = TempData["wordSearch"];

            
            var testObj = ws.GetWordOutput(search.ToString());

            var json2 = Json(testObj, JsonRequestBehavior.AllowGet);
            sw.Stop();
            Debug.WriteLine(sw.ElapsedMilliseconds);
            return json2;
        } 
        public ActionResult Index()
        {
            return View();
        }
    }
}