export const RESET_TREE = 'RESET_TREE';
export const UPLOAD_FILE = 'UPLOAD_FILE';
export const DELETE_FILE = 'DELETE_FILE';
export const SET_TOKEN = 'SET_TOKEN';

import { updateSessionData, deleteFilesFromS3 } from '../util/upload';

export function resetTree() {
    const action = {
        type: RESET_TREE
    }

    return action;
}

export function addFileToTree(name) {
    const action = {
        type: UPLOAD_FILE,
        name
    }
    return action;
}

function removeFileFromTree(name) {
    const action = {
        type: DELETE_FILE,
        name
    }
    return action;
}

export function removeFileFromTreeAndUpdateSession(name) {

    return dispatch => {
        dispatch(removeFileFromTree(name));
        deleteFilesFromS3(name)
            .then(updateSessionData)
            .catch( err => {
                console.log("ERROR",err)
            });
    }
}

export function setToken(token) {
    const action = {
        type: SET_TOKEN,
        token
    }

    return action;
}