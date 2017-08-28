import React from 'react';
import { S3Uploader } from '../aws/S3Uploader';

/**
 * GET request to REST server to receive a randomized session token
 */
 function getToken() {
    return fetch("/util/token", {
            method: "GET",
            timeout: 10
        })
        .then( response => {
            if (response.ok)
                return response.text()
            else
                throw new Error("There was an issue retrieving a session token. Please try again later.");
        });
}

/**
 * POST request to REST server to check if token is valid.
 * Returns a boolean true if token is valid, and throws an Error
 * if there was a server response error or if token was not valid.
 */
function validateToken(token) {

    var formData = new FormData();
    formData.append("token", token);

    return fetch("/util/checkToken", {
            method: "POST",
            body: formData,
            timeout: 10
        })
        .then(response => {
            if (response.ok)
                return response.text();
            else
                throw new Error("There was an issue validating your session token. Please try again later.");
        })
        // response returns a String "true" if token is valid
        .then(isValid => {
            if (isValid === "true")
                return true;
            else
                throw new Error("Token is invalid. Please try again.");
        });

}

/**
 * POST request to REST server to retrieve filenames
 * associated with a particular session token in order
 * to populate the file Tree.
 * Returns an array of filename Strings.
 */
function getSessionData(token) {

    var formData = new FormData();
    formData.append("token", token);

    return fetch("/util/getSessionData", {
            method: "POST",
            body: formData,
            timeout: 10
        })
        .then( response => {
            if (response.ok)
                return response.json()
            else
                throw new Error("There was an issue retrieving session information. Please try again later.");
        });
    }


function downloadFileFromS3(fileName){
    var storeData = sessionStorage.getItem("store");
    var store = storeData ? JSON.parse(storeData) : {token: ""};
    var path = "user-input/" + store.token + "/" + fileName;

    return S3Uploader.download(path);
}

function deleteFileFromS3(fileName){
    var storeData = sessionStorage.getItem("store");
    var store = storeData ? JSON.parse(storeData) : {token: ""};
    var path = "user-input/" + store.token + "/" + fileName;
    return S3Uploader.deleteFile(path);
}


const api = {
    getToken,
    validateToken,
    getSessionData,
    downloadFileFromS3,
    deleteFileFromS3
}

export default api
