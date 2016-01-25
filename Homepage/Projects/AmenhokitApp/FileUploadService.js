var FileUploadService = function ($rootScope, $http, $q, Upload) {

    var fac = {};

    fac.UploadedFiles = [];




    $http.get('/Projects/ListFiles').success(function (data) {
        for (var i = 0; i < data.length; i++) {
//            var rawDate = data[i].DateCreated;

            //Processing .NET date string to javascript date object
  //          var jsDate = new Date(parseInt(rawDate.substr(6)));
            //data[i].DateCreatedJS = jsDate;
            
            fac.UploadedFiles.push(data[i]);
        }

    }).error(function (a, b, c) {
        alert('Error in listing files');
    });

    fac.DeleteAll = function (callback) {
        $http.post('/Upload/DeleteAll').success(function () {
            fac.UploadedFiles.length = 0;

            if (callback) { callback(); }

        }).error(function (a, b, c) {

            alert(a);
            alert(b);
            alert(c);
        });

    }

    fac.DeleteFile = function (fileID, callback) {

        $http.post('/Upload/DeleteFile', {
            fileID: fileID
        }).success(function (a) {

            var match = fac.UploadedFiles.filter(function (e) {
                return e.ID == fileID;
            });

            var index = fac.UploadedFiles.indexOf(match[0]);

            fac.UploadedFiles.splice(index, 1);

            if (callback) { callback(); }

        }).error(function (a, b, c) {

            alert(a);
            alert(b);
            alert(c);
        });

    }

    fac.UploadFile = function (file, uploadFileType, callback) {

        Upload.upload({
            url: 'Upload/UploadFile', // webapi url
            method: 'POST',
            data: { uploadFileType: uploadFileType },
            uploadFileType: uploadFileType,
            file: file
        }).progress(function (evt) {
            // set upload percentage
            file.progress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function (data, status, headers, config) {
            // file is uploaded successfully

            var rawDate = data.DateCreated;

            //Processing .NET date string to javascript date object
            var jsDate = new Date(parseInt(rawDate.substr(6)));
            data.DateCreatedJS = jsDate;

            if (callback) { callback(data); }

            fac.UploadedFiles.push(data);

        }).error(function (data, status, headers, config) {
            // file failed to upload
            file.error = true;
            console.log(data);
            console.log(status);
        });

    }


    return fac;



}