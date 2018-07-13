import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';
var storage = new Storage({
    // maximum capacity, default 1000  
    size: 1000,
 
    // Use AsyncStorage for RN, or window.localStorage for web. 
    // If not set, data would be lost after reload. 
    storageBackend: AsyncStorage,
    
    // expire time, default 1 day(1000 * 3600 * 24 milliseconds). 
    // can be null, which means never expire. 
    defaultExpires: 1000 * 3600 * 24,
    
    // cache data in the memory. default is true. 
    enableCache: true,
    
    // if data was not found in storage or expired, 
    // the corresponding sync method will be invoked and return  
    // the latest data. 
    sync : {
        // we'll talk about the details later. 
    }
})	


export const saveStorage = (key, data, callback) => {
    return (dispatch, getState) => {
        storage.save({
            key: key,   // Note: Do not use underscore("_") in key! 
            data: data,            
            // if not specified, the defaultExpires will be applied instead. 
            // if set to null, then it will never expire. 
            expires: null
        }); 
        callback('success')
    }
}

export const loadStorage = (key, callback) => {
    return (dispatch, getState) => {
        storage.load({
            key: key,
        }).then(ret => {
            callback(ret)
        }).catch(err => {
            callback('error')    
        });
    }
}

export const formatKeyStorage = (key) => {
    return (dispatch, getState) => {
        storage.remove({
            key: key
        });
    }
}