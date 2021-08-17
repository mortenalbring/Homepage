using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Localization;

namespace Core.Models
{
    public class PostsOverviewViewModel
    {
        public class PostsInfo
        {
            public string Title { get; set; } 
            public IActionResult ActionResult { get; set; }
        }
    }

    public class PostInfoBox
    {
        public LocalizedHtmlString Title { get; set; }
        public LocalizedHtmlString TextLong { get; set; }
        public LocalizedHtmlString TextShort { get; set; }
        public string CoverImagePath { get; set; }
    }
}