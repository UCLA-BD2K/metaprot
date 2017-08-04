import { combineReducers } from 'redux';
import { GOOGLE_ANALYTICS_REPORT, RESET_TREE, UPLOAD_FILE, DELETE_FILE, SET_TOKEN } from '../actions';

function googleAnalyticsReport(state=null, action) {
    console.log(action.type, action.report);
    switch(action.type) {
        case GOOGLE_ANALYTICS_REPORT:
            return action.report;
        default:
            return state;
    }
}

function filenames (state=[], action) {
    switch (action.type) {
        case RESET_TREE:
            return [];
        case UPLOAD_FILE:
            var filenames = [...state, action.name];
            return filenames;
        case DELETE_FILE:
            var filenames = state.filter(filename => filename != action.name);
            return filenames
        default:
            return state;
    }
}

function token (state="", action) {
    console.log(action.token)
    switch (action.type) {
        case SET_TOKEN:
            return action.token;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    googleAnalyticsReport,
    filenames,
    token
})

export default rootReducer