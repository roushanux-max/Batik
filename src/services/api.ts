// Client API service to communicate with backend Express server
import { CartItem } from '../components/CartDrawer';
import { WorkGroup, ProductReview } from '../data/storeData';

const AUTH_TOKEN_KEY = 'rupal_auth_token';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  cart?: CartItem[];
  wishlist?: string[];
}

export interface OrderData {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state?: string;
    pincode: string;
  };
  customerName?: string;
  customerEmail?: string;
}

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  createdAt: string;
}

export const api = {
  // Token handlers
  getToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token: string) {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  },

  clearToken() {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  },

  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // ---------------- AUTHENTICATION ----------------
  async register(name: string, email: string, password: string): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async login(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async getMe(): Promise<UserProfile | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        if (res.status === 401) {
          this.clearToken();
        }
        return null;
      }

      const data = await res.json();
      return data.user || null;
    } catch (err) {
      console.warn('Failed to fetch /api/auth/me:', err);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: this.getHeaders(),
      });
    } catch {
      // ignore
    } finally {
      this.clearToken();
    }
  },

  // ---------------- CART ----------------
  async getCart(): Promise<CartItem[]> {
    try {
      const res = await fetch('/api/cart', {
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.cart || [];
      }
    } catch (err) {
      console.warn('Failed to load cart from backend:', err);
    }
    return [];
  },

  async saveCart(items: CartItem[]): Promise<void> {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ items }),
      });
    } catch (err) {
      console.warn('Failed to persist cart to backend:', err);
    }
  },

  // ---------------- WISHLIST ----------------
  async getWishlist(): Promise<string[]> {
    try {
      const res = await fetch('/api/wishlist', {
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.wishlist || [];
      }
    } catch (err) {
      console.warn('Failed to load wishlist from backend:', err);
    }
    return [];
  },

  async saveWishlist(wishlist: string[]): Promise<void> {
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ wishlist }),
      });
    } catch (err) {
      console.warn('Failed to persist wishlist to backend:', err);
    }
  },

  // ---------------- ORDERS ----------------
  async getOrders(): Promise<CreatedOrder[]> {
    try {
      const res = await fetch('/api/orders', {
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.orders || [];
      }
    } catch (err) {
      console.warn('Failed to fetch orders:', err);
    }
    return [];
  },

  async createOrder(orderData: OrderData): Promise<CreatedOrder> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to place order');
    }

    return data.order;
  },

  // ---------------- SUBSCRIBERS ----------------
  async subscribe(subData: {
    email: string;
    preferences: string[];
    frequency: string;
    promoCode?: string;
  }): Promise<{ message: string; subscriber: any }> {
    const res = await fetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Subscription failed');
    }
    return data;
  },

  // ---------------- REVIEWS ----------------
  async getReviews(productId: string): Promise<ProductReview[]> {
    try {
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      if (res.ok) {
        const data = await res.json();
        return (data.reviews || []).map((r: any) => ({
          id: r.id,
          author: r.author,
          location: r.city || r.location || 'India',
          rating: r.rating,
          date: r.date || 'Verified Buyer',
          title: r.title,
          content: r.content,
          verified: true,
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch reviews:', err);
    }
    return [];
  },

  async postReview(revData: {
    productId: string;
    author: string;
    city?: string;
    rating: number;
    title?: string;
    content: string;
  }): Promise<ProductReview> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(revData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit review');
    }

    const r = data.review;
    return {
      id: r.id,
      author: r.author,
      location: r.city || 'India',
      rating: r.rating,
      date: r.date || 'Just now',
      title: r.title,
      content: r.content,
      verified: true,
    };
  },

  // ---------------- WORK GROUPS ----------------
  async getWorkGroups(): Promise<WorkGroup[]> {
    try {
      const res = await fetch('/api/workgroups');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.workGroups) && data.workGroups.length > 0) {
          return data.workGroups;
        }
      }
    } catch {
      // fallback
    }
    return [];
  },

  async saveWorkGroups(workGroups: WorkGroup[]): Promise<void> {
    try {
      await fetch('/api/workgroups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workGroups }),
      });
    } catch {
      // ignore
    }
  },

  // ---------------- CUSTOM REFERENCE IMAGES ----------------
  async getCustomImages(): Promise<Record<string, string>> {
    try {
      const res = await fetch('/api/images');
      if (res.ok) {
        const data = await res.json();
        return data.customImages || {};
      }
    } catch {
      // fallback
    }
    return {};
  },

  async saveCustomImage(key: string, dataUrl: string | null): Promise<void> {
    try {
      await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, dataUrl }),
      });
    } catch {
      // ignore
    }
  },
};
