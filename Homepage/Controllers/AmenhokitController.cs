using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Homepage.Models;
using Homepage.Models.Amenhokit.Database;

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

                    return Json(new {success = true, sessions = sessions}, JsonRequestBehavior.AllowGet);
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

    }
}