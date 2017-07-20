export const UPLOAD_FILE = 'UPLOAD_FILE';
export const SET_TOKEN = 'SET_TOKEN';

export function addFileToTree(name) {
    const action = {
        type: UPLOAD_FILE,
        name
    }
    return action;
}

export function setToken(token) {
    const action = {
        type: SET_TOKEN,
        token
    }

    return action;
}