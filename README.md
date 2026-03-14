# 🧾 Resume Builder

A simple **full-stack web application** that allows users to create, edit, and manage professional resumes.  
This project uses **Node.js, Express.js, and MongoDB** for the backend and **HTML, CSS, JavaScript** for the frontend.

---

## 🚀 Features

- 🧍 **User Registration and Login** (Authentication system)
- 📝 **Resume Creation Form** to input personal, educational, and professional details
- 💾 **MongoDB Integration** for storing user data
- 🌐 **RESTful API Endpoints** for frontend–backend communication
- 🔒 **CORS-enabled Secure Server**
- 🖥️ **Simple and Responsive HTML Interface**

---

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB

---

## 📂 Project Structure

```
resume-builder/
│
├── index.html          # Homepage – Resume creation form
├── login.html          # Login page for existing users
├── register.html       # Registration page for new users
├── script.js           # Client-side JavaScript
├── server.js           # Express server entry point
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Dependency versions lock file
└── README.md           # Project documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/athulraj13/resume-builder.git
cd resume-builder
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up MongoDB

Make sure **MongoDB** is running locally or use **MongoDB Atlas**.

Create a `.env` file in the project root:

```
MONGODB_URI=mongodb://localhost:27017/resume-builder
PORT=3000
```

### 4️⃣ Start the server

```bash
npm start
```

The application will run at:

```
http://localhost:3000
```

---

## 🧩 Available Scripts

| Script | Description |
|------|-------------|
| `npm start` | Starts the Node.js server (`server.js`) |
| `npm test` | Placeholder test script |

---

## 📦 Dependencies

- **express (^4.19.2)** – Web framework for building APIs and server routes  
- **mongodb (^6.8.0)** – MongoDB driver for database connection  

---

## 🔐 Pages Overview

- **index.html** – Resume form to collect user information  
- **login.html** – User login page  
- **register.html** – New user registration page  

Each page communicates with the **Express backend API**.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your fork

```bash
git push origin feature-name
```

5. Open a **Pull Request**

---

## 💡 Future Enhancements

- 📄 Add **PDF resume export**
- 🎨 Multiple **resume templates**
- 🧩 Drag-and-drop resume sections
- 👤 User profile management

---

## 👤 Author

**Athul Raj**

GitHub: https://github.com/athulraj13  
Email: athul052005@gmail.com

---
