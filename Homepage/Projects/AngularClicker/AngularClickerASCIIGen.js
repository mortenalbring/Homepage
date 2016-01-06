var asciiGenerator = angular.module("ASCIIGenerator", ['ngSanitize']);

asciiGenerator.controller("HomeController", function ($scope) {

    $scope.test = "moop";
    $scope.output = "";

    $scope.generate = function () {
        

        
        console.log($scope.output);

        
        var spl = $scope.input.split("\n");
        var out = [];
        for (var i = 0; i < spl.length; i++) {
            var line = "&#39;" + spl[i] + "&#39;" + "+ '\\n' + ";
            out.push(line);
            console.log(line);

        }
        $scope.output = out.join('\n');
        console.log($scope.output);

        $scope.output = $scope.input.replace("\\", "&bsol;");
    }
});

asciiGenerator.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);