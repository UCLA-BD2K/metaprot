export const GOOGLE_ANALYTICS_REPORT = 'GOOGLE_ANALYTICS_REPORT';
export const RESET_TREE = 'RESET_TREE';
export const UPLOAD_FILE = 'UPLOAD_FILE';
export const DELETE_FILE = 'DELETE_FILE';
export const SET_TOKEN = 'SET_TOKEN';


export function storeGoogleAnalyticsReport(report) {
    const action = {
        type: GOOGLE_ANALYTICS_REPORT,
        report
    }

    return action;
}

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

export function removeFileFromTree(name) {
    const action = {
        type: DELETE_FILE,
        name
    }
    return action;
}
/*
export function removeFileFromTree(name) {

    return dispatch => {
        dispatch(_removeFileFromTree(name));
        deleteFileFromS3(name)
    }
}
*/
export function setToken(token) {
    const action = {
        type: SET_TOKEN,
        token
    }

    return action;
}