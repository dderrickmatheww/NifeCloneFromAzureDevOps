import React from 'react';
const FBPostData = (dataObj, token, returnData) => {
    console.log(dataObj)
    try {
        // Get the user's name using Facebook's Graph API
        fetch('https://graph.facebook.com/v7.0/' + dataObj.page.id + '/posts?&access_token='+ token)
        .then(response => response.json())
        .then(async data => {
            dataObj['PostData'] = data;
            returnData(dataObj);
        })
        .catch(e => console.log(e));
    } catch ({ message }) {
        alert(`Facebook Query Error: ${message}`);
    }
} 

export default FBPostData;