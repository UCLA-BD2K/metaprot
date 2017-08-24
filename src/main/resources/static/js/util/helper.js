import api from './api';

/**
 * Handles files being uploaded to S3.
 * Naming convention $fileInput retained from previous JQuery implementation.
 */
export function fileUploadSubmitHandler($fileInput, cb) {
    // upload w/ token
    // number of files to upload, for now, just handle 1
    var numFiles = $fileInput[0].files.length;
    var numFilesUploaded = 0;

    if (!numFiles) {
        return;
    }

    var arr = $fileInput[0].value.split("\\");
    var nameOfFile = arr[arr.length-1];
    /*console.log("FILENAME: " + nameOfFile);
    var store = sessionStorage.getItem("store") ? JSON.parse(sessionStorage.getItem("store")) : null;
    if(store){
        var filenames = store.filenames;
        for(var i = 0; i < filenames.length; i++){
            if(filenames[i] == nameOfFile){
                alert("A file with this name already exists. Please rename and upload.");
                return;
            }
        }
    }*/

    function uploadFileToS3(options, token, moreParams) {
        // after retrieving a token, can upload to s3
        var delayCounter = 0;
        S3Uploader.upload(options.data, "user-input/" + token + "/" + options.name, moreParams,
            function(data) {
                cb.addFileToTree(options.name);
                numFilesUploaded++;
                if (numFilesUploaded == numFiles) {
                    // we are done uploading!
                    console.log("all files have been uploaded to s3");
                    cb.updateProgress({uploadProgress:100});

                    notifyAllFilesUploaded(token, data.Key);

                }
            },
            function(key, bytesUploaded, bytesTotal) {
                // called whenever bytes transferred to s3, with performance delay
                delayCounter++;
                if (delayCounter == 10) {
                    cb.updateProgress({uploadProgress: bytesUploaded/bytesTotal*100});
                }
            });
    }

    // when all files are uploaded, tell server to check for integrity
    function notifyAllFilesUploaded(token, s3Key) {

        cb.updateProgress({
            progressText: (<div><h5>Checking integrity...</h5><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>)
        });

        var formData = new FormData();
        formData.append("objectKey", s3Key);
        formData.append("token", token);
        // TODO abineet, if you want more info from the client, you can grab it from the HTML and
        // formData.append() it.

        // notify server of file upload and updates UI to reflect status
        fetch("/analyze/integrity-check", {
            method: "POST",
            body: formData
        })
        .then( response => {
            if (response.ok)
                return response.text();
            else {
                return response.json().then( json => {
                    throw new Error(json.message || response.statusText);
                })
            }
        })
        .then( success => {
             var contentWithLink = convertMessageWithLink(success);
             cb.updateProgress({
                progressText: ( <div className="alert alert-success"> { contentWithLink } </div> )
            });
        })
        .catch( error => {
            cb.updateProgress({
                progressText: (<div className="alert alert-danger"> { error.message } </div>)
            });
         })

    }



    var afterEachFileRead = function(options) {
        var newFilename = options.name;
        /*(if (sessionStorage.getItem("root") === null) {
            sessionStorage.setItem("root", JSON.stringify([newFilename]));
        }
        else{
            var curr = JSON.parse(sessionStorage.getItem("root"));
            curr.push(newFilename);
            sessionStorage.setItem("root", JSON.stringify(curr));
        }*/

        var moreParams = {
            ContentLength : options.size,
            ContentType : options.type
        };
        /*TODO: (Yolanda) The "sessionToken" key in sessionStorage is keeping the sessionToken.
         *When the page loads there should be some interface that asks the user if they previously have a token
          * or to generate a new one.
         */

        var storeData = sessionStorage.getItem("store");
        console.log("StoreData: ", storeData);
        var store = storeData ? JSON.parse(storeData) : null;

        if(!store || !store.token) {
            // get token for s3 upload
            api.getToken().then( token => {
                cb.setToken(token);
                uploadFileToS3(options, token, moreParams);
            }).catch ( error => alert(error.message) )
        }
        else{
            console.log("session Updating Backend");
            uploadFileToS3(options, store.token, moreParams);
        }


    };

    cb.updateProgress()

    // set up FC and read in files
    FileController.setOnFileRead(afterEachFileRead);
    FileController.setInputElement($fileInput);
    FileController.readFiles();

}



