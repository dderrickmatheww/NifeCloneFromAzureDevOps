export async function SaveLocation (db, email, location, callback) {
    let setLoc = db.collection('users').doc(email);
    console.log('Set Login Location Func: ' + location)
    setLoc.set({loginLocation: location}, {merge: true});
    callback();
    
    
}