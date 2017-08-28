import { combineReducers } from 'redux';
import { GOOGLE_ANALYTICS_REPORT, RESET_TREE, UPLOAD_FILE, DELETE_FILE, SET_TOKEN } from '../actions';

/* Reducers to help maintain the state of the Redux store */



/* Store Google Analytics Report data in store to prevent multiple requests and persist through page reloads */
function googleAnalyticsReport(state=defaultReport, action) {
    switch(action.type) {
        case GOOGLE_ANALYTICS_REPORT:
            return action.report;
        default:
            return state;
    }
}

/* default Google Analytics Report */
const defaultReport = {
    sessions: 0,
    pageviewsPerSession: 0,
    uniqueVisitors: 0,
    numCountries: 0,
    mapData: [[]],
    dailySessionData: [[]],
    monthlySessionData: [[]],
    toolUsage: [[]],
}

/* Store filenames associated with a session token. Filenames do NOT persist through page reloads */
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

/* Store user's session token and persist through page reloads */
function token (state="", action) {
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