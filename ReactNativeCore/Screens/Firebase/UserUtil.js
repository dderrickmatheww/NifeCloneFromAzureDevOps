

export async function GetRemoteUserData (db, email, callback) {
    db.collection('users').doc(email).get()
      .then( (data) => {
        if(data.data()){
            console.log('User Exists...');
            let setDoc = db.collection('users').doc(email).set({lastLoginAt: new Date()}, {merge:true})
            callback(data.data());
        }
    });
}

export async function VerifyUser (db, user, email, callback) {
    console.log('Checking For User...');

    let docRef = db.collection('users').doc(email).get()
      .then( (data) => {
        if(data.data()){
            console.log('User Exists...');
            callback(data.data());
        } else {
            console.log('User Does not Exists...');
            // console.log(Object.keys(user));
            if(user != undefined || user != null){
                let buildUser = {
                    createdAt: new Date(),
                    displayName: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    lastLoginAt: new Date(),
                    phoneNumber: (user.phoneNumber == undefined || user.phoneNumber == null ? "555-555-5555" : user.phoneNumber),
                    photoSouce: user.photoURL,
                    providerData: user.providerData[0]
                }
                // console.log(buildUser)
                let setDoc = db.collection('users').doc(email).set(buildUser)
                .then( (data) => {
                    callback(buildUser);
                    console.log('User fucking saved m8');
                });
            } else {
                console.log('user undefined..');
            }
        }
        
      });
}