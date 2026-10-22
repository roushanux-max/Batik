import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Data directory & Database file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'database.json');

// Interface definitions
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  cart?: any[];
  wishlist?: string[];
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress?: any;
  status: string;
  createdAt: string;
}

export interface SubscriberRecord {
  id: string;
  email: string;
  preferences: string[];
  frequency: string;
  promoCode: string;
  subscribedAt: string;
}

export interface ReviewRecord {
  id: string;
  productId: string;
  author: string;
  city?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  createdAt: string;
}

export interface DatabaseState {
  users: UserRecord[];
  sessions: Record<string, string>; // token -> userId
  orders: OrderRecord[];
  subscribers: SubscriberRecord[];
  reviews: ReviewRecord[];
  workGroups: any[];
  customImages: Record<string, string>;
}

// Password hashing helper
function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return testHash === hash;
}

// Initial Database Seeding
function getInitialDatabase(): DatabaseState {
  const seedPass = hashPassword('password123', 'seededsalt123456');
  return {
    users: [
      {
        id: 'user_default_sujit',
        name: 'Sujit Jha',
        email: 'sujitjha.ids@indusuni.ac.in',
        passwordHash: seedPass.hash,
        salt: seedPass.salt,
        createdAt: new Date().toISOString(),
        cart: [],
        wishlist: ['prod-1', 'prod-4'],
      },
    ],
    sessions: {},
    orders: [
      {
        id: 'ord_sample_1',
        orderNumber: 'ORD-2026-84920',
        userId: 'user_default_sujit',
        customerName: 'Sujit Jha',
        customerEmail: 'sujitjha.ids@indusuni.ac.in',
        items: [
          {
            product: {
              id: 'prod-4',
              name: 'Revive Dupatta Volume IV',
              price: 3499,
              category: 'Clothes & Patterns',
              image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
            },
            quantity: 1,
            size: 'Free Size',
          },
        ],
        subtotal: 3499,
        shipping: 0,
        discount: 500,
        total: 2999,
        paymentMethod: 'UPI / NetBanking',
        shippingAddress: {
          name: 'Sujit Jha',
          address: 'Indus University Campus',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '382115',
        },
        status: 'In Transit',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    subscribers: [
      {
        id: 'sub_1',
        email: 'sujitjha.ids@indusuni.ac.in',
        preferences: ['drops', 'sales'],
        frequency: 'drops',
        promoCode: 'RUPAL500',
        subscribedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    reviews: [
      {
        id: 'rev_1',
        productId: 'prod-1',
        author: 'Ananya Verma',
        city: 'Jaipur, RJ',
        rating: 5,
        title: 'Authentic Alizarin Dyes and Flawless Edge Print',
        content: 'The vegetable dye aroma is completely pure and natural. The weight of the hand-spun mulmul is breathtakingly soft. Truly museum grade craftsmanship!',
        date: '2 days ago',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
    workGroups: [],
    customImages: {},
  };
}

// Database state in memory with persistence to disk
let db: DatabaseState = loadDatabase();

function loadDatabase(): DatabaseState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure all arrays exist
      return {
        users: parsed.users || [],
        sessions: parsed.sessions || {},
        orders: parsed.orders || [],
        subscribers: parsed.subscribers || [],
        reviews: parsed.reviews || [],
        workGroups: parsed.workGroups || [],
        customImages: parsed.customImages || {},
      };
    }
  } catch (err) {
    console.error('Error loading database, initializing fresh one:', err);
  }

  const initial = getInitialDatabase();
  saveDatabase(initial);
  return initial;
}

function saveDatabase(state: DatabaseState) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database to disk:', err);
  }
}

// Helper: extract authenticated user from Authorization header
function getAuthUser(req: Request): UserRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  const userId = db.sessions[token];
  if (!userId) {
    return null;
  }
  return db.users.find((u) => u.id === userId) || null;
}

