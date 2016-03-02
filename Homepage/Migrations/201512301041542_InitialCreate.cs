namespace Homepage.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Players",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.Games",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Lane = c.Int(nullable: false),
                        Date = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.PlayerGames",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        PlayerID = c.Int(nullable: false),
                        GameID = c.Int(nullable: false),
                        GameNumber = c.Int(nullable: false),
                        TotalScore = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.PlayerGames");
            DropTable("dbo.Games");
            DropTable("dbo.Players");
        }
    }
}
