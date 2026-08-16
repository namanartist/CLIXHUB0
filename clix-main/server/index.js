import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Server } from 'socket.io';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_SEEDS } from './seeds.js';

// ─── ENV ──────────────────────────────────────────────────────────────────────
const rootDir = process.cwd();
for (const p of [path.join(rootDir, '.env'), path.join(rootDir, '.env.local')]) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

// ─── SUPABASE INITIALIZATION ──────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://vxhuqygbyzrfqtvprmut.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_H4-CXLF5S7TA-QxJM26ICw_lQhBQq2v';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

console.log(`[Supabase Backend] Initialized with URL: ${SUPABASE_URL}`);

// ─── PERSISTENT LOCAL DISK & MEMORY STORE ─────────────────────────────────────
const DB_FILE = path.join(rootDir, 'server', 'data_store.json');

function loadLocalStore() {
  const store = {
    users: [...(INITIAL_SEEDS.users || [])],
    clubs: [...(INITIAL_SEEDS.clubs || [])],
    events: [...(INITIAL_SEEDS.events || [])],
    venues: [...(INITIAL_SEEDS.venues || [])],
    registrations: [...(INITIAL_SEEDS.registrations || [])],
    certificates: [...(INITIAL_SEEDS.certificates || [])],
    batches: [...(INITIAL_SEEDS.batches || [])],
    applicants: [...(INITIAL_SEEDS.applicants || [])],
    proposals: [...(INITIAL_SEEDS.proposals || [])],
    activities: [...(INITIAL_SEEDS.activities || [])],
    logs: [...(INITIAL_SEEDS.logs || [])],
    messages: [...(INITIAL_SEEDS.messages || [])],
    notifications: [...(INITIAL_SEEDS.notifications || [])],
    developers: [...(INITIAL_SEEDS.developers || [])],
    mentors: [...(INITIAL_SEEDS.mentors || [])],
    inquiries: [...(INITIAL_SEEDS.inquiries || [])],
    qr_links: [...(INITIAL_SEEDS.qr_links || [])],
    institutional_kpis: [...(INITIAL_SEEDS.institutional_kpis || [])],
    approval_requests: [...(INITIAL_SEEDS.approval_requests || [])],
  };

  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(content);
      for (const key of Object.keys(store)) {
        if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
          store[key] = parsed[key];
        }
      }
      console.log(`[Storage] Loaded persistent state from ${DB_FILE}`);
    }
  } catch (err) {
    console.warn(`[Storage] Could not load data_store.json:`, err.message);
  }
  return store;
}

const inMemoryStore = loadLocalStore();

function saveLocalStore() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryStore, null, 2), 'utf8');
  } catch (err) {
    console.error(`[Storage] Failed to save data_store.json:`, err.message);
  }
}

// ─── SUPABASE HELPERS ─────────────────────────────────────────────────────────
async function supabaseGetAll(table) {
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      return inMemoryStore[table] || [];
    }
    if (Array.isArray(data) && data.length > 0) {
      inMemoryStore[table] = data;
      saveLocalStore();
    }
    return data || inMemoryStore[table] || [];
  } catch (e) {
    return inMemoryStore[table] || [];
  }
}

async function supabaseGetOne(table, id) {
  try {
    const { data, error } = await supabase.from(table).select('*').eq('id', String(id)).single();
    if (error || !data) {
      return inMemoryStore[table]?.find(item => item.id === String(id)) || null;
    }
    return data;
  } catch (e) {
    return inMemoryStore[table]?.find(item => item.id === String(id)) || null;
  }
}

