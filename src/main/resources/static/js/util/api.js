import React from 'react';
import { Link } from 'react-router-dom';

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

/**
 * Given a String msg with "<Link to='path'>text<\Link>" format,
 * return HTML element using JSX syntax
 */
function convertMessageWithLink(msg) {

    var regExp = /<Link to=[\'|\"](.*)[\'|\"]\s*>(.*)<.*>/
    var match = regExp.exec(msg);
    if (match === null || match.length != 3)
        return null;
    var path = match[1];
    var text = match[2];

    var linkComponent = ( <Link to={path}>{text}</Link> );
    // grab msg parts before and after the Link
    var msgParts = msg.split(match[0]);

    return ( <p>{msgParts[0]} {linkComponent} {msgParts[1]} </p>);

}

const api = {
    getToken,
    validateToken,
    getSessionData,
    downloadFileFromS3,
    deleteFileFromS3
}

export default api
