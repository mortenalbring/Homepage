﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homepage.Models.Amenhokit
{
    public class UploadedFile
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
        public string FileName { get; set; }

        /// <summary>
        /// The auto-generated filename of the file on the server
        /// The file is usually appeneded with a GUID in case the user uploads the same file several times.
        /// </summary>
        public string FilePath { get; set; }


        /// <summary>
        /// Filesize in bytes
        /// </summary>
        public int FileSize { get; set; }

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
