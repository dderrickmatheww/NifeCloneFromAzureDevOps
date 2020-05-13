import React from 'react';
import Config from '../Universal Components/ConfigFunctions';


export default SetUserLocationData = async (region) => {
    var latAndLong = region.latitude + ',' + region.longitude;
    Config.SetAsyncStorageVar('userLocationData', latAndLong);
}
