import { combineReducers } from 'redux';
import { RESET_TREE, UPLOAD_FILE, DELETE_FILE, SET_TOKEN } from '../actions';

function filenames (state=[], action) {
    switch (action.type) {
        case RESET_TREE:
            return [];
        case UPLOAD_FILE:
            var filenames = [...state, action.name];
            return filenames;
        break;
        case DELETE_FILE:
            var filenames = state.filter(filename => filename != action.name);
            return filenames
        break;
        default:
            return state;
    }
}

function token (state="", action) {
    switch (action.type) {
        case SET_TOKEN:
            console.log("SET_TOKEN")
            //sessionStorage.setItem("sessionToken", action.token);
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