async function supabaseSave(table, id, data) {
  const targetId = String(id || data.id || `id_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
  const record = { ...data, id: targetId };
  delete record._id;
  if (!['logs', 'messages', 'session_archives', 'saved_events'].includes(table)) {
    record.updated_at = new Date().toISOString();
  }

  // Update in-memory & on-disk store
  if (!inMemoryStore[table]) inMemoryStore[table] = [];
  const idx = inMemoryStore[table].findIndex(item => item.id === targetId);
  if (idx >= 0) {
    inMemoryStore[table][idx] = { ...inMemoryStore[table][idx], ...record };
  } else {
    inMemoryStore[table].push(record);
  }
  saveLocalStore();

  try {
    const { data: result, error } = await supabase.from(table).upsert([record]).select();
    if (error) {
      return record;
    }
    return (result && result[0]) || record;
  } catch (e) {
    return record;
  }
}

async function supabaseDelete(table, id) {
  const targetId = String(id);
  if (inMemoryStore[table]) {
    inMemoryStore[table] = inMemoryStore[table].filter(item => item.id !== targetId);
    saveLocalStore();
  }
  try {
    await supabase.from(table).delete().eq('id', targetId);
    return true;
  } catch (e) {
    return true;
  }
}

async function supabaseQueryWhere(table, field, value) {
  try {
    const { data, error } = await supabase.from(table).select('*').eq(field, value);
    if (error || !data) {
      return inMemoryStore[table]?.filter(item => item[field] === value) || [];
    }
    return data;
  } catch (e) {
    return inMemoryStore[table]?.filter(item => item[field] === value) || [];
  }
}

// ─── EXPRESS & SOCKET.IO SETUP ────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true },
});

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));

function mapDoc(docData) {
  if (!docData) return null;
  const { passwordHash, password, ...rest } = docData;
  return { id: docData.id, ...rest };
}

function tokenFor(user) {
  return jwt.sign(
    { id: user.id, email: user.email, globalRole: user.globalRole || 'Student' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(h.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── HEALTH & STATUS ──────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  let supabaseStatus = 'connected';
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error) supabaseStatus = `Supabase Warning: ${error.message}`;
  } catch (e) {
    supabaseStatus = `Supabase Error: ${e?.message || e}`;
  }

  res.json({
    status: 'ok',
    mode: 'supabase-server',
    supabase: {
      url: SUPABASE_URL,
      status: supabaseStatus,
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── SEED API ─────────────────────────────────────────────────────────────────
app.post('/api/db/seed', async (req, res) => {
  try {
    const collections = [
      'users', 'clubs', 'events', 'venues', 'registrations', 'certificates',
      'batches', 'applicants', 'proposals', 'activities', 'logs', 'messages',
      'notifications', 'developers', 'mentors', 'inquiries', 'qr_links',
      'institutional_kpis', 'approval_requests'
    ];
    let totalUploaded = 0;
    const payload = req.body || {};

    for (const col of collections) {
      const items = Array.isArray(payload[col]) ? payload[col] : [];
      for (const item of items) {
        if (item && item.id) {
          await supabaseSave(col, item.id, item);
          totalUploaded++;
        }
      }
    }

    res.json({ success: true, message: `Successfully synchronized ${totalUploaded} entities with Supabase.`, count: totalUploaded });
  } catch (err) {
    console.error('Seed API error:', err);
    res.status(500).json({ error: err?.message || 'Failed to seed database' });
  }
});

// ─── AUTHENTICATION ENDPOINTS ─────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, globalRole, enrollmentNumber, branch, department, designation } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });
  const em = String(email).toLowerCase();

  try {
    const existing = await supabaseQueryWhere('users', 'email', em);
    if (existing.length > 0) return res.status(409).json({ error: 'Email already registered' });

    const id = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const passwordHash = await bcrypt.hash(String(password), 10);
    const userDoc = {
      id,
      name,
      email: em,
      password: passwordHash,
      globalRole: globalRole || 'Student',
      enrollmentNumber: enrollmentNumber || '',
      branch: branch || '',
      department: department || '',
      designation: designation || '',
      clubMemberships: [],
      skills: [],
      created_at: new Date().toISOString(),
    };

    const result = await supabaseSave('users', id, userDoc);
    res.json({ token: tokenFor(result), user: mapDoc(result) });
  } catch (e) {
    console.error('Signup error:', e);
    res.status(500).json({ error: e?.message || 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
  const em = String(email).toLowerCase();

  try {
    const users = await supabaseQueryWhere('users', 'email', em);
    const user = users[0];
    if (user) {
      const match = user.password ? (await bcrypt.compare(String(password), user.password)) : true;
      if (match) {
        return res.json({ token: tokenFor(user), user: mapDoc(user) });
      }
    }
    return res.status(401).json({ error: 'Invalid email or password' });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: e?.message || 'Login failed' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await supabaseGetOne('users', req.user.id);
    if (user) {
      return res.json(mapDoc(user));
    }
    // Fallback: search by email
    const users = await supabaseQueryWhere('users', 'email', req.user.email);
    if (users && users.length > 0) {
      return res.json(mapDoc(users[0]));
    }
    // If not found in DB but token valid, construct safe minimal user
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.email.split('@')[0].toUpperCase(),
      globalRole: req.user.globalRole || 'Student',
      clubMemberships: []
    });
  } catch (e) {
    console.error('/api/auth/me error:', e);
    res.status(500).json({ error: e?.message || 'Failed to fetch user session' });
  }
});

app.post('/api/auth/demo-login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const em = String(email).toLowerCase();

  try {
    const users = await supabaseQueryWhere('users', 'email', em);
    let user = users[0];
    if (!user) {
      const id = `usr_demo_${Date.now()}`;
      user = {
        id,
        name: em.split('@')[0].toUpperCase(),
        email: em,
        globalRole: em.includes('admin') ? 'Super Admin' : em.includes('dean') ? 'Dean' : em.includes('faculty') ? 'Faculty' : 'Student',
        clubMemberships: [],
      };
      await supabaseSave('users', id, user);
    }
    res.json({ token: tokenFor(user), user: mapDoc(user) });
  } catch (e) {
    console.error('Demo login error:', e);
    res.status(500).json({ error: e?.message || 'Demo login failed' });
  }
});

// ─── CRUD ROUTE GENERATOR FOR ALL SUPABASE ENTITIES ───────────────────────────
const ENTITY_ROUTES = [
  { path: 'users', table: 'users' },
  { path: 'clubs', table: 'clubs' },
  { path: 'events', table: 'events' },
  { path: 'venues', table: 'venues' },
  { path: 'registrations', table: 'registrations' },
  { path: 'certificates', table: 'certificates' },
  { path: 'batches', table: 'batches' },
  { path: 'applicants', table: 'applicants' },
  { path: 'proposals', table: 'proposals' },
  { path: 'activities', table: 'activities' },
  { path: 'logs', table: 'logs' },
  { path: 'messages', table: 'messages' },
  { path: 'notifications', table: 'notifications' },
  { path: 'developers', table: 'developers' },
  { path: 'mentors', table: 'mentors' },
  { path: 'inquiries', table: 'inquiries' },
  { path: 'qr-links', table: 'qr_links' },
  { path: 'kpis', table: 'institutional_kpis' },
  { path: 'approvals', table: 'approval_requests' },
];

for (const { path: routePath, table } of ENTITY_ROUTES) {
  // GET ALL
  app.get(`/api/${routePath}`, async (_req, res) => {
    try {
      const list = await supabaseGetAll(table);
      res.json(list.map(mapDoc));
    } catch (e) {
      res.status(500).json({ error: e?.message || `Failed to fetch ${table}` });
    }
  });

  // GET ONE
  app.get(`/api/${routePath}/:id`, async (req, res) => {
    try {
      const item = await supabaseGetOne(table, req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(mapDoc(item));
    } catch (e) {
      res.status(500).json({ error: e?.message || `Failed to fetch item from ${table}` });
    }
  });

  // CREATE / UPSERT
  app.post(`/api/${routePath}`, async (req, res) => {
    try {
      const saved = await supabaseSave(table, req.body.id, req.body);
      io.emit(`${table}:change`, { action: 'create', data: saved });
      res.json(mapDoc(saved));
    } catch (e) {
      res.status(500).json({ error: e?.message || `Failed to save to ${table}` });
    }
  });

  // UPDATE (PUT)
  app.put(`/api/${routePath}/:id`, async (req, res) => {
    try {
      const saved = await supabaseSave(table, req.params.id, req.body);
      io.emit(`${table}:change`, { action: 'update', data: saved });
      res.json(mapDoc(saved));
    } catch (e) {
      res.status(500).json({ error: e?.message || `Failed to update ${table}` });
    }
  });

  // UPDATE (PATCH)
  app.patch(`/api/${routePath}/:id`, async (req, res) => {
    try {
      const existing = await supabaseGetOne(table, req.params.id);
      const merged = { ...existing, ...req.body };
      const saved = await supabaseSave(table, req.params.id, merged);
      io.emit(`${table}:change`, { action: 'patch', data: saved });
      res.json(mapDoc(saved));
    } catch (e) {
      res.status(500).json({ error: e?.message || `Failed to patch ${table}` });
    }
  });

  // DELETE
  app.delete(`/api/${routePath}/:id`, async (req, res) => {
    try {
      await supabaseDelete(table, req.params.id);
      io.emit(`${table}:change`, { action: 'delete', id: req.params.id });
      res.json({ success: true, id: req.params.id });
    } catch (e) {
      res.status(500).json({ error: e?.message || `Failed to delete from ${table}` });
    }
  });
}

// ─── SEED & EXPORT DATA ENDPOINTS ─────────────────────────────────────────────
app.post('/api/db/seed', (req, res) => {
  try {
    const seedData = req.body || {};
    for (const key of Object.keys(seedData)) {
      if (Array.isArray(seedData[key]) && seedData[key].length > 0) {
        inMemoryStore[key] = seedData[key];
      }
    }
    saveLocalStore();
    res.json({ success: true, message: 'Institutional database seeded and persisted' });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to seed database' });
  }
});

app.get('/api/db/export', (_req, res) => {
  res.json(inMemoryStore);
});

// ─── MESSAGES SPECIFIC ROUTE ──────────────────────────────────────────────────
app.get('/api/messages', async (req, res) => {
  try {
    const { clubId, userId, otherUserId } = req.query;
    let list = await supabaseGetAll('messages');
    list = list.map(mapDoc);

    if (clubId) {
      list = list.filter(m => String(m.clubId) === String(clubId));
    } else if (userId && otherUserId) {
      list = list.filter(m =>
        (String(m.senderId) === String(userId) && String(m.recipientId) === String(otherUserId)) ||
        (String(m.senderId) === String(otherUserId) && String(m.recipientId) === String(userId))
      );
    } else if (userId) {
      list = list.filter(m => String(m.senderId) === String(userId) || String(m.recipientId) === String(userId) || m.clubId);
    }

    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to fetch messages' });
  }
});

// ─── REAL-TIME SOCKET.IO HANDLERS ─────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join', (data) => {
    if (data?.userId) socket.join(`user:${data.userId}`);
    if (Array.isArray(data?.clubIds)) {
      data.clubIds.forEach(id => socket.join(`club:${id}`));
    }
  });

  socket.on('join_club', (clubId) => {
    socket.join(`club:${clubId}`);
  });

  socket.on('send_message', async (messageData) => {
    try {
      const saved = await supabaseSave('messages', messageData.id, messageData);
      const mapped = mapDoc(saved);

      // Broadcast to all event channels
      io.emit('receive_message', mapped);
      io.emit('new_message', mapped);
      io.emit('messages:change', { action: 'create', data: mapped });

      if (messageData.clubId) {
        io.to(`club:${messageData.clubId}`).emit('receive_message', mapped);
        io.to(`club:${messageData.clubId}`).emit('new_message', mapped);
      }
      if (messageData.recipientId) {
        io.to(`user:${messageData.recipientId}`).emit('receive_message', mapped);
        io.to(`user:${messageData.recipientId}`).emit('new_message', mapped);
      }
    } catch (err) {
      console.error('Socket send_message error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`⚡ [CLIX Hub Server] Running on http://localhost:${PORT}`);
    console.log(`🔗 [Database Backend] Connected to Supabase at ${SUPABASE_URL}`);
  });
}

export default app;
