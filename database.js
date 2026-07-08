const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const ENTRIES_FILE = path.join(__dirname, 'data', 'entries.json');

async function getUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) { return []; }
}

async function saveUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

async function getEntries() {
    try {
        const data = await fs.readFile(ENTRIES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) { return []; }
}

async function saveEntries(entries) {
    await fs.writeFile(ENTRIES_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

module.exports = { getUsers, saveUsers, getEntries, saveEntries };
