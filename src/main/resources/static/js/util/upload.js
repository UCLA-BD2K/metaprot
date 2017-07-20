//document.getElementById("token_num").innerHTML = sessionStorage.getItem("sessionToken");
//console.log(sessionStorage.getItem("sessionToken"));

import React from 'react';

// naming convention retained from previous JQuery implementation
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
    console.log("FILENAME: " + nameOfFile);
    if(!(sessionStorage.getItem("root") === null)){
        var filenames = JSON.parse(sessionStorage.getItem("root"));
        for(var i = 0; i < filenames.length; i++){
            console.log(filenames[i]);
            if(filenames[i] == nameOfFile){
                alert("A file with this name already exists. Please rename and upload.");
                return;
            }
        }
    }



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
                        //passFilenames();
                    cb.setToken(sessionStorage.getItem("sessionToken"));
                    //make_copy_button(document.getElementById("token_num"));
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
            progressTextHTML: '<h5>Checking integrity...</h5><i class="fa fa-refresh fa-spin fa-3x"></i>'
        });

        var formData = new FormData();
        formData.append("objectKey", s3Key);
        formData.append("token", token);
        // TODO abineet, if you want more info from the client, you can grab it from the HTML and
        // formData.append() it.

        // notify server of file upload and updates UI to reflect status
        $.ajax({
            url: '/analyze/integrity-check',
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success:function(data) {    // really just prints on screen any response from server
                var s = data.toString();
                cb.updateProgress({
                    progressTextHTML: '<div class="alert alert-success">' + s + '</div>'
                });
            },
            error:function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                cb.updateProgress({
                    progressTextHTML: '<div class="alert alert-danger">' + jqXHR.responseJSON.message + '</div>'
                });
            }
        });
    }



    var afterEachFileRead = function(options) {
        var newFilename = options.name;
        if (sessionStorage.getItem("root") === null) {
            sessionStorage.setItem("root", JSON.stringify([newFilename]));
        }
        else{
            var curr = JSON.parse(sessionStorage.getItem("root"));
            curr.push(newFilename);
            sessionStorage.setItem("root", JSON.stringify(curr));
        }

        var moreParams = {
            ContentLength : options.size,
            ContentType : options.type
        };
        /*TODO: (Yolanda) The "sessionToken" key in sessionStorage is keeping the sessionToken.
         *When the page loads there should be some interface that asks the user if they previously have a token
          * or to generate a new one.
         */
        if(sessionStorage.getItem("sessionToken") === null) {
            // get token for s3 upload
            $.ajax({
                url: "/analyze/token",
                method: "GET",
                success: function (token) {
                    uploadFileToS3(options, token, moreParams);
                    sessionStorage.setItem('sessionToken', token);
                    updateSessionData(token);

                },
                error: function () {
                    console.log("Error in retrieving upload token.");
                }
            });
        }
        else{
            console.log("session Updating Backend");
            uploadFileToS3(options, sessionStorage.getItem('sessionToken'), moreParams);
            updateSessionData(sessionStorage.getItem('sessionToken'));
        }


    };

    // set up FC and read in files
    FileController.setOnFileRead(afterEachFileRead);
    FileController.setInputElement($fileInput);
    FileController.readFiles();

}





export function validateToken(token) {

    var formData = new FormData();
    formData.append("token", token);

    return fetch("/analyze/checkToken", {
        method: "POST",
        body: formData
    }).then(response => { return response.text() });
}


export function getTreeData(token) {

    var formData = new FormData();
    formData.append("token", token);

    return fetch("/analyze/getSessionData", {
        method: "POST",
        body: formData
    }).then( response => { return response.json() });
}

function buildDomTree() {

    console.log("buildDomTreeFunction");

    var data = [];

    function walk(nodes, data) {
        $.each(nodes, function (id, node) {
            //name
            if (node["name"]) {
//                        console.log(node["name"]);
                var obj = {
                    id: id,
                    text: node["name"]
//                            href: "./contact"
                };
                data.push(obj);
            }
            //children
            if (node["children"]) {
                if (node["children"].length > 0) {
                    obj.nodes = [];
                    walk(node["children"], obj.nodes);
                }
            }
        });
    }

    if(sessionStorage.getItem("sessionToken") !== null) {
        getTreeData(sessionStorage.getItem("sessionToken")).done(function (data) {
            sessionStorage.setItem("root", data);
        });
    }
    var tree = JSON.parse(sessionStorage.getItem("root"));
    walk(tree, data);
    console.log("data",data);
    return data;
}

//passFilenames();

