const fs = require('fs');
const path = require('path');
const api = require('./api');

module.exports = async() => {
    function saveData(data) {
        const backupPath = path.join(__dirname, 'backups', 'data.json');
    
        fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
        return;
    }
    
    saveData(await api());
    return;
}