using System;
using Homepage.Models.Amenhokit;
using Homepage.Models.Amenhokit.PdfScan;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Homepage.Tests
{
    [TestClass]
    public class AmenhokitScoreTests
    {
        [TestMethod]
        public void TestScoreCalculator1()
        {
            var player = new PlayerInfo();
            player.ScoreString = "MORT 1 2 X 1 / 1 4 3 / 1 2 X 3 X 2 3 2";

            player.ScoreString = "MORT 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1";

            player.ParseScoreString();

            Assert.AreEqual(20, player.Score);
        }
        [TestMethod]
        public void TestScoreCalculator2()
        {
            var player = new PlayerInfo();            
            player.ScoreString = "MORT 9 / 9 / 9 / 9 / 9 / 9 / 9 / 9 / 9 / 9 / 1";

            player.ParseScoreString();

            Assert.AreEqual(182, player.Score);
        }
        [TestMethod]
        public void TestScoreCalculator3()
        {
            var player = new PlayerInfo();
            player.ScoreString = "MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 / 1";

            player.ParseScoreString();

            Assert.AreEqual(11, player.Score);
        }

        [TestMethod]
        public void TestScoreCalculator4()
        {
            var player = new PlayerInfo();
            player.ScoreString = "MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 9 / 5";

            player.ParseScoreString();

            Assert.AreEqual(15, player.Score);
        }


        [TestMethod]
        public void TestScoreCalculator5()
        {
            var player = new PlayerInfo();
            player.ScoreString = "MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 X 1 1";

            player.ParseScoreString();

            Assert.AreEqual(12, player.Score);
        }

        [TestMethod]
        public void TestScoreCalculator6()
        {
            var player = new PlayerInfo();
            player.ScoreString = "MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 5 / X";

            player.ParseScoreString();

            Assert.AreEqual(20, player.Score);
        }

        [TestMethod]
        public void TestScoreCalculator7()
        {
            var player = new PlayerInfo();
            player.ScoreString = "MORT X X 5 3 9 / 6 2 0 7 8 1 0 0 X X X X";

            player.ParseScoreString();

            Assert.AreEqual(151, player.Score);
        }

        [TestMethod]
        public void TestScoreCalculator8()
        {
            var player = new PlayerInfo();
            player.ScoreString = "MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 X X X";

            player.ParseScoreString();        

            Assert.AreEqual(30, player.Score);
        }

        [TestMethod]
        public void TestScoreCalculator9()
        {
            var player = new PlayerInfo();
            player.ScoreString = "MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 X X X X";

            player.ParseScoreString();

            Assert.AreEqual(60, player.Score);
        }

        [TestMethod]
        public void TestScoreCalculator10()
        {
            var player = new PlayerInfo();
            player.ScoreString = "MORT 1 / 6 / 3 2 X 5 0 X 3 / X 4 2 5 / 3";

            player.ParseScoreString();

            Assert.AreEqual(129, player.Score);
        }

        [TestMethod]
        public void TestScoreCalculator11()
        {
            var player = new PlayerInfo();
            player.ScoreString = "GEORGE 5 1 7 / 6 - 7 2 X 3 1 3 - 6 - 6 / 3 6";

            player.ParseScoreString();

            Assert.AreEqual(86, player.Score);
        }

        [TestMethod]
        public void TestScoreCalculator12()
        {
            var player = new PlayerInfo();
            player.ScoreString = "GEORGE 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 / 3 6";

            player.ParseScoreString();

            Assert.AreEqual(22, player.Score);
        }

        [TestMethod]
        public void TestScoreCalculator13()
        {
            var player = new PlayerInfo();
            player.ScoreString = "MORT 5 2 6 / 9 - 5 - 7 2 7 - 9 / 7 1 X 1 4";

            player.ParseScoreString();

            Assert.AreEqual(101, player.Score);
        }

    }
}