function updateSessionData(token){

    var formData = new FormData();
    console.log(token);
    console.log(sessionStorage.getItem("root"));
    formData.append("token", token);

    formData.append("data", sessionStorage.getItem("root"));
    //formData.append("data", "TEST");

    $.ajax({
        url: '/analyze/updateSessionData',
        method: "POST",
        contentType: false,
        processData: false,
        data: formData,
        success:function(data) {    // really just prints on screen any response from server
            var s = data.toString();
            console.log(s);
        },
        error:function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

}


function passFilenames(){

    //file tree
    var options = {
        backColor: '#eeeeee',
//                onhoverColor: '#cbd2d6',
        highlightSelected: false,
        showBorder: false,
//                showIcon: true,
//                enableLinks: true,
        data: buildDomTree()
    };

    $('#treeview').treeview(options);

    function downloadFilesFromS3(fileName, callback){
        S3Uploader.download("user-input/" + sessionStorage.getItem("sessionToken") + "/" + fileName, callback);
    }
    function deleteFilesFromS3(fileName, callback){
        S3Uploader.deleteFile("user-input/" + sessionStorage.getItem("sessionToken") + "/" + fileName, callback);
    }

    document.getElementById("treeview").addEventListener("click",function(e) {
        // e.target is our targetted element.
        // try doing console.log(e.target.nodeName), it will result LI
        console.log('e.target',e.target);
        //eye view icon
        if(e.target && e.target.id == "myBtn") {
            // Get the modal
            var data;
            downloadFilesFromS3(e.target.name, function(fileData) {
                data = fileData;
                //TODO: YOLANDA data here is the data you need.
            });
            var modal = document.getElementById('myModal');
            modal.style.display = "block";

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        }

        //trash icon to delete file
        if(e.target && e.target.id == "myBtn2") {
            deleteFilesFromS3(e.target.name, function (status) {
               if(status) {
                   if (!(sessionStorage.getItem("root") === null)) {
                       var a = JSON.parse(sessionStorage.getItem("root"));
                       for (var i = 0; i < a.length; i++) {
                           if (a[i]["name"] == e.target.name) {
                               a.splice(i, 1);
                               console.log(JSON.stringify(a));
                               sessionStorage.setItem("root", JSON.stringify(a));
                               alert("File deletion successful");
                               updateSessionData(sessionStorage.getItem("sessionToken"));
                               passFilenames();
                               break;
                           }
                       }
                   }
               }
                else{
                    alert("File deletion failed.");
               }
            });
        }

        if(e.target && e.target.nodeName == "LI") {
            console.log(e.target.id + " was clicked");

            var formData = new FormData();
            formData.append("fileName", e.target.id);
            // notify server of file upload and updates UI to reflect status
            $.ajax({
                url: '/analyze/getProcessingStats',
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success:function(data) {    // really just prints on screen any response from server
                    var s = data.toString();
                    console.log(s);
                },
                error:function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                    $progressText.html('<div class="alert alert-danger">' + jqXHR.responseJSON.message + '</div>');
                }
            });
        }

    });



}


$(function() {

    var $progressBar = $('.progress-bar');
    var $fileInput = $('#fileInput');
    var $tokenInput = $('#inputToken');

    function updateProgressBar(progress) {
        $progressBar.html(progress + "% complete");
        $progressBar.css("width", progress+"%");
    }


/*
    //TODO: Yolanda, this code has to execute on click of the "GO" Button
    $('#retrieve-file').on("submit", function(e) {
        e.preventDefault();

        console.log("inputToken", $tokenInput);
        console.log("inputToken[0].value", $tokenInput[0].value);
//                console.log("Token Received: ", $inputToken[0].value);
        var tokenReceived = $tokenInput[0].value; //TODO: Yolanda I need the value from the text field as string here

        validateToken(tokenReceived).done(function(data){
            if(data == true) {
                console.log("TOKEN VALIDATED");
                sessionStorage.setItem("sessionToken", tokenReceived);
                location.reload();
            }
            else{
                console.log("TOKEN INVALID");
                $('#token-num-display').css("opacity", 1);
            }
        });
    });
*/


});

myfunction();

function myfunction() {
    create_table(update_table);
}

function create_table(callback) {
    d3.text("/css/data.csv", function(data) {
        var parsedCSV = d3.csv.parseRows(data);
        var table = d3.select("#csvFile")
            .append("div").attr("class", "container")
            .append("table").attr("class", "display nowrap table table-hover table-bordered table-striped")
                            .attr("id", "example")
                            .attr("cellspacing", "0")
                            .attr("width", "100%");

        console.log("parsedCSV[0]",parsedCSV[0]);
        var titles = d3.keys(parsedCSV[0]);
        var headers = table.append("thead")
                        .append('tr')
                        .selectAll('th')
                        .data(parsedCSV[0]).enter()
                        .append('th')
                        .text(function (d) {
                            return d;
                        });

        parsedCSV = parsedCSV.slice(1,parsedCSV.length);
        var rows = table.append("tbody")

            .selectAll("tr")
            .data(parsedCSV).enter()
            .append("tr")

            .selectAll("td")
            .data(function(d) {
                return d;
            }).enter()
            .append("td")
            .text(function(d) {
                return d;
            });

        console.log("create_table");

    });


    setTimeout(function() {
//                alert('first function finished');
        if(typeof callback == 'function')
            callback();
    }, 1000);
};

function update_table() {
    $('#example').DataTable( {
        "scrollX": true
    } );
    console.log("update_table");
//            setTimeout('alert("second function finished");', 200);
};


function selectElementContents(el)
{
    // Copy textarea, pre, div, etc.
    if (document.body.createTextRange) {
        // IE
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
        textRange.execCommand("Copy");
    }
    else if (window.getSelection && document.createRange) {
        // non-IE
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copy command was ' + msg);
        } catch(err) {
            console.log('Oops, unable to copy');
        }
    }
} // end function selectElementContents(el)

function make_copy_button(el)
{
    var copy_btn = document.createElement('input');
    copy_btn.type = "button";
    copy_btn.className = "btn btn-default btn-sm";
//            copy_btn.style = "background-color:grey";
    el.parentNode.insertBefore(copy_btn, el.nextSibling);
//            copy_btn = document.getElementById('#copyBtn');
    copy_btn.onclick = function() { selectElementContents(el); };

    if (document.queryCommandSupported("copy") || parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]) >= 42)
    {
        // Copy works with IE 4+, Chrome 42+, Firefox 41+, Opera 29+
        copy_btn.value = "Copy";
    }
    else
    {
        // Select only for Safari and older Chrome, Firefox and Opera
        copy_btn.value = "Select All (then press CTRL+C to Copy)";
    }
}

//      make_copy_button(document.getElementById("token_num"));
