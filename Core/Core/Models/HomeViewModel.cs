using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Core.Models
{
    public class HomeViewModel
    {
        public List<PostsInfo> PostsInfos = new List<PostsInfo>();
        
        public string BlurbText1 { get; set; }
        public string BlurbText2 { get; set; }
        public class PostsInfo
        {
            public string Title { get; set; } 
            public IActionResult ActionResult { get; set; }
        }
    }
}