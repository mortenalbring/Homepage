var BowlingService = function() {
    var bws = {};

    bws.CalculateFrameScores = function(scoreString) {
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }


        function nextTwoAfterStrikeFromFrameArray(index, array) {
            if ((index + 1) === array.length) {


                return 0;
            }
            var total = 0;

            var nextFrame = array[index + 1];
            if (nextFrame.Result.length === 1) {
                total = total + 10;

                if ((index + 2) === array.length) {
                    return total;
                }
                var frameAfterNext = array[index + 2];
                if (frameAfterNext.Result.length === 1) {
                    total = total + 10;
                } else {
                    total = total + parseInt(frameAfterNext.Result[0]);
                }

            } else {
                var s1 = 0;
                if (isNumeric(nextFrame[Result[0]])) {
                    s1 = parseInt(nextFrame.Result[0]);
                }                
                total = s1;

                var c2 = nextFrame.Result[1];
                if (c2 === "/") {
                    total += (10 - total);
                } else {
                    var s2 = 0;
                    if (isNumeric(nextFrame[Result[1]])) {
                        s2 = parseInt(nextFrame.Result[1]);
                    }
                    total = total + s2;
                }

            }
            return total;
        }



        function nextOneAfterSpareFromFrameArray(index, array) {
            if ((index + 1) === array.length) {
                return 0;
            }
            var nextArray = array[index + 1];
            if (nextArray.Result.length == 1) {
                return 10;
            }
            var r1 = nextArray.Result[0];
            return parseInt(r1);

        }



        function returnScoreFromFrameArray(index, array) {
            var results = array[index].Result;

            //If there's only one result, that frame was a strike
            if (results.length === 1) {
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
            for (var j = 0; j < fArray.length; j++) {
                var fscore = returnScoreFromFrameArray(j, fArray);
                fArray[j].Score = fscore;
            }
            return fArray;


        }



        var spl = scoreString.split(" ");
        spl.shift();
        var fa = calculateFrameArray(spl);
        return fa;

        var testss = "X 7 / 7 2 9 / X X X 2 3 6 / 7 / 3";
        var testssarr = testss.split(" ");

        calculateFrameArray(testssarr);

        var onlyss = scoreString.replace(spl[0], "");

        var scoreArray = onlyss.split(" ");


        calculateFrameArray(spl);

        var xx = 42;



    }

    return bws;


}