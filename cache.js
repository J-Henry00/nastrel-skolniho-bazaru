const mcache = require('memory-cache');

var t = 5 * 60 * 1000; // 5 minutes

function saveKey(key, data) { // all cache is stored for 5 minutes
    try {
        mcache.put(key, data, t);
        return true;
    } catch (err) {
        console.error('Error saving to cache:', err);
        return false;
    }
}

function getKey(key) {
    try {
        const data = mcache.get(key);
        return data;
    } catch (err) {
        console.error('Error getting from cache:', err);
        return null;
    }
}

function keyExists(key) {
    try {
        return mcache.get(key) !== null;
    } catch (err) {
        console.error('Error checking cache key:', err);
        return false;
    }
}


module.exports = {
    saveKey,
    getKey,
    keyExists
};