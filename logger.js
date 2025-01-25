module.exports = {
    log: (string) => {
        var message = `[${new Date().toLocaleString('en-CZ', { timeZone: 'Europe/Prague', hour12: false })}] LOG: ${string}`;
        console.log(message);
        return;
    },
    error: (error) => {
        var message = `[${new Date().toLocaleString('en-CZ', { timeZone: 'Europe/Prague', hour12: false })}] ERROR: ${error}`;
        console.error(message);
        return;
    },
    api: (string) => {
        var message = `[${new Date().toLocaleString('en-CZ', { timeZone: 'Europe/Prague', hour12: false })}] API: ${string}`;
        console.log(message);
        return;
    }
}