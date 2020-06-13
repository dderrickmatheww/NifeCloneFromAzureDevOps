export async function SaveLocation (db, email, location, callback) {
    let setLoc = db.collection('users').doc(email);
    setLoc.set({loginLocation: location.coords}, {merge: true});
    callback();
}