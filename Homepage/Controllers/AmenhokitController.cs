using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Homepage.Models;
using Homepage.Models.Amenhokit.Database;
using Homepage.Repository;

namespace Homepage.Controllers
{
    public class AmenhokitController : Controller
    {
        [HttpGet]
        public JsonResult ListSessions()
        {
            try
            {
                using (var db = new DataContext())
                {
                    var sessions = db.Session.ToList();

                    return Json(new { success = true, sessions = sessions }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetGames(int sessionId)
        {
            try
            {
                using (var db = new DataContext())
                {
                    var games = db.Game.Where(e => e.Session == sessionId).ToList();

                    return Json(new { success = true, games = games }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult WipeTables()
        {
            try
            {
                var am = new AmenhokitRepository();
                am.WipeTables();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetScores(int sessionId, int gameId)
        {
            try
            {
                using (var db = new DataContext())
                {
                    var playerScores = db.PlayerScore.Where(e => (e.Session == sessionId) && (e.Game == gameId)).ToList();

                    return Json(new { success = true, playerScores = playerScores }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult GetPlayer(int playerId)
        {
            try
            {
                using (var db = new DataContext())
                {
                    var player = db.Player.FirstOrDefault(e => e.ID == playerId);

                    return Json(new { success = true, player = player }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult UpdateDatabase()
        {
            try
            {
                var allfiles = Directory.GetFiles(Server.MapPath("/tempfiles"), "*", SearchOption.AllDirectories);
                var amenhokitRepository = new AmenhokitRepository();
                var sessionList = new List<Session>();
                foreach (var file in allfiles)
                {
                    var gameDetails = amenhokitRepository.ReadFromPdf(file);

                    var virtualPath = GetVirtualPath(file);

                    var sessions = amenhokitRepository.ConstructDatabaseObjects(gameDetails, virtualPath);
                    sessionList.AddRange(sessions);
                }

                amenhokitRepository.UpdatePlayerScoresFromAliases();

                return Json(new { success = true, sessions = sessionList }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult UpdatePlayerScoresFromAliases()
        {
            try
            {
                var amenhokitRepository = new AmenhokitRepository();

                amenhokitRepository.UpdatePlayerScoresFromAliases();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }


        }

        public string GetVirtualPath(string physicalPath)
        {
            if (!physicalPath.StartsWith(HttpContext.Request.PhysicalApplicationPath))
            {
                throw new InvalidOperationException("Physical path is not within the application root");
            }

            return "~/" + physicalPath.Substring(HttpContext.Request.PhysicalApplicationPath.Length)
                  .Replace("\\", "/");
        }

    }
}