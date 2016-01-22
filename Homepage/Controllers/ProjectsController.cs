﻿using Homepage.Repository;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Homepage.Models.Amenhokit;

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

        [HttpGet]
        public JsonResult ListFiles()
        {
            var files = Directory.GetFiles(Server.MapPath("/tempfiles"));
            return Json(files, JsonRequestBehavior.AllowGet);
        }

        private List<GameInfo> GetGameInfo(string filename)
        {
            var amenhokitRepository = new AmenhokitRepository();
            var file = Server.MapPath("~/tempfiles/" + filename);
            var gameDetails = amenhokitRepository.ReadFromPdf(file);

            return gameDetails;
        }


    }
}