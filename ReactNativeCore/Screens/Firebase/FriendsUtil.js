

export async function GetFriends (db, email, callback) {
    console.log('poop1');
    let docRef = db.collection('friends').doc(email).get()
      .then( (data) => {
        var friends = data.data();
        let friendsArr = [];
        for(var key in friends){
          if(friends.hasOwnProperty(key)){
            friendsArr.push(key);
          }
        }
        callback(friendsArr);
      });
}
export async function AddFriend (database, userEmail, friendEmail, callBack) {
    console.log('poop')
} 