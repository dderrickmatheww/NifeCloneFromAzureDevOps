import { createStore } from "redux";

const initialState = {
    userData: null, 
    friendData: null, 
    friendRequests: null, 
    businessData: null, 
    yelpData: null, 
    feedData: [],
    whatsPoppinData: []
}

const reducer = (state = initialState, action) => {
    console.log('reducer - ' + JSON.stringify(action))
    switch (action.type) {
        // if assignment starts with state, then action passed doesn't have new data for that field and no update made
        // example: action.data ? action.data.businessData : state.businessData <- uses action to update, uses previous state for no update
        case 'REFRESH':
            return {
                userData: (action.data.userData ? action.data.userData : state.userData),
                yelpData: (action.data.yelpData ? action.data.yelpData : state.yelpData),
                feedData: (action.data.feedData ? action.data.feedData : state.feedData),
                whatsPoppinData: (action.data.whatsPoppinData ? action.data.whatsPoppinData : state.whatsPoppinData)
            }
    }
    return state;
}

export const store = createStore(reducer);
