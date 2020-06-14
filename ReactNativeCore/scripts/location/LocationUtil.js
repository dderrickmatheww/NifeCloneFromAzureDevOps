export async function SaveLocation (db, email, location, callback) {
    let setLoc = db.collection('users').doc(email);
    console.log('Set Login Location Func: ' + JSON.stringify(location));
    setLoc.set({loginLocation: location}, {merge: true});
    callback();
    
    
}