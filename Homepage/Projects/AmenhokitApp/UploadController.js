var UploadController = function (FileUploadService, $scope) {
    $scope.upload = function (files, event, rejectedFiles) {

        for (var r in rejectedFiles) {
            console.log(rejectedFiles[r]);
        }
        $scope.loading = true;


        if (files && files.length && ($scope.radio.model != undefined)) {

            for (var i = 0; i < files.length; i++) {

                (function (index) {

                    var file = files[i];

                    $scope.queries++;

                    FileUploadService.UploadFile(file, $scope.radio.model, function (data) {
                        file.complete = true;

                        var index = files.indexOf(file);

                        files.splice(index, 1);

                        $scope.queries--;

                        $scope.completedFiles.push(data);

                    });

                })(i);
            }

        }
    };
}