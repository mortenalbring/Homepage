var BowlingService = function() {

    function BowlingService() {

    }
    BowlingService.prototype.CalculateFrameScores = function (scoreString) {
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function parseScore(score) {
            if (score === "X") {
                return 10;
            }
            var s = 0;
            if (isNumeric(score)) {
                s = parseInt(score);
            }
            return s;

        }

        function nextTwoAfterStrikeFromFrameArray(index, array) {
            if ((index + 1) === array.length) {
                //Final frame
                var thisFrame = array[index];
                var fc2 = thisFrame.Result[1];
                var fc3 = thisFrame.Result[2];

                var fs2 = parseScore(fc2);
                var fs3 = parseScore(fc3);

                return fs2 + fs3;
            }
            var total = 0;

            var nextFrame = array[index + 1];
            if (nextFrame.Result[0] === "X") {
                total = total + 10;

                if ((index + 2) === array.length) {
                    //Final frame
                    total = total + parseScore(nextFrame.Result[1]);


                    return total;
                }
                var frameAfterNext = array[index + 2];

                if (frameAfterNext.Result[0] === "X") {
                    total = total + 10;
                } else {
                    total = total + parseScore(frameAfterNext.Result[0]);
                }

            } else {
                var s1 = 0;
                if (isNumeric(nextFrame.Result[0])) {
                    s1 = parseInt(nextFrame.Result[0]);
                }
                total = s1;

                var c2 = nextFrame.Result[1];
                if (c2 === "/") {
                    total += (10 - total);
                } else {
                    var s2 = 0;
                    if (isNumeric(nextFrame.Result[1])) {
                        s2 = parseInt(nextFrame.Result[1]);
                    }
                    total = total + s2;
                }

            }
            return total;
        }



        function nextOneAfterSpareFromFrameArray(index, array) {
            if ((index + 1) === array.length) {
                //Final frame
                var thisFrame = array[index];
                var c3 = thisFrame.Result[2];
                if (c3 == "X") {
                    return 10;
                }
                var s3 = 0;
                if (isNumeric(c3)) {
                    s3 = parseInt(c3);
                }

                return s3;
            }
            var nextArray = array[index + 1];
            if (nextArray.Result.length == 1) {
                return 10;
            }
            var r1 = nextArray.Result[0];

            return parseScore(r1);

        }


        function returnScoreFromFrameArray(index, array) {
            var results = array[index].Result;



            if (results[0] === "X") {
                var nextTwo = nextTwoAfterStrikeFromFrameArray(index, array);
                return 10 + nextTwo;
            }
            var r1 = results[0];
            var r2 = results[1];
            if (r2 === "/") {
                var nextOne = nextOneAfterSpareFromFrameArray(index, array);
                return 10 + nextOne;
            }
            var s1 = 0;
            var s2 = 0;
            if (isNumeric(r1)) {
                s1 = parseInt(r1);
            }
            if (isNumeric(r2)) {
                s2 = parseInt(r2);
            }
            return s1 + s2;

        }


        function constructFrameArray(scoreArray) {
            var frameArray = [];
            var frameCount = 1;
            for (var i = 0; i < scoreArray.length; i++) {
                var frame = {};
                frame.Frame = frameCount;
                frame.Result = [];
                if (frameCount === 10) {
                    for (var j = i; j < scoreArray.length; j++) {
                        frame.Result.push(scoreArray[j]);
                    }
                    frameArray.push(frame);
                    break;
                }
                if (scoreArray[i] === "X") {
                    frame.Result.push("X");

                    frameArray.push(frame);
                    frameCount++;
                    continue;
                }
                frame.Result.push(scoreArray[i]);
                frame.Result.push(scoreArray[i + 1]);
                i++;
                frameArray.push(frame);
                frameCount++;


            }

            return frameArray;

        }

        function calculateFrameArray(scoreArray) {

            var fArray = constructFrameArray(scoreArray);
            var sum = 0;

            for (var j = 0; j < fArray.length; j++) {
                var fscore = returnScoreFromFrameArray(j, fArray);
                fArray[j].Score = fscore;
                sum = sum + fscore;
                fArray[j].Cumulative = sum;
            }
            return fArray;


        }

        //Need to strip out player names and other unsafe stuff from the string. May need some work!
        var safeString = "";
        for (var k = 0; k < scoreString.length; k++) {
            var isSafe = false;
            if (isNumeric(scoreString[k])) {
                isSafe = true;
            }
            if (scoreString[k] == "X") {
                isSafe = true;
            }
            if (scoreString[k] == "/") {
                isSafe = true;
            }
            if (scoreString[k] == "-") {
                isSafe = true;
            }

            if (isSafe) {
                safeString = safeString + scoreString[k];
            }


        }

        var spl = safeString.split("");

        //spl.shift();

        var fa = calculateFrameArray(spl);
        return fa;

    }

    return BowlingService;
}();