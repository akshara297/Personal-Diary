const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getUsers, saveUsers, getEntries, saveEntries } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'super-secret-key-change-this-in-production';

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: "success", message: "Diary Server is up and running!" });
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: "Username and password required" });
        const users = await getUsers();
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            return res.status(400).json({ error: "Username already taken" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: uuidv4(), username, password: hashedPassword };
        users.push(newUser);
        await saveUsers(users);
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) { res.status(500).json({ error: "Server error" }); }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await getUsers();
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) { res.status(500).json({ error: "Server error" }); }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access denied" });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = decoded;
        next();
    });
}

app.post('/api/entries', authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const entries = await getEntries();
        const newEntry = { id: uuidv4(), userId: req.user.userId, title, content, createdAt: new Date().toISOString() };
        entries.push(newEntry);
        await saveEntries(entries);
        res.status(201).json(newEntry);
    } catch (error) { res.status(500).json({ error: "Server error" }); }
});

app.get('/api/entries', authenticateToken, async (req, res) => {
    const entries = await getEntries();
    res.json(entries.filter(e => e.userId === req.user.userId));
});

app.put('/api/entries/:id', authenticateToken, async (req, res) => {
    const entries = await getEntries();
    const idx = entries.findIndex(e => e.id === req.params.id && e.userId === req.user.userId);
    if (idx === -1) return res.status(404).json({ error: "Unauthorized or not found" });
    if (req.body.title) entries[idx].title = req.body.title;
    if (req.body.content) entries[idx].content = req.body.content;
    await saveEntries(entries);
    res.json(entries[idx]);
});

app.delete('/api/entries/:id', authenticateToken, async (req, res) => {
    let entries = await getEntries();
    if (!entries.some(e => e.id === req.params.id && e.userId === req.user.userId)) return res.status(404).json({ error: "Not found" });
    entries = entries.filter(e => e.id !== req.params.id);
    await saveEntries(entries);
    res.json({ message: "Deleted" });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
