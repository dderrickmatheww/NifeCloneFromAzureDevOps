import {GetFriends, AddFriend} from "./friends/FriendsUtil"
import {VerifyUser, GetUserData} from "./user/UserUtil"
import {SaveLocation} from "./location/LocationUtil"
import Config from "./asyncStorage/ConfigFunctions"

const Util = {
     friends : {
        GetFriends: function(db, email, callback){
            GetFriends(db, email, callback)
        },
    
        AddFriend: function(db, email, callback){
            AddFriend(db, email, callback)
        }
    
    },
    
     user : {
        VerifyUser: function(db, user, email, callback){
            VerifyUser(db, user, email, callback);
        },
        GetUserData: function(db, email, callback){
            GetUserData(db, email, callback)
        }
    
    },
    
     location: {
        SaveLocation: function(db, email, callback){
            SaveLocation(db, email, callback);
        }
    
    },
    
     asyncStorage:{
        SetAsyncStorageVar: async (name, value) => {
            Config.SetAsyncStorageVar(name, value);
        }
    }
}


export default Util;