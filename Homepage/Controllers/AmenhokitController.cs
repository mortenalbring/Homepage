using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Homepage.Models;
using Homepage.Models.Amenhokit.Database;
using Homepage.Models.Amenhokit.ViewModels;
using Homepage.Repository;

namespace Homepage.Controllers
{
    public class AmenhokitController : Controller
    {
        public void FixPlayerScores()
        {

            using (var db = new DataContext())
            {
                var playerScores = db.PlayerScore.ToList();
                var removed = 0;
                foreach (var ps in playerScores)
                {
                    var dupes =
                        db.PlayerScore.Where(
                            e =>
                                e.Session == ps.Session && e.Game == ps.Game && e.Player == ps.Player &&
                                e.Score == ps.Score).ToList();

                    if (dupes.Count > 1)
                    {
                        var xx = 42;
                        var first = dupes.First();
                        var others = dupes.Where(e => e.ID != first.ID).ToList();

                        foreach (var other in others)
                        {
                            db.PlayerScore.Attach(other);
                            db.PlayerScore.Remove(other);
                            removed++;
                            Debug.WriteLine(removed);
                            db.SaveChanges();
                        }

                        var zz = 42;

                    }
                }
                
            }
        }
        public void FixGames()
        {
            using (var db = new DataContext())
            {
                var allSessions = db.Session.ToList();

                foreach (var session in allSessions)
                {
                    var games = db.Game.Where(e => e.Session == session.ID).ToList();

                    var grouped = games.GroupBy(e => e.GameNumber).ToList();
                    foreach (var group in grouped)
                    {
                        if (group.Count() > 1)
                        {
                            var xx = 42;
                            var firstGroup = group.First();

                            var otherGroups = group.Where(e => e.ID != firstGroup.ID);

                            foreach (var other in otherGroups)
                            {
                                var playerScores = db.PlayerScore.Where( e => e.Session == session.ID && e.Game == other.ID).ToList();

                                foreach (var score in playerScores)
                                {
                                    db.PlayerScore.Attach(score);
                                    score.Game = firstGroup.ID;
                                    db.SaveChanges();
                                }

                                db.Game.Attach(other);
                                db.Game.Remove(other);
                                db.SaveChanges();
                                var zz = 42;
                            }

                        }
                    }
                }
            }
        }
        public void FixSessions()
        {
            using (var db = new DataContext())
            {
                var sessions = db.Session.GroupBy(e => e.Date).Where(e => e.Count() > 1).ToList();

                foreach (var session in sessions)
                {
                    var first = session.First();
                    var others = session.Where(e => e.ID != first.ID).ToList();

                    foreach (var other in others)
                    {
                        var brokenGames = db.Game.Where(e => e.Session == other.ID).ToList();

                        foreach (var brokenGame in brokenGames)
                        {
                            db.Game.Attach(brokenGame);
                            brokenGame.Session = first.ID;
                            db.SaveChanges();
                        }

                        var brokenPlayerScores = db.PlayerScore.Where(e => e.Session == other.ID).ToList();

                        foreach (var brokenScore in brokenPlayerScores)
                        {
                            db.PlayerScore.Attach(brokenScore);
                            brokenScore.Session = first.ID;
                            db.SaveChanges();
                        }

                        db.Session.Remove(other);
                        db.SaveChanges();
                    }
                }

                var xx = 42;
            }
        }

        [HttpPost]
        public void AddNewScore(int playerId, string gameDate, int gameNumber, int lane, string scoreString, int finalScore)
        {
            try
            {
                using (var db = new DataContext())
                {
                    var player = db.Player.FirstOrDefault(e => e.ID == playerId);
                    if (player == null)
                    {
                        throw new Exception("No player found with ID " + playerId);
                    }

                    var gameDateObj = DateTime.Parse(gameDate);

                    var session =
                        db.Session.FirstOrDefault(
                            e =>
                                e.Date.Year == gameDateObj.Year && e.Date.Month == gameDateObj.Month &&
                                e.Date.Day == gameDateObj.Day);

                    if (session == null)
                    {
                        session = new Session {Date = gameDateObj};
                        db.Session.Add(session);
                        db.SaveChanges();
                    }

                    var game = db.Game.FirstOrDefault(e => e.Session == session.ID && e.GameNumber == gameNumber);
                    if (game == null)
                    {
                        game = new Game
                        {
                            GameNumber = gameNumber,
                            Session = session.ID,
                            Lane = lane
                        };
                        db.Game.Add(game);
                        db.SaveChanges();
                    }                    

                    var playerScore = new PlayerScore
                    {
                        Player = player.ID,
                        Game = game.ID,
                        Session = session.ID,
                        Score = finalScore,
                        Scorestring = scoreString
                    };

                    db.PlayerScore.Add(playerScore);
                    db.SaveChanges();

                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                throw;
            }

        }
        [HttpPost]
        public JsonResult UpdateScore(int id, int newScore)
        {
            try
            {
                using (var db = new DataContext())
                {
                    var score = db.PlayerScore.FirstOrDefault(e => e.ID == id);
                    if (score == null)
                    {
                        throw new Exception("No such score with ID " + id);
                    }
                    score.Score = newScore;

                    db.SaveChanges();
                    

                    return Json(new { success = true, score = score }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

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

        /*

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
        */

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
        public JsonResult GetPlayers()
        {
            try
            {
                using (var db = new DataContext())
                {
                    var players = db.Player.ToList();

                    return Json(new { success = true, players = players }, JsonRequestBehavior.AllowGet);
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


        [HttpPost]
        public JsonResult GetScoresBySession(int sessionId)
        {
            using (var db = new DataContext())
            {
                var pscs = (from ps in db.PlayerScore
                            join p in db.Player on ps.Player equals p.ID
                            join g in db.Game on ps.Game equals g.ID
                            join s in db.Session on ps.Session equals s.ID
                            where s.ID == sessionId
                            select new { player = p, playerscore = ps, session = s, game = g }
                    ).ToList();

                var output = new List<PlayerSessionScore>();
                foreach (var psc in pscs)
                {
                    output.Add(new PlayerSessionScore(psc.player, psc.playerscore, psc.session, psc.game));
                }


                return Json(output, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetScoresByPlayer(int playerId)
        {
            using (var db = new DataContext())
            {
                var pscs = (from ps in db.PlayerScore
                            join p in db.Player on ps.Player equals p.ID
                            join g in db.Game on ps.Game equals g.ID
                            join s in db.Session on ps.Session equals s.ID
                            where p.ID == playerId
                            select new { player = p, playerscore = ps, session = s, game = g }
                    ).ToList();

                var output = new List<PlayerSessionScore>();
                foreach (var psc in pscs)
                {
                    output.Add(new PlayerSessionScore(psc.player, psc.playerscore, psc.session, psc.game));
                }


                return Json(output, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetAllScores()
        {
            using (var db = new DataContext())
            {
                var pscs = (from ps in db.PlayerScore
                    join p in db.Player on ps.Player equals p.ID
                    join g in db.Game on ps.Game equals g.ID
                    join s in db.Session on ps.Session equals s.ID
                    select new {player = p, playerscore = ps, session = s, game = g}
                    ).ToList();

                var output = new List<PlayerSessionScore>();
                foreach (var psc in pscs)
                {
                    output.Add(new PlayerSessionScore(psc.player,psc.playerscore,psc.session,psc.game));
                }
                

                return Json(output, JsonRequestBehavior.AllowGet);
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