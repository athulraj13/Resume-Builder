🧾 Resume Builder
A simple, full-stack web application that allows users to create, edit, and manage professional resumes.
This app uses Node.js, Express, and MongoDB on the backend, with HTML-based forms for the frontend user interface.

🚀 Features
🧍 User Registration and Login (Authentication system)
📝 Resume creation form to input personal, educational, and professional details
💾 MongoDB integration for data persistence
🌐 RESTful API endpoints for communication between frontend and backend
🔒 CORS-enabled secure server setup
🖥️ Simple and responsive HTML interface

🛠️ Tech Stack
Frontend- HTML, CSS, JavaScript
Backend- Node.js, Express.js
Database- MongoDB

📂 Project Structure
resume-builder/
├── index.html          # Homepage – resume creation form
├── login.html          # Login page for existing users
├── register.html       # Registration page for new users
├── script.js           # Client-side logic (if any)
├── server.js           # Express server entry point
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Dependency versions lock file
└── README.md           # Project documentation

⚙️ Installation & Setup
1. Clone the repository
git clone [github.com](https://github.com/athulraj13/resume-builder.git)
cd resume-builder

2. Install dependencies
npm install

3. Set up MongoDB
Make sure you have MongoDB running locally or use a cloud database (like MongoDB Atlas).
Create a .env file (optional) to store your DB connection string:
MONGODB_URI=mongodb://localhost:27017/resume-builder
PORT=3000

5. Start the server
npm start
By default, the app will run at 
localhost.

🧩 Available Scripts
npm start- Starts the Node.js server (server.js)
npm test-	Placeholder test script

📦 Dependencies
express (^4.19.2) – Web framework for building server routes and APIs
mongodb (^6.8.0) – MongoDB driver for database connection

🔐 Pages Overview
index.html – Resume form to gather user information
login.html – User login page
register.html – New user registration page
Each page interacts via API endpoints served from the Express backend.

🤝 Contributing
Fork the repository
Create a new feature branch (git checkout -b feature-name)
Commit changes (git commit -m "Add new feature")
Push to your fork (git push origin feature-name)
Open a Pull Request

💡 Future Enhancements
Add PDF resume export functionality
Enable multiple resume templates
Implement drag-and-drop resume sections
Introduce user profile management

👤 Author
Athul Raj
GitHub: @athulraj13
Email: [athul052005@gmail.com]
