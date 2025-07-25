const fs = require('fs-extra');


async function readJson(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function writeJson(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function checkDataFile(filePath){
    if (!fs.existsSync(filePath)) {
        fs.ensureFileSync(filePath);
        console.log(`File: ${filePath} created.`);
    }
    console.log(`File: ${filePath} exists.`);
}

module.exports = { readJson, writeJson, checkDataFile };