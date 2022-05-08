import { createStore } from "redux";

const initialState = {
    userData: null, 
    friendData: null, 
    friendRequests: null, 
    businessData: null, 
    yelpData: null, 
    feedData: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        // if assignment starts with state, then action passed doesn't have new data for that field and no update made
        // example: action.data ? action.data.businessData : state.businessData <- uses action to update, uses previous state for no update
        case 'USERDATA':
            return {
                userData: (action.data ? action.data : state.data)
            }
        case 'YELPDATA':
            return {
                yelpData: (action.data ? action.data : state.data)
            }
        case 'FEEDDATA':
            return {
                feedData: (action.data ? action.data : state.data)
            }
    }
    return state;
}

export const store = createStore(reducer);
