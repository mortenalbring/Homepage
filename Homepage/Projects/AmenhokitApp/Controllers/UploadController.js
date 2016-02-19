var UploadController = function (FileUploadService, AjaxService,$scope) {
    $scope.completedFiles = [];

    $scope.existingFiles = FileUploadService.UploadedFiles;
    $scope.readyToUpload = function () {
        if (($scope.files && $scope.files.length)) {
            return true;
        }
        return false;
    }

    $scope.loading = false;

    $scope.wipeTables = function () {
        $scope.loading = true;

        AjaxService.WipeTables().then(function (response) {
            console.log("done");
            $scope.loading = false;

        });
    }

    $scope.updatePlayerNames = function () {
        $scope.loading = true;
        AjaxService.UpdatePlayerAliases().then(function (response) {
            console.log("done");
            $scope.loading = false;
            var xx = 42;

        });
    }

    $scope.updateDatabase = function () {
        $scope.loading = true;
        AjaxService.UpdateDatabase().then(function(response) {
            $scope.loading = false;
            var xx = 42;
        });

    }

    $scope.upload = function (files, event, rejectedFiles) {

        for (var r in rejectedFiles) {
            console.log(rejectedFiles[r]);
        }
        


        if (files && files.length) {

            for (var i = 0; i < files.length; i++) {

                (function (index) {

                    var file = files[i];

                    $scope.queries++;

                    FileUploadService.UploadFile(file, function (data) {
                        file.complete = true;

                        var index = files.indexOf(file);

                        files.splice(index, 1);

                        $scope.queries--;

                        $scope.completedFiles.push(data.Filepath);

                    });

                })(i);
            }

        }
    };
}