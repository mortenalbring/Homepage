var asciiGenerator = angular.module("ASCIIGenerator",[]);

asciiGenerator.controller("HomeController", function ($scope) {
    $scope.output = "";

    $scope.generate = function () {
                
        

        
        var spl = $scope.input.split("\n");
        var out = [];
        out.push("'<pre>' + '\\n' +");
        for (var i = 0; i < spl.length; i++) {            
            var safe = spl[i].replace("\\", "&bsol;");
            console.log(spl[i]);

            var line = "'" + safe + "'" + " + '\\n' + ";
            out.push(line);
            //console.log(line);
        }
        out.push("</pre>");
        $scope.output = out.join('\n');
        //console.log($scope.output);

        //$scope.output = $scope.input.replace("\\", "&bsol;");
    }
});
