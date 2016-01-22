using Homepage.Repository;
using System;
using System.Collections.Generic;
using System.IO;
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
            //var file = Server.MapPath("~/tempfiles/test4.pdf");

           // var amenhokitRepository = new AmenhokitRepository();

          //  var gameDetails = amenhokitRepository.ReadFromPdf(file);

            return View();
        }

        public ActionResult ProjectTest()
        {
            return View();
        }


        [HttpGet]
        public JsonResult TestReadFile()
        {

            var filepath = Server.MapPath("~/tempfiles/test1.txt");

            var file = new StreamReader(filepath);
            var output = "";
            string line;
            while ((line = file.ReadLine()) != null)
            {
                output = output + line;                
            }

            return Json(output, JsonRequestBehavior.AllowGet);

        }
        [HttpGet]
        public JsonResult GetGameInfo()
        {
            try
            {            
                var amenhokitRepository = new AmenhokitRepository();
                var file = HttpContext.Server.MapPath("/tempfiles/test4.pdf");
                var gameDetails = amenhokitRepository.ReadFromPdf(file);
                return Json(new { success = true, data = gameDetails}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            
            
        }

        [HttpPost]
        public JsonResult ProcessFile(string filename)
        {
            var amenhokitRepository = new AmenhokitRepository();
            var file = Server.MapPath("~/tempfiles/" + filename);
            var gameDetails = amenhokitRepository.ReadFromPdf(file);

            return Json(gameDetails, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ListFiles()
        {
            var files = Directory.GetFiles(Server.MapPath("~/tempfiles"));
            return Json(files, JsonRequestBehavior.AllowGet);
        }
    }
}