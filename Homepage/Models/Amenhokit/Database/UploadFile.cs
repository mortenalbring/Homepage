using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homepage.Models.Amenhokit.Database
{
    public class UploadFile
    {
        /// <summary>
        /// ID of file
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// User ID of user that uploaded file
        /// </summary>
        public int UserID { get; set; }

        /// <summary>
        /// Filename of local file that user uploaded
        /// </summary>
        public string Filename { get; set; }

        /// <summary>
        /// The auto-generated filename of the file on the server
        /// The file is usually appeneded with a GUID in case the user uploads the same file several times.
        /// </summary>
        public string Filepath { get; set; }


        /// <summary>
        /// Filesize in bytes
        /// </summary>
        public int Filesize { get; set; }

        private DateTime? _dateCreated = null;

        /// <summary>
        /// The date and time the file was uploaded
        /// </summary>        
        [Column(TypeName = "DateTime2")]
        public DateTime DateCreated
        {
            get
            {
                return _dateCreated.HasValue
                    ? _dateCreated.Value
                    : DateTime.UtcNow;
            }

            set { _dateCreated = value; }
        }
    }
}
