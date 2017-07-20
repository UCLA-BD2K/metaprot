import { combineReducers } from 'redux';
import { UPLOAD_FILE, SET_TOKEN } from '../actions';

function filenames (state=[], action) {
    switch (action.type) {
        case UPLOAD_FILE:
            var filenames = [...state, action.name];
            return filenames;
        break;
        default:
            return state;
    }
}

function token (state="", action) {
    switch (action.type) {
        case SET_TOKEN:
            return action.token;
        break;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    filenames,
    token
})

export default rootReducer