var asciiGenerator = angular.module("ASCIIGenerator",[]);

asciiGenerator.controller("HomeController", function ($scope) {
    $scope.output = "";

    $scope.generate = function () {
                
        

        
        var spl = $scope.input.split("\n");
        var out = [];
        out.push("'<pre>' + ");
        for (var i = 0; i < spl.length; i++) {
            
            var safe = spl[i];
            safe = replaceAll(safe, "\\\\", "&bsol;");
            safe = replaceAll(safe, "'", "&#39;");            
            safe = replaceAll(safe, " ", "&nbsp;");
            console.log(spl[i]);

            var line = "'" + safe + "' + " + "'\\n'" + " + ";
            out.push(line);            
        }
        out.push("'</pre>'");
        $scope.output = out.join('\n');
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
});
