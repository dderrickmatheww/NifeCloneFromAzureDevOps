import * as firebase from 'firebase';

export async function GetFriends (db, email, callback) {
    console.log('poop1');
    let friendsArr = [];
    var path = new firebase.firestore.FieldPath('friends', 'mattdpalumbo@gmail.com')
    let docRef = db.collection('users').where(path, '==', true).get()
      .then( (friends) => {
        friends.forEach(function(friend){
          if(friend.data().displayName){
            friendsArr.push(friend.data());
          }
        });
        callback(friendsArr);
      });
}
export async function AddFriend (database, userEmail, friendEmail, callBack) {
    console.log('poop')
} 

// export async function SeedAddFriend (db,  callBack) {
//   console.log('poop')
//   friends = {};
//   friends['friends'] = {};
//   for(i=1;i<101; i++){
    
//     friends['friends'][''+i+'@'+i+'.com'] = true;
//   }
//   let setDoc = db.collection('users').doc('mattdpalumbo@gmail.com').set(friends, {merge:true})
//   .then((data) => {
//     console.log(data);
//   });
  
// } 