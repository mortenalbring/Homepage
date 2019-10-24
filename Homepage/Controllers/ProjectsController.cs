using Homepage.Repository;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Homepage.Models.Amenhokit;
using Homepage.Models.Amenhokit.PdfScan;
using Homepage.Models.Words;
using Homepage.Projects.Words;
using Newtonsoft.Json;
using WebMatrix.WebData;

namespace Homepage.Controllers
{
    public class ProjectsController : Controller
    {

        [HttpGet]
        public ActionResult ProjectWordsWithinWordsVis()
        {
            var vm = new WordVisViewModel();
            vm.Search = "test";
            TempData["wordSearch"] = vm.Search;
            return View(vm);
        }
        
        [HttpPost]
        public ActionResult ProjectWordsWithinWordsVis(WordVisViewModel vm)
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
        public ActionResult ProjectWordsWithinWords()
        {
            return View();
        }
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
            return View();          
        }

        public ActionResult ProjectAmenhokitOld()
        {
            return View();
        }

        public ActionResult ProjectPennyGame()
        {
            return View();
        }

        public JsonResult Json1()
        {
            return Json(new { test = "yes" });
        }

        [HttpGet]
        public JsonResult GetGameInfo()
        {
            try
            {
                var gameDetails = GetGameInfo("test4.pdf");
                return Json(new { success = true, data = gameDetails }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult CalculateScore(string scorestring)
        {
            try
            {
                var player = new PlayerInfo();
                player.ScoreString = "Test " + scorestring;
                player.ParseScoreString();
                return Json(new { success = true, data = player.Score }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }        
        }

        [HttpPost]
        public JsonResult ProcessFile(string filename)
        {
            try
            {
                var gameDetails = GetGameInfo(filename);
                return Json(new { success = true, data = gameDetails }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }

      

        private List<PdfGameInfo> GetGameInfo(string filename)
        {
            var amenhokitRepository = new AmenhokitRepository();
            var file = Server.MapPath("~/tempfiles/" + filename);
            var gameDetails = amenhokitRepository.ReadFromPdf(file);

            //amenhokitRepository.ConstructDatabaseObjects(gameDetails,filename);

            return gameDetails;
        }



       

    }
}