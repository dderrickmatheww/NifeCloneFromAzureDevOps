

export async function GetFriends (db, email, callback) {
    console.log('poop1');
    let docRef = db.collection('friends').doc(email).get()
      .then( (data) => {
        callback(data.data());
      });
}
export async function AddFriend (database, userEmail, friendEmail, callBack) {
    console.log('poop')
} 