async function startServer() {
  const app = express();

  // Middleware for body parsing
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Request logger for API calls
  app.use('/api', (req, _res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });

  // -------------------------------------------------------------
  // AUTHENTICATION ROUTES (Register, Login, Me, Logout)
  // -------------------------------------------------------------

  // 1. Register new user
  app.post('/api/auth/register', (req: Request, res: Response): void => {
    try {
      const { name, email, password } = req.body;

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ error: 'Please provide a valid email address.' });
        return;
      }
      if (!password || typeof password !== 'string' || password.length < 4) {
        res.status(400).json({ error: 'Password must be at least 4 characters.' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (existingUser) {
        res.status(409).json({
          error: 'An account with this email already exists. Please log in instead.',
        });
        return;
      }

      const { hash, salt } = hashPassword(password);
      const displayName = (name && typeof name === 'string' && name.trim()) ? name.trim() : normalizedEmail.split('@')[0];

      const newUser: UserRecord = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: displayName,
        email: normalizedEmail,
        passwordHash: hash,
        salt,
        createdAt: new Date().toISOString(),
        cart: [],
        wishlist: [],
      };

      db.users.push(newUser);

      // Create session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      db.sessions[sessionToken] = newUser.id;

      saveDatabase(db);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully!',
        token: sessionToken,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          cart: newUser.cart,
          wishlist: newUser.wishlist,
        },
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Server error during registration: ' + err.message });
    }
  });

  // 2. Login existing user
  app.post('/api/auth/login', (req: Request, res: Response): void => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        res.status(404).json({
          error: 'No account found with this email address. Please register a new account.',
        });
        return;
      }

      const isValid = verifyPassword(password, user.passwordHash, user.salt);
      if (!isValid) {
        res.status(401).json({
          error: 'Incorrect password. Please verify and try again.',
        });
        return;
      }

      // Generate fresh session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      db.sessions[sessionToken] = user.id;

      saveDatabase(db);

      res.json({
        success: true,
        message: 'Welcome back, ' + user.name + '!',
        token: sessionToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          cart: user.cart || [],
          wishlist: user.wishlist || [],
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error during login: ' + err.message });
    }
  });

  // 3. Get currently authenticated user profile
  app.get('/api/auth/me', (req: Request, res: Response): void => {
    const user = getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'Not authenticated or session expired.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cart: user.cart || [],
        wishlist: user.wishlist || [],
      },
    });
  });

  // 4. Logout
  app.post('/api/auth/logout', (req: Request, res: Response): void => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      delete db.sessions[token];
      saveDatabase(db);
    }
    res.json({ success: true, message: 'Successfully logged out.' });
  });

  // -------------------------------------------------------------
  // CART & WISHLIST PERSISTENCE ROUTES
  // -------------------------------------------------------------

  // Get Cart
  app.get('/api/cart', (req: Request, res: Response): void => {
    const user = getAuthUser(req);
    if (user) {
      res.json({ success: true, cart: user.cart || [] });
    } else {
      res.json({ success: true, cart: [] });
    }
  });

  // Save Cart
  app.post('/api/cart', (req: Request, res: Response): void => {
    const { items } = req.body;
    const user = getAuthUser(req);

    if (user) {
      user.cart = Array.isArray(items) ? items : [];
      saveDatabase(db);
      res.json({ success: true, count: user.cart.length });
    } else {
      res.json({ success: true, count: Array.isArray(items) ? items.length : 0 });
    }
  });

  // Get Wishlist
  app.get('/api/wishlist', (req: Request, res: Response): void => {
    const user = getAuthUser(req);
    if (user) {
      res.json({ success: true, wishlist: user.wishlist || [] });
    } else {
      res.json({ success: true, wishlist: [] });
    }
  });

  // Save Wishlist
  app.post('/api/wishlist', (req: Request, res: Response): void => {
    const { wishlist } = req.body;
    const user = getAuthUser(req);

    if (user) {
      user.wishlist = Array.isArray(wishlist) ? wishlist : [];
      saveDatabase(db);
      res.json({ success: true, count: user.wishlist.length });
    } else {
      res.json({ success: true, count: Array.isArray(wishlist) ? wishlist.length : 0 });
    }
  });

  // -------------------------------------------------------------
  // ORDERS PERSISTENCE ROUTES
  // -------------------------------------------------------------

  app.get('/api/orders', (req: Request, res: Response): void => {
    const user = getAuthUser(req);
    if (user) {
      const userOrders = db.orders.filter(
        (o) => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase()
      );
      res.json({ success: true, orders: userOrders });
    } else {
      res.json({ success: true, orders: db.orders.slice(-5) });
    }
  });

  app.post('/api/orders', (req: Request, res: Response): void => {
    try {
      const {
        items,
        subtotal,
        shipping,
        discount,
        total,
        paymentMethod,
        shippingAddress,
        customerName,
        customerEmail,
      } = req.body;

      const user = getAuthUser(req);
      const finalEmail = customerEmail || (user ? user.email : 'guest@indus.ac.in');
      const finalName = customerName || (user ? user.name : 'Valued Customer');

      const newOrder: OrderRecord = {
        id: 'ord_' + Date.now(),
        orderNumber: 'ORD-2026-' + Math.floor(10000 + Math.random() * 90000),
        userId: user ? user.id : undefined,
        customerName: finalName,
        customerEmail: finalEmail,
        items: items || [],
        subtotal: subtotal || 0,
        shipping: shipping || 0,
        discount: discount || 0,
        total: total || 0,
        paymentMethod: paymentMethod || 'Cash On Delivery (COD)',
        shippingAddress: shippingAddress || {},
        status: 'Confirmed & In Artisan Preparation',
        createdAt: new Date().toISOString(),
      };

      db.orders.unshift(newOrder);

      // Clear user cart upon successful checkout
      if (user) {
        user.cart = [];
      }

      saveDatabase(db);

      res.status(201).json({
        success: true,
        message: 'Order created and saved successfully!',
        order: newOrder,
      });
    } catch (err: any) {
      console.error('Order creation error:', err);
      res.status(500).json({ error: 'Failed to create order: ' + err.message });
    }
  });

  // -------------------------------------------------------------
  // SUBSCRIBERS PERSISTENCE ROUTES (New Updates Newsletter)
  // -------------------------------------------------------------

  app.get('/api/subscribers', (_req: Request, res: Response): void => {
    res.json({
      success: true,
      totalCount: 12450 + db.subscribers.length,
      subscribers: db.subscribers,
    });
  });

  app.post('/api/subscribers', (req: Request, res: Response): void => {
    try {
      const { email, preferences, frequency, promoCode } = req.body;

      if (!email || !email.includes('@')) {
        res.status(400).json({ error: 'Valid email is required.' });
        return;
      }

      const normalized = email.trim().toLowerCase();
      const existing = db.subscribers.find((s) => s.email.toLowerCase() === normalized);

      if (existing) {
        existing.preferences = preferences || existing.preferences;
        existing.frequency = frequency || existing.frequency;
        saveDatabase(db);
        res.json({
          success: true,
          message: 'Subscriber preferences updated successfully!',
          subscriber: existing,
        });
        return;
      }

      const newSubscriber: SubscriberRecord = {
        id: 'sub_' + Date.now(),
        email: normalized,
        preferences: preferences || ['drops', 'sales'],
        frequency: frequency || 'drops',
        promoCode: promoCode || 'RUPAL500',
        subscribedAt: new Date().toISOString(),
      };

      db.subscribers.push(newSubscriber);
      saveDatabase(db);

      res.status(201).json({
        success: true,
        message: 'Subscribed to VIP updates successfully!',
        subscriber: newSubscriber,
      });
    } catch (err: any) {
      console.error('Subscriber error:', err);
      res.status(500).json({ error: 'Failed to subscribe: ' + err.message });
    }
  });

  // -------------------------------------------------------------
  // PRODUCT REVIEWS PERSISTENCE ROUTES
  // -------------------------------------------------------------

  app.get('/api/reviews', (req: Request, res: Response): void => {
    const { productId } = req.query;
    if (productId && typeof productId === 'string') {
      const list = db.reviews.filter((r) => r.productId === productId);
      res.json({ success: true, reviews: list });
    } else {
      res.json({ success: true, reviews: db.reviews });
    }
  });

  app.post('/api/reviews', (req: Request, res: Response): void => {
    try {
      const { productId, author, city, rating, title, content } = req.body;
      if (!productId || !author || !content) {
        res.status(400).json({ error: 'Product ID, author name, and review content are required.' });
        return;
      }

      const newReview: ReviewRecord = {
        id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        productId,
        author: author.trim(),
        city: city?.trim() || 'Verified Buyer',
        rating: Number(rating) || 5,
        title: title?.trim() || 'Exceptional Handcrafted Quality',
        content: content.trim(),
        date: 'Just now',
        createdAt: new Date().toISOString(),
      };

      db.reviews.unshift(newReview);
      saveDatabase(db);

      res.status(201).json({
        success: true,
        message: 'Review saved and posted successfully!',
        review: newReview,
      });
    } catch (err: any) {
      console.error('Review error:', err);
      res.status(500).json({ error: 'Failed to save review: ' + err.message });
    }
  });

  // -------------------------------------------------------------
  // WORK GROUPS & TASKS PERSISTENCE ROUTES
  // -------------------------------------------------------------

  app.get('/api/workgroups', (_req: Request, res: Response): void => {
    res.json({ success: true, workGroups: db.workGroups });
  });

  app.put('/api/workgroups', (req: Request, res: Response): void => {
    try {
      const { workGroups } = req.body;
      if (Array.isArray(workGroups)) {
        db.workGroups = workGroups;
        saveDatabase(db);
      }
      res.json({ success: true, workGroups: db.workGroups });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save workgroups: ' + err.message });
    }
  });

  // -------------------------------------------------------------
  // CUSTOM IMAGES / REFERENCE PHOTOS PERSISTENCE ROUTES
  // -------------------------------------------------------------

  app.get('/api/images', (_req: Request, res: Response): void => {
    res.json({ success: true, customImages: db.customImages });
  });

  app.post('/api/images', (req: Request, res: Response): void => {
    try {
      const { key, dataUrl } = req.body;
      if (!key) {
        res.status(400).json({ error: 'Image key is required.' });
        return;
      }
      if (dataUrl === null || dataUrl === undefined) {
        delete db.customImages[key];
      } else {
        db.customImages[key] = dataUrl;
      }
      saveDatabase(db);
      res.json({ success: true, message: 'Image reference saved!' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save image: ' + err.message });
    }
  });

  // -------------------------------------------------------------
  // HEALTH CHECK
  // -------------------------------------------------------------
  app.get('/api/health', (_req: Request, res: Response): void => {
    res.json({
      status: 'ok',
      service: 'Rupal Artisanal E-Commerce PWA Backend',
      time: new Date().toISOString(),
      stats: {
        totalUsers: db.users.length,
        totalOrders: db.orders.length,
        totalSubscribers: db.subscribers.length,
        totalReviews: db.reviews.length,
      },
    });
  });

  // -------------------------------------------------------------
  // VITE DEV MIDDLEWARE or PRODUCTION STATIC SERVE
  // -------------------------------------------------------------
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite dev middleware mounted');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('📦 Static files served from dist');
  }

  // Bind to 0.0.0.0 and PORT (3000)
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Rupal Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
