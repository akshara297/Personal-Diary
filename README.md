# 📝 Secure Personal Diary Application

A lightweight, professional full-stack diary and journaling web application. This project features a clean **JSON file-based database architecture** on the backend using Node.js and Express, paired with a sleek, responsive **Single-Page Application (SPA)** user interface on the frontend.

---

## ✨ Features

- **🔒 Cryptographic User Authentication:** User passwords are securely hashed using `bcryptjs` (10 salt rounds) before being saved to the JSON storage. User sessions use stateless **JSON Web Tokens (JWT)** for secure tracking.
- **📂 Native JSON File Database:** Operates using Node's asynchronous file system promises (`fs.promises`). It maps and treats plain JSON arrays as separate database tables (`users.json` and `entries.json`).
- **🛡️ Rigid Data Isolation & Security:** A custom `authenticateToken` middleware acts as a route guard. Users are securely isolated via their JWT payload, ensuring that individuals can only access, edit, or delete their *own* personal diaries.
- **⚡ Reactive Single-Page UI:** Built entirely using modern browser standards (HTML5 / CSS Grid / Vanilla JavaScript ES6+). It updates contexts dynamically without full page reloads, using the browser's native `fetch` API.

---

## 🧱 Repository Structure

```text
personal-diary-app/
├── data/
│   ├── entries.json       # Holds user journal entry arrays
│   └── users.json         # Holds credentials and password hashes
├── database.js            # Storage abstraction layer / File system ORM
├── index.html             # Single-Page Frontend Interface (Client Layer)
├── package.json           # Application dependencies map
└── server.js              # Express routing core and main engine file
