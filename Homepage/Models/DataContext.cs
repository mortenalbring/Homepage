using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Homepage.Models.Amenhokit;
using Homepage.Models.Amenhokit.Database;
using Homepage.Models.Amenhokit.PdfScan;

namespace Homepage.Models
{
    public class DataContext : DbContext
    {
        public DataContext() : base("AmenhokitConnection")
        {}

        public DbSet<Player> Player { get; set; }
        public DbSet<Game> Game { get; set; }
        public DbSet<PlayerScore> PlayerScore { get; set; }
        public DbSet<Session> Session { get; set; }
        public DbSet<UploadFile> UploadFiles { get; set; }

    }
}
