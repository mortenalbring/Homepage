using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Core.Models
{
    public class PostsOverviewViewModel
    {
        public List<PostsInfo> PostsInfos = new List<PostsInfo>();

        public class PostsInfo
        {
            public string Title { get; set; } 
            public IActionResult ActionResult { get; set; }
        }
    }
}