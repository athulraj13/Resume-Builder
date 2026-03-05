const express = require('express');
const path = require('path');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'resume_builder';

async function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  // Serve frontend static files on the same origin (port 3000)
  app.use(express.static(path.join(__dirname)));
  // Root route convenience
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const resumes = db.collection('resumes');
  const users = db.collection('users');

  // Ensure unique index on users.email
  try {
    await users.createIndex({ email: 1 }, { unique: true });
  } catch (e) {
    console.warn('Index creation warning (users.email):', e.message);
  }

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', db: DB_NAME });
  });

  // Register a new user
  app.post('/api/users/register', async (req, res) => {
    try {
      const { fullname, email, password } = req.body || {};
      if (!fullname || !email || !password) {
        return res.status(400).json({ error: 'Missing fullname, email, or password.' });
      }

      // Basic email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }

      // Hash password using crypto (demo purposes)
      const crypto = require('crypto');
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

      const now = new Date();
      const doc = { fullname, email, passwordHash, createdAt: now };

      // Prevent duplicates
      const existing = await users.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: 'Email already registered.' });
      }

      const result = await users.insertOne(doc);
      return res.status(201).json({ id: result.insertedId, email, fullname });
    } catch (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: 'Failed to register.' });
    }
  });

  // Login user
  app.post('/api/users/login', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password.' });
      }

      const user = await users.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const crypto = require('crypto');
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      if (passwordHash !== user.passwordHash) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      return res.json({ id: user._id, email: user.email, fullname: user.fullname });
    } catch (err) {
      console.error('Error logging in:', err);
      return res.status(500).json({ error: 'Failed to login.' });
    }
  });

  // List recent users (for verification/debug)
  app.get('/api/users', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
      const docs = await users
        .find({}, { projection: { passwordHash: 0 } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      res.json(docs);
    } catch (err) {
      console.error('Error listing users:', err);
      res.status(500).json({ error: 'Failed to list users.' });
    }
  });

  // Create a resume document
  app.post('/api/resumes', async (req, res) => {
    try {
      const payload = req.body || {};

      // Minimal validation
      if (!payload.name && !payload.email && !payload.phone) {
        return res.status(400).json({ error: 'Missing basic fields (name/email/phone).' });
      }

      const doc = {
        ...payload,
        createdAt: new Date(),
      };

      const result = await resumes.insertOne(doc);
      res.status(201).json({ id: result.insertedId });
    } catch (err) {
      console.error('Error inserting resume:', err);
      res.status(500).json({ error: 'Failed to save resume.' });
    }
  });

  // Retrieve a resume by id (optional convenience)
  app.get('/api/resumes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await resumes.findOne({ _id: new ObjectId(id) });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json(doc);
    } catch (err) {
      res.status(400).json({ error: 'Invalid id' });
    }
  });

  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
    console.log(`Connected to MongoDB at ${MONGO_URI}, database: ${DB_NAME}`);
  });

  // Debug: list databases on the server
  app.get('/api/debug/databases', async (req, res) => {
    try {
      const admin = db.admin();
      const result = await admin.listDatabases();
      res.json(result);
    } catch (err) {
      console.error('Error listing databases:', err);
      res.status(500).json({ error: 'Failed to list databases' });
    }
  });

  // Debug: list collections in resume_builder
  app.get('/api/debug/collections', async (req, res) => {
    try {
      const cols = await db.listCollections().toArray();
      res.json(cols.map(c => ({ name: c.name })));
    } catch (err) {
      console.error('Error listing collections:', err);
      res.status(500).json({ error: 'Failed to list collections' });
    }
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});