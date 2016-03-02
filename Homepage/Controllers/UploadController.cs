using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Homepage.Models.Amenhokit;
using Homepage.Models.Amenhokit.Database;

namespace Homepage.Controllers
{
    public class UploadController : Controller
    {
        [HttpGet]
        public JsonResult ListFiles()
        {
            var files = Directory.GetFiles(Server.MapPath("/tempfiles"));
            return Json(files, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult UploadFile()
        {
            string Message;
            var userID = 0;
            var uploadedFile = new UploadFile();
            try
            {
                var sentParameters = Request.Params;
                HttpFileCollectionBase files = Request.Files;

                if (files.Count == 0) { throw new Exception("No files recieved"); }
                uploadedFile = UploadFile(Request.Files, userID, "~\\tempfiles");
            }
            catch (Exception ex)
            {
                Message = ex.Message;
            }
            return Json(uploadedFile, JsonRequestBehavior.AllowGet);
        }

        private UploadFile UploadFile(HttpFileCollectionBase files, int userID, string basePath)
        {
            var uploadedFile = new UploadFile();
            string Message = "";
            try
            {
                var file = files[0];
                string actualFileName = Path.GetFileName(file.FileName);

                var newDirectory = "f" + Guid.NewGuid();

                

                var newpath = Path.Combine(basePath, newDirectory);                

                Directory.CreateDirectory(Server.MapPath(newpath));

                string fileName = Path.GetFileNameWithoutExtension(actualFileName) + Path.GetExtension(file.FileName);
                int size = file.ContentLength;




                var filepath = Path.Combine(newpath, fileName);

                var serverPath = Server.MapPath(filepath);


                file.SaveAs(serverPath);

                uploadedFile.Filename = actualFileName;
                uploadedFile.Filepath = filepath;
                uploadedFile.UserID = userID;
                uploadedFile.Filesize = size;


                Message = "File upload succeeded";


            }
            catch (Exception ex)
            {
                Message = ex.Message;
            }
            return uploadedFile;
        }

    }
}