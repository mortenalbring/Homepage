using Microsoft.AspNetCore.Mvc.Localization;

namespace Core.Models
{
    public class PostInfoBox
    {
        public LocalizedHtmlString Title { get; set; }
        public LocalizedHtmlString TextLong { get; set; }
        public LocalizedHtmlString TextShort { get; set; }
        public string CoverImagePath { get; set; }
    }
}