import {createStore} from "redux";

const initialState = {
    userData: null,
    friendData: null,
    friendRequests: null,
    businessData: null,
    yelpData: null,
    feedData: null
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        // if assignment starts with state, then action passed doesn't have new data for that field and no update made
        // example: action.data ? action.data.businessData : state.businessData <- uses action to update, uses previous state for no update
        case 'REFRESH':
            return {
                userData: (
                    action.data ?
                        action.data
                        :
                        state.userData ?
                            state.userData
                            :
                            null
                ),
                friendData: (
                    action.data ?
                        action.data.friendData ?
                            action.data.friendData.acceptedFriends
                            :
                            null
                        :
                        state.friendData ?
                            state.friendData.acceptedFriends ?
                                state.friendData.acceptedFriends
                                :
                                null
                            :
                            null
                ),
                friendRequests: (
                    action.data ?
                        action.data.friendData ?
                            action.data.friendData.requests ?
                                action.data.friendData.requests
                                :
                                {}
                            :
                            state.friendData ?
                                state.friendData.requests ?
                                    state.friendData.requests
                                    :
                                    {}
                                :
                                {}
                        :
                        state.friendData ?
                            state.friendData.requests ?
                                state.friendData.requests
                                :
                                {}
                            :
                            {}
                ),
                businessData: ( action.data ? action.data.businessData : state.businessData ? state.businessData : null ),
                feedData: action.feed ? action.feed : state.feedData
            }
        case 'YELPDATA':
            return {
                yelpData: action.data ? action.data : null
            }
    }
    return state;
}

export const store = createStore(reducer);
