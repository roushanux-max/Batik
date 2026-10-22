import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Heart,
  User as UserIcon,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  Check,
  Camera,
  X,
  Sparkles,
  Download,
  WifiOff,
  Filter,
  Bell,
} from 'lucide-react';
import {
  HERO_CREATIONS,
  WORK_GROUPS,
  PRODUCTS,
  HeroCreation,
  WorkGroup,
  Product,
  formatINR,
} from './data/storeData';
import { SmartImage } from './components/SmartImage';
import { CreationBlogModal } from './components/CreationBlogModal';
import { WorkTasksModal } from './components/WorkTasksModal';
import { ProductPage } from './components/ProductPage';
import { SubscribeSection } from './components/SubscribeSection';
import { AuthModal } from './components/AuthModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { ImageReferenceModal } from './components/ImageReferenceModal';
import { usePWAInstall, useOnlineStatus } from './hooks/usePWAInstall';
import { api, UserProfile } from './services/api';
import heroCraftBgImg from './assets/images/hero_craft_bg_1790398896866.jpg';

export default function App() {
  // PWA Hooks
  const { isInstallable, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Custom User Reference Images (stored in localStorage)
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('rupal_custom_images') || localStorage.getItem('novatrend_custom_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Work Groups & Small Tasks (stored in localStorage)
  const [workGroups, setWorkGroups] = useState<WorkGroup[]>(() => {
    try {
      const saved = localStorage.getItem('rupal_work_groups') || localStorage.getItem('novatrend_work_groups');
      return saved ? JSON.parse(saved) : WORK_GROUPS;
    } catch {
      return WORK_GROUPS;
    }
  });

  // Hero Carousel State (Revive Dupatta, Bhimbetka Motifs, Wooden Blocks)
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // E-Commerce State
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[3], quantity: 1, size: 'M' },
  ]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-4']);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [activeWorkGroupFilter, setActiveWorkGroupFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Modals & Navigation State
  const [activeBlogCreation, setActiveBlogCreation] = useState<HeroCreation | null>(null);
  const [activeWorkGroupModal, setActiveWorkGroupModal] = useState<WorkGroup | null>(null);
  
  // Dedicated Product Page State (Non-Popup Routing)
  const [activeProductId, setActiveProductId] = useState<string | null>(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        if (PRODUCTS.some((p) => p.id === id)) return id;
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Sync hash changes (browser back/forward button)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        if (PRODUCTS.some((p) => p.id === id)) {
          setActiveProductId(id);
          return;
        }
      }
      if (!hash || hash === '#' || hash === '#home') {
        setActiveProductId(null);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const activeProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === activeProductId) || null,
    [activeProductId]
  );

  const handleSelectProduct = (product: Product) => {
    setActiveProductId(product.id);
    window.location.hash = `product-${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveProductId(null);
    if (window.location.hash.startsWith('#product-')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showImageRefModal, setShowImageRefModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live countdown timer for the Flash Sale banner
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 15,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync with backend API on mount
  useEffect(() => {
    // 1. Check logged in user session
    api.getMe().then((profile) => {
      if (profile) {
        setCurrentUser({ name: profile.name, email: profile.email });
        if (profile.cart && profile.cart.length > 0) {
          setCart(profile.cart);
        }
        if (profile.wishlist && profile.wishlist.length > 0) {
          setWishlist(profile.wishlist);
        }
      }
    }).catch(() => {});

    // 2. Fetch remote cart & wishlist
    api.getCart().then((remoteCart) => {
      if (remoteCart && remoteCart.length > 0) {
        setCart(remoteCart);
      }
    }).catch(() => {});

    api.getWishlist().then((remoteWishlist) => {
      if (remoteWishlist && remoteWishlist.length > 0) {
        setWishlist(remoteWishlist);
      }
    }).catch(() => {});

    // 3. Fetch remote workgroups
    api.getWorkGroups().then((remoteGroups) => {
      if (remoteGroups && remoteGroups.length > 0) {
        setWorkGroups(remoteGroups);
      }
    }).catch(() => {});

    // 4. Fetch remote custom reference images
    api.getCustomImages().then((remoteImages) => {
      if (remoteImages && Object.keys(remoteImages).length > 0) {
        setCustomImages((prev) => ({ ...prev, ...remoteImages }));
      }
    }).catch(() => {});
  }, []);

  // Persist cart to backend
  useEffect(() => {
    api.saveCart(cart);
  }, [cart]);

  // Persist wishlist to backend
  useEffect(() => {
    api.saveWishlist(wishlist);
  }, [wishlist]);

  // Save custom images
  useEffect(() => {
    try {
      localStorage.setItem('rupal_custom_images', JSON.stringify(customImages));
    } catch {
      // ignore
    }
  }, [customImages]);

  // Save work groups
  useEffect(() => {
    try {
      localStorage.setItem('rupal_work_groups', JSON.stringify(workGroups));
      api.saveWorkGroups(workGroups);
    } catch {
      // ignore
    }
  }, [workGroups]);

  // Auto-advance hero carousel
  useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % HERO_CREATIONS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHeroPaused]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((prev) => (prev === msg ? null : prev)), 2500);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    showToast('Logged out successfully');
  };

  const handleUploadCustomImage = (key: string, dataUrl: string) => {
    setCustomImages((prev) => ({ ...prev, [key]: dataUrl }));
    api.saveCustomImage(key, dataUrl);
    showToast('Reference photo updated & saved to backend');
  };

  const handleResetCustomImage = (key: string) => {
    setCustomImages((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    api.saveCustomImage(key, null);
    showToast('Reset to studio default');
  };

  const handleResetAllImages = () => {
    setCustomImages({});
    showToast('All photos reset to studio default');
  };

  const handleToggleTask = (groupId: string, taskId: string) => {
    setWorkGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              smallTasks: g.smallTasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
      )
    );
  };

  const handleAddTask = (groupId: string, title: string, detail: string, duration: string) => {
    setWorkGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              smallTasks: [
                ...g.smallTasks,
                {
                  id: `task-${Date.now()}`,
                  code: `${g.groupNumber}.${g.smallTasks.length + 1}`,
                  title,
                  detail,
                  duration,
                  completed: false,
                },
              ],
            }
      )
    );
    showToast(`Added small task: ${title}`);
  };

  const handleAddToCart = (product: Product, size?: string, quantity?: number) => {
    const chosenSize = size || product.sizes[0] || 'Standard';
    const count = quantity && quantity > 0 ? quantity : 1;
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id && item.size === chosenSize);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + count };
        return copy;
      }
      return [...prev, { product, quantity: count, size: chosenSize }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const handleBuyNow = (product: Product, size?: string, quantity?: number) => {
    handleAddToCart(product, size, quantity);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((it) => (it.product.id === productId && it.size === size ? { ...it, quantity: it.quantity + delta } : it))
        .filter((it) => it.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    setCart((prev) => prev.filter((it) => !(it.product.id === productId && it.size === size)));
  };

  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const currentHero = HERO_CREATIONS[activeHeroIndex];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = activeCategoryFilter === 'All' || p.category === activeCategoryFilter;
      const matchGroup = !activeWorkGroupFilter || p.workGroupId === activeWorkGroupFilter;
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchGroup && matchSearch;
    });
  }, [activeCategoryFilter, activeWorkGroupFilter, searchQuery]);

  const bestSellerProducts = useMemo(() => PRODUCTS.filter((p) => p.isBestSeller), []);

  const totalCartCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  const scrollToShop = (category?: string, groupId?: string | null) => {
    if (activeProductId) {
      setActiveProductId(null);
      if (window.location.hash.startsWith('#product-')) {
        history.pushState(null, '', window.location.pathname + window.location.search);
      }
    }
    if (category) setActiveCategoryFilter(category);
    if (groupId !== undefined) setActiveWorkGroupFilter(groupId);
    setTimeout(() => {
      document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans">
      {/* 1. TOP BLACK ANNOUNCEMENT BAR (Matching Reference) */}
      <div className="bg-[#0B0B0B] text-white text-xs py-2.5 px-4 font-medium border-b border-zinc-900">
        <div className="max-w-[1340px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-6 text-[11px] sm:text-xs mx-auto sm:mx-0 overflow-x-auto">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              🚚 Free Shipping Across India on Orders Over ₹999
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5 text-amber-300 whitespace-nowrap">
              ⚡ Summer Sale Up To 70% Off
            </span>
            <span className="text-zinc-600 hidden md:inline">|</span>
            <span className="flex items-center gap-1.5 text-zinc-300 hidden md:inline whitespace-nowrap">
              ⚡ Limited Time Flash Deals
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] text-zinc-400">
            <button
              type="button"
              onClick={() => setShowImageRefModal(true)}
              className="inline-flex items-center gap-1 text-white hover:text-[#FF5722] cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Swap Reference Photos</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. HEADER: Logo Left — Nav Center — Shop, Login, Register, Icons Right (Matching Reference & User Brief) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-2xs">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo on Left */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleBackToHome}
              className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-1 cursor-pointer text-left"
            >
              Rupal<span className="text-[#FF5722]">.</span>
            </button>
          </div>

          {/* Navigation Links in Center */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-zinc-600">
            <button
              type="button"
              onClick={handleBackToHome}
              className={`hover:text-zinc-900 cursor-pointer ${!activeProduct ? 'text-[#FF5722]' : ''}`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToShop('All', null)}
              className="hover:text-zinc-900 cursor-pointer"
            >
              Shop
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeProductId) handleBackToHome();
                setTimeout(() => document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="hover:text-zinc-900 cursor-pointer"
            >
              New Arrivals
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeProductId) handleBackToHome();
                setTimeout(() => document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="hover:text-zinc-900 cursor-pointer"
            >
              Best Sellers
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeProductId) handleBackToHome();
                setTimeout(() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="hover:text-zinc-900 cursor-pointer"
            >
              Categories ▾
            </button>
            <button
              type="button"
              onClick={() => setActiveBlogCreation(HERO_CREATIONS[0])}
              className="hover:text-zinc-900 cursor-pointer"
            >
              Creation Blog
            </button>
            <button
              type="button"
              onClick={() => {
                document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#FF5722] cursor-pointer flex items-center gap-1 font-medium"
            >
              <Bell className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>Updates</span>
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-zinc-900 cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Header Right Actions: Shop, Login, Register + Search, Heart, User, Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* PWA Install Button if available */}
            {isInstallable && (
              <button
                type="button"
                onClick={install}
                className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-800 hover:bg-zinc-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FF5722]" />
                <span>Install PWA</span>
              </button>
            )}

            {/* Shop Button */}
            <button
              type="button"
              onClick={() => scrollToShop('All', null)}
              className="px-3 py-1.5 text-xs font-bold text-zinc-800 hover:text-[#FF5722] cursor-pointer"
            >
              Shop
            </button>

            {/* Login & Register Buttons (Requested explicitly) */}
            {!currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="px-3.5 py-1.5 rounded-full border border-zinc-300 text-xs font-bold text-zinc-800 hover:border-zinc-500 cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="px-3.5 py-1.5 rounded-full bg-[#FF5722] text-xs font-bold text-white hover:bg-[#E64A19] shadow-xs cursor-pointer"
                >
                  Register
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <UserIcon className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span className="truncate max-w-[100px] sm:max-w-[140px]">{currentUser.name}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-semibold text-zinc-500 hover:text-[#FF5722] underline cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}

            <span className="h-5 w-px bg-zinc-200 mx-1 hidden sm:inline" />

            {/* Search Icon */}
            <button
              type="button"
              onClick={() => scrollToShop()}
              className="p-2 text-zinc-600 hover:text-zinc-900 cursor-pointer"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Heart Icon */}
            <button
              type="button"
              onClick={() => showToast(`Wishlist contains ${wishlist.length} items`)}
              className="relative p-2 text-zinc-600 hover:text-zinc-900 cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5722]" />
              )}
            </button>

            {/* Cart Icon with Orange Counter (Exact Reference Style) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-600 hover:text-zinc-900 cursor-pointer"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF5722] px-1 text-[10px] font-black text-white">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Dedicated Product Page (Non-popup) or Storefront View */}
      {activeProduct ? (
        <ProductPage
          product={activeProduct}
          allProducts={PRODUCTS}
          workGroups={workGroups}
          onBackToHome={handleBackToHome}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isWishlisted={wishlist.includes(activeProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          customImages={customImages}
          onUploadCustomImage={handleUploadCustomImage}
          onResetCustomImage={handleResetCustomImage}
          onOpenWorkGroupModal={(wg) => setActiveWorkGroupModal(wg)}
        />
      ) : (
        <main className="flex-1">
          {/* 3. HERO SECTION (1:1 Replica of Reference Layout with Relevant Craft Studio Background) */}
      <section
        className="relative py-8 sm:py-12 lg:py-16 overflow-hidden bg-[#FAF9F7]"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
      >
        {/* Relevant Atmospheric Studio & Craft Textile Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={heroCraftBgImg}
            alt="Artisanal textile workshop backdrop"
            className="w-full h-full object-cover object-center opacity-35 scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          {currentHero.blogHeroImage && (
            <img
              key={currentHero.id}
              src={currentHero.blogHeroImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center opacity-15 mix-blend-multiply transition-opacity duration-1000"
              referrerPolicy="no-referrer"
            />
          )}
          {/* Subtle Ambient Studio Lighting & Readability Veils */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        <div className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Trending Now, Heading, Subtitle, Shop Now & Explore Buttons, Social Proof */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block text-xs font-black tracking-widest text-[#FF5722] uppercase">
                {currentHero.tag || 'TRENDING NOW'}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-zinc-900 tracking-tight leading-[1.06]">
                Discover Products <br />
                <span className="text-zinc-900">You'll Love</span>
              </h1>

              {/* Text Content Preserved From Current Hero */}
              <div className="space-y-1.5 pt-0.5">
                <p className="text-sm sm:text-base font-bold text-zinc-800 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#FF5722]" />
                  {currentHero.title}
                </p>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
                  {currentHero.subtitle}
                </p>
              </div>

              {/* Action Buttons: Solid Orange Shop Now -> & White Explore Collection */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => scrollToShop(currentHero.category)}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#FF5722] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-[#FF5722]/25 hover:bg-[#E64A19] transition-all cursor-pointer hover:shadow-lg"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveBlogCreation(currentHero)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-6 py-3.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-xs cursor-pointer"
                >
                  <span>Explore Collection</span>
                </button>
              </div>

              {/* Social Proof: 4 Overlapping Avatar Photos + Loved by 50,000+ customers worldwide */}
              <div className="pt-3 flex items-center gap-3.5">
                <div className="flex -space-x-2.5 overflow-hidden py-1">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Customer 1"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Customer 2"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                    alt="Customer 3"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    alt="Customer 4"
                  />
                </div>
                <div className="text-xs font-semibold text-zinc-600">
                  <span>Loved by 50,000+ customers worldwide</span>
                </div>
              </div>

              {/* Carousel Creation Switcher Tabs */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-500">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Creations:</span>
                {HERO_CREATIONS.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveHeroIndex(i)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      i === activeHeroIndex
                        ? 'bg-[#111827] text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    0{i + 1}. {c.shortTitle}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Visual with Model in Coral Pod Chair + 4 Floating Vertical Product Cards */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-[500px]">
                {/* Center Visual Frame with Model in Glossy Coral Chair */}
                <div
                  onClick={() => setActiveBlogCreation(currentHero)}
                  className="relative aspect-square sm:aspect-[4/3.8] rounded-[36px] overflow-hidden bg-zinc-50 shadow-2xl cursor-pointer group select-none border border-zinc-100"
                >
                  <SmartImage
                    src={currentHero.heroImage}
                    customKey={`hero-${currentHero.id}`}
                    customImages={customImages}
                    onUploadCustomImage={handleUploadCustomImage}
                    onResetCustomImage={handleResetCustomImage}
                    alt={currentHero.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />

                  {/* Subtle Gradient Shadow at Bottom for Dots */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 via-black/15 to-transparent pointer-events-none" />

                  {/* Read Story Banner on Top Hover */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-zinc-900 shadow-md">
                      {currentHero.shortTitle} Story
                    </span>
                    <span className="rounded-full bg-[#FF5722] px-3 py-1 text-[11px] font-bold text-white shadow-md">
                      Read Blog →
                    </span>
                  </div>

                  {/* Carousel Left & Right Buttons */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHeroIndex((prev) => (prev - 1 + HERO_CREATIONS.length) % HERO_CREATIONS.length);
                    }}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-zinc-700 hover:bg-white hover:text-black hover:scale-105 transition-all cursor-pointer z-20"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHeroIndex((prev) => (prev + 1) % HERO_CREATIONS.length);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-zinc-700 hover:bg-white hover:text-black hover:scale-105 transition-all cursor-pointer z-20"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Carousel Pagination Dots Centered at Bottom of Chair (1:1 with reference) */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                    {HERO_CREATIONS.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHeroIndex(idx);
                        }}
                        className={`transition-all duration-300 cursor-pointer ${
                          idx === activeHeroIndex
                            ? 'w-7 h-2 rounded-full bg-white shadow-md'
                            : 'w-2 h-2 rounded-full bg-white/60 hover:bg-white'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* 4 Floating Vertical Product Cards (Exact Replica of Reference Layout) */}

                {/* 1. Top-Left Floating Card */}
                {(() => {
                  const callout = currentHero.floatingCallouts[0];
                  const product = PRODUCTS.find((p) => p.id === callout?.productId) || PRODUCTS[0];
                  if (!callout) return null;
                  return (
                    <div
                      onClick={() => handleSelectProduct(product)}
                      className="hidden sm:flex flex-col items-start absolute -top-3 -left-4 md:-left-8 z-30 w-28 sm:w-32 rounded-2xl bg-white/95 backdrop-blur-md p-2.5 sm:p-3 shadow-[0_12px_28px_rgba(0,0,0,0.08)] border border-zinc-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                      <div className="w-full aspect-square rounded-xl bg-zinc-50 overflow-hidden flex items-center justify-center p-1.5 mb-1.5 group-hover:scale-105 transition-transform">
                        <SmartImage
                          src={product.image}
                          customKey={`callout-0-${product.id}`}
                          customImages={customImages}
                          alt={callout.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-[11px] sm:text-xs font-bold text-zinc-900 truncate w-full group-hover:text-[#FF5722] transition-colors leading-tight">
                        {callout.title}
                      </p>
                      <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 mt-0.5">
                        {callout.priceOrMetric}
                      </p>
                    </div>
                  );
                })()}

                {/* 2. Mid-Left Floating Card (waist height) */}
                {(() => {
                  const callout = currentHero.floatingCallouts[1];
                  const product = PRODUCTS.find((p) => p.id === callout?.productId) || PRODUCTS[1];
                  if (!callout) return null;
                  return (
                    <div
                      onClick={() => handleSelectProduct(product)}
                      className="hidden sm:flex flex-col items-start absolute top-[48%] -translate-y-1/2 -left-6 md:-left-12 z-30 w-28 sm:w-32 rounded-2xl bg-white/95 backdrop-blur-md p-2.5 sm:p-3 shadow-[0_12px_28px_rgba(0,0,0,0.08)] border border-zinc-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                      <div className="w-full aspect-square rounded-xl bg-zinc-50 overflow-hidden flex items-center justify-center p-1.5 mb-1.5 group-hover:scale-105 transition-transform">
                        <SmartImage
                          src={product.image}
                          customKey={`callout-1-${product.id}`}
                          customImages={customImages}
                          alt={callout.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-[11px] sm:text-xs font-bold text-zinc-900 truncate w-full group-hover:text-[#FF5722] transition-colors leading-tight">
                        {callout.title}
                      </p>
                      <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 mt-0.5">
                        {callout.priceOrMetric}
                      </p>
                    </div>
                  );
                })()}

                {/* 3. Top-Right Floating Card */}
                {(() => {
                  const callout = currentHero.floatingCallouts[2];
                  const product = PRODUCTS.find((p) => p.id === callout?.productId) || PRODUCTS[2];
                  if (!callout) return null;
                  return (
                    <div
                      onClick={() => handleSelectProduct(product)}
                      className="hidden sm:flex flex-col items-start absolute top-4 -right-4 md:-right-8 z-30 w-28 sm:w-32 rounded-2xl bg-white/95 backdrop-blur-md p-2.5 sm:p-3 shadow-[0_12px_28px_rgba(0,0,0,0.08)] border border-zinc-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                      <div className="w-full aspect-square rounded-xl bg-zinc-50 overflow-hidden flex items-center justify-center p-1.5 mb-1.5 group-hover:scale-105 transition-transform">
                        <SmartImage
                          src={product.image}
                          customKey={`callout-2-${product.id}`}
                          customImages={customImages}
                          alt={callout.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-[11px] sm:text-xs font-bold text-zinc-900 truncate w-full group-hover:text-[#FF5722] transition-colors leading-tight">
                        {callout.title}
                      </p>
                      <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 mt-0.5">
                        {callout.priceOrMetric}
                      </p>
                    </div>
                  );
                })()}

                {/* 4. Bottom-Right Floating Card */}
                {(() => {
                  const callout = currentHero.floatingCallouts[3];
                  const product = PRODUCTS.find((p) => p.id === callout?.productId) || PRODUCTS[3];
                  if (!callout) return null;
                  return (
                    <div
                      onClick={() => handleSelectProduct(product)}
                      className="hidden sm:flex flex-col items-start absolute bottom-6 -right-4 md:-right-10 z-30 w-28 sm:w-32 rounded-2xl bg-white/95 backdrop-blur-md p-2.5 sm:p-3 shadow-[0_12px_28px_rgba(0,0,0,0.08)] border border-zinc-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                      <div className="w-full aspect-square rounded-xl bg-zinc-50 overflow-hidden flex items-center justify-center p-1.5 mb-1.5 group-hover:scale-105 transition-transform">
                        <SmartImage
                          src={product.image}
                          customKey={`callout-3-${product.id}`}
                          customImages={customImages}
                          alt={callout.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-[11px] sm:text-xs font-bold text-zinc-900 truncate w-full group-hover:text-[#FF5722] transition-colors leading-tight">
                        {callout.title}
                      </p>
                      <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 mt-0.5">
                        {callout.priceOrMetric}
                      </p>
                    </div>
                  );
                })()}

              </div>

              {/* Mobile Carousel Callouts Strip (Visible only on mobile screens) */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:hidden">
                {currentHero.floatingCallouts.slice(0, 2).map((callout) => {
                  const product = PRODUCTS.find((p) => p.id === callout.productId) || PRODUCTS[0];
                  return (
                    <div
                      key={callout.id}
                      onClick={() => handleSelectProduct(product)}
                      className="flex items-center gap-2 rounded-xl bg-white p-2 border border-zinc-200 shadow-xs cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-zinc-50 overflow-hidden shrink-0">
                        <SmartImage
                          src={product.image}
                          customKey={`mobile-callout-${product.id}`}
                          customImages={customImages}
                          alt={callout.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-zinc-900 truncate">{callout.title}</p>
                        <p className="text-[10px] font-medium text-zinc-500">{callout.priceOrMetric}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR TRUST & SERVICE STRIP (Exact Reference Strip Below Hero) */}
      <section className="py-7 border-y border-zinc-100 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-zinc-800" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Free Shipping</h4>
              <p className="text-xs text-zinc-400">On orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-zinc-800" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Secure Payments</h4>
              <p className="text-xs text-zinc-400">100% secure checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-zinc-800" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Easy Returns</h4>
              <p className="text-xs text-zinc-400">30-day return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-zinc-800" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">24/7 Support</h4>
              <p className="text-xs text-zinc-400">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY CATEGORIES / ALL WORK GROUPED IN SMALL TASKS (Matching Reference Row of 6 Cards) */}
      <section id="categories" className="py-12 lg:py-16">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                Shop by Categories & Work Tasks
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                All my textile creations and process work grouped into executable small tasks.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveWorkGroupModal(workGroups[0])}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-800 hover:text-[#FF5722] cursor-pointer"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 6 Category Cards in a Row (Matching Reference) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {workGroups.map((group) => {
              const doneCount = group.smallTasks.filter((t) => t.completed).length;
              return (
                <div
                  key={group.id}
                  onClick={() => setActiveWorkGroupModal(group)}
                  className="group rounded-2xl bg-[#F6F6F6] p-3 hover:bg-white hover:shadow-xl hover:border-zinc-200 border border-transparent transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-white">
                      <SmartImage
                        src={group.image}
                        customKey={`wg-${group.id}`}
                        customImages={customImages}
                        onUploadCustomImage={handleUploadCustomImage}
                        onResetCustomImage={handleResetCustomImage}
                        alt={group.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#FF5722] transition-colors truncate">
                        {group.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {doneCount}/{group.smallTasks.length} small tasks
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-200/50 flex items-center justify-between text-[11px] font-bold text-zinc-600 group-hover:text-[#FF5722]">
                    <span>View Tasks</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS: PRODUCTS FOR SELLING (Matching Reference Row of 6 Products) */}
      <section id="new-arrivals" className="py-12 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                New Arrivals
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Explore newly crafted garments, dupattas, and pattern textiles.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToShop('All', null)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-zinc-800 hover:text-[#FF5722] cursor-pointer"
              >
                <span>View All New Arrivals</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollToShop()}
                  className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                  aria-label="Previous arrivals"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToShop()}
                  className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                  aria-label="Next arrivals"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 6 Products Row matching the 6 cards in reference New Arrivals */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PRODUCTS.slice(0, 6).map((product) => {
              const isFav = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="group rounded-2xl bg-[#F6F6F6] p-3 flex flex-col justify-between hover:bg-white hover:shadow-lg hover:border-zinc-200 border border-transparent transition-all"
                >
                  <div>
                    {/* Image frame with top-left badge and top-right wishlist heart */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
                      <div
                        onClick={() => handleSelectProduct(product)}
                        className="w-full h-full cursor-pointer"
                      >
                        <SmartImage
                          src={product.image}
                          customKey={`prod-${product.id}`}
                          customImages={customImages}
                          onUploadCustomImage={handleUploadCustomImage}
                          onResetCustomImage={handleResetCustomImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Badge Top Left */}
                      {product.badge && (
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                            product.badgeType === 'discount'
                              ? 'bg-[#FF5722] text-white'
                              : 'bg-[#111827] text-white'
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}

                      {/* Wishlist Heart Top Right */}
                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(product.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-zinc-600 shadow-2xs hover:text-[#FF5722] cursor-pointer"
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#FF5722] text-[#FF5722]' : ''}`} />
                      </button>
                    </div>

                    {/* Title & Info */}
                    <div className="mt-3">
                      <h3
                        onClick={() => handleSelectProduct(product)}
                        className="text-xs font-bold text-zinc-900 group-hover:text-[#FF5722] cursor-pointer truncate"
                      >
                        {product.name}
                      </h3>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-zinc-900">
                          {formatINR(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            {formatINR(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-zinc-700">{product.rating}</span>
                        <span>({product.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Circular Black Add to Cart Button in bottom right (Exact Reference Design) */}
                  <div className="mt-3 pt-2 border-t border-zinc-200/50 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center hover:bg-[#FF5722] shadow-sm transition-colors cursor-pointer"
                      aria-label="Add to bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BEST SELLERS (Matching Reference Row of 3 Wide Cards) */}
      <section id="best-sellers" className="py-12 bg-[#FAFAFB]">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                Best Sellers
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Our most sought-after textile garments and craft block sets.
              </p>
            </div>

            <button
              type="button"
              onClick={() => scrollToShop('All', null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-800 hover:text-[#FF5722] cursor-pointer"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Wide Cards (Matching Reference Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bestSellerProducts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-white p-5 border border-zinc-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Badge */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4E5] text-[#D97706] text-[11px] font-extrabold uppercase">
                      Bestseller
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleWishlist(item.id)}
                      className="text-zinc-400 hover:text-[#FF5722] cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${wishlist.includes(item.id) ? 'fill-[#FF5722] text-[#FF5722]' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Clean Image Area */}
                  <div
                    onClick={() => handleSelectProduct(item)}
                    className="aspect-square rounded-2xl overflow-hidden bg-[#F6F6F6] cursor-pointer"
                  >
                    <SmartImage
                      src={item.image}
                      customKey={`prod-${item.id}`}
                      customImages={customImages}
                      onUploadCustomImage={handleUploadCustomImage}
                      onResetCustomImage={handleResetCustomImage}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Info */}
                  <div className="mt-4 space-y-1">
                    <h3
                      onClick={() => handleSelectProduct(item)}
                      className="text-base font-extrabold text-zinc-900 hover:text-[#FF5722] cursor-pointer truncate"
                    >
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-zinc-900">{formatINR(item.price)}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-zinc-400 line-through">
                          {formatINR(item.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-zinc-800">{item.rating}</span>
                      <span>({item.reviews})</span>
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2 pt-1">{item.description}</p>
                  </div>
                </div>

                {/* Quick Add Button & Mini Cart Button */}
                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 rounded-full bg-[#111827] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#FF5722] transition-colors cursor-pointer"
                  >
                    Quick Add
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectProduct(item)}
                    className="p-2.5 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                    aria-label="Inspect"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. COMPLETE STOREFRONT CATALOG & FILTERABLE APPAREL GRID */}
      <section id="shop-section" className="py-12 bg-white border-t border-zinc-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-extrabold text-[#FF5722] uppercase tracking-wider">
                OUR COMPLETE ARCHIVE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-0.5">
                Explore Clothes, Patterns & Hand Blocks
              </h2>
            </div>

            {/* Filter pills & search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dupattas, hoodies, blocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full border border-zinc-200 pl-9 pr-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722] w-52 sm:w-64"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowImageRefModal(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#FF5722]" />
                <span>Reference Photos</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-zinc-100">
            {['All', 'Clothes & Patterns', 'Revive Dupatta', 'Bhimbetka Motifs', 'Wooden Blocks'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategoryFilter(cat);
                  setActiveWorkGroupFilter(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  activeCategoryFilter === cat && !activeWorkGroupFilter
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}

            {activeWorkGroupFilter && (
              <button
                type="button"
                onClick={() => setActiveWorkGroupFilter(null)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-100 text-[#FF5722] text-xs font-bold hover:bg-orange-200 cursor-pointer"
              >
                <span>Clear Work Group Filter</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const isFav = wishlist.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="group rounded-3xl bg-[#F8F9FA] p-3.5 border border-zinc-100 hover:bg-white hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
                      <div
                        onClick={() => handleSelectProduct(p)}
                        className="w-full h-full cursor-pointer"
                      >
                        <SmartImage
                          src={p.image}
                          customKey={`prod-${p.id}`}
                          customImages={customImages}
                          onUploadCustomImage={handleUploadCustomImage}
                          onResetCustomImage={handleResetCustomImage}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {p.badge && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-zinc-900 text-white text-[10px] font-bold uppercase">
                          {p.badge}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(p.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 shadow-xs text-zinc-600 hover:text-[#FF5722] cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#FF5722] text-[#FF5722]' : ''}`} />
                      </button>
                    </div>

                    <div className="mt-3.5 px-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">{p.category}</span>
                      <h3
                        onClick={() => handleSelectProduct(p)}
                        className="text-sm font-bold text-zinc-900 group-hover:text-[#FF5722] cursor-pointer truncate mt-0.5"
                      >
                        {p.name}
                      </h3>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-black text-zinc-900">{formatINR(p.price)}</span>
                        {p.originalPrice && (
                          <span className="text-[11px] text-zinc-400 line-through">
                            {formatINR(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 px-1 border-t border-zinc-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-zinc-800">{p.rating}</span>
                      <span>({p.reviews})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center hover:bg-[#FF5722] shadow-xs cursor-pointer"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. DUAL PROMOTIONAL BANNERS AT BOTTOM (Exact Replica of Reference Bottom Banners) */}
      <section className="py-12 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Banner: Vibrant Orange Flash Sale with live countdown boxes */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#FF5722] via-[#FF6D3B] to-[#FF8A65] p-8 sm:p-10 text-white flex flex-col justify-between min-h-[300px] shadow-lg">
            <div className="max-w-xs z-10 space-y-3">
              <span className="inline-block text-[11px] font-extrabold tracking-wider uppercase text-amber-200">
                Flash Sale
              </span>
              <h3 className="text-3xl sm:text-4xl font-black leading-tight">
                Up To 70% Off
              </h3>

              {/* Countdown boxes (Matching reference: Days : Hours : Mins : Secs) */}
              <div className="pt-2 flex items-center gap-2 font-mono text-center">
                <div className="bg-white/20 backdrop-blur-xs rounded-xl px-2.5 py-1.5 min-w-[44px]">
                  <span className="text-base font-black leading-none block">
                    {String(countdown.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/80">Days</span>
                </div>
                <span className="text-lg font-bold">:</span>
                <div className="bg-white/20 backdrop-blur-xs rounded-xl px-2.5 py-1.5 min-w-[44px]">
                  <span className="text-base font-black leading-none block">
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/80">Hours</span>
                </div>
                <span className="text-lg font-bold">:</span>
                <div className="bg-white/20 backdrop-blur-xs rounded-xl px-2.5 py-1.5 min-w-[44px]">
                  <span className="text-base font-black leading-none block">
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/80">Mins</span>
                </div>
                <span className="text-lg font-bold">:</span>
                <div className="bg-white/20 backdrop-blur-xs rounded-xl px-2.5 py-1.5 min-w-[44px]">
                  <span className="text-base font-black leading-none block">
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/80">Secs</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => scrollToShop('All', null)}
                  className="rounded-full bg-white px-6 py-2.5 text-xs font-extrabold text-[#FF5722] hover:bg-zinc-100 transition-colors shadow-md cursor-pointer"
                >
                  Shop Sale Now
                </button>
              </div>
            </div>

            {/* Product Graphic on the right of banner */}
            <div className="absolute right-2 -bottom-4 w-52 sm:w-64 aspect-square rounded-full opacity-90 overflow-hidden pointer-events-none">
              <SmartImage
                src={PRODUCTS[3].image}
                customKey="prod-prod-4"
                customImages={customImages}
                alt="Sale Apparel"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right Banner: Dark Modern Summer 2026 Collection with Model */}
          <div className="relative overflow-hidden rounded-[32px] bg-[#111827] p-8 sm:p-10 text-white flex flex-col justify-between min-h-[300px] shadow-lg">
            <div className="max-w-xs z-10 space-y-3">
              <span className="inline-block text-[11px] font-extrabold tracking-wider uppercase text-[#FF5722]">
                New Collection
              </span>
              <h3 className="text-3xl sm:text-4xl font-black leading-tight">
                Summer 2026
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Discover the latest hand-block trends, Revive dupattas, and fresh styles.
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => scrollToShop('Clothes & Patterns', null)}
                  className="rounded-full bg-white px-6 py-2.5 text-xs font-extrabold text-[#111827] hover:bg-zinc-200 transition-colors shadow-md cursor-pointer"
                >
                  Shop Collection
                </button>
              </div>
            </div>

            {/* Model Graphic on the right of dark banner */}
            <div className="absolute right-0 -bottom-2 w-52 sm:w-64 h-full overflow-hidden pointer-events-none opacity-85">
              <SmartImage
                src={HERO_CREATIONS[0].heroImage}
                customKey="hero-banner-model"
                customImages={customImages}
                alt="Indian woman in handloom craftwear"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 10. BOTTOM TRUST GUARANTEE ROW (Exact Reference 4 Icons) */}
      <section className="py-8 border-t border-zinc-100 bg-[#FAFAFA]">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-zinc-700 shrink-0" />
            <div>
              <h5 className="text-xs font-bold text-zinc-900">Premium Quality</h5>
              <p className="text-[11px] text-zinc-500">Made with the finest materials</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-zinc-700 shrink-0" />
            <div>
              <h5 className="text-xs font-bold text-zinc-900">Fast Delivery</h5>
              <p className="text-[11px] text-zinc-500">Quick and reliable shipping</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-zinc-700 shrink-0" />
            <div>
              <h5 className="text-xs font-bold text-zinc-900">Secure Checkout</h5>
              <p className="text-[11px] text-zinc-500">Your data is protected</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Headphones className="w-5 h-5 text-zinc-700 shrink-0" />
            <div>
              <h5 className="text-xs font-bold text-zinc-900">Customer Satisfaction</h5>
              <p className="text-[11px] text-zinc-500">100% satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </section>
        </main>
      )}

      {/* 11. SUBSCRIBE FOR NEW UPDATES SECTION */}
      <SubscribeSection id="newsletter" />

      {/* 12. FOOTER */}
      <footer id="contact" className="bg-[#111827] text-white py-12 border-t border-zinc-800">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800 text-xs">
            <div className="space-y-3">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                Rupal<span className="text-[#FF5722]">.</span>
              </span>
              <p className="text-zinc-400 leading-relaxed">
                Artisanal e-commerce Progressive Web Application (PWA). Presenting the Revive Dupatta collection, prehistoric Bhimbetka motifs, and seasoned Sagwan wooden blocks.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">Hero Creations</h4>
              <ul className="space-y-2 text-zinc-400 text-left">
                {HERO_CREATIONS.map((c) => (
                  <li key={c.id} className="text-left">
                    <button
                      type="button"
                      onClick={() => setActiveBlogCreation(c)}
                      className="text-left hover:text-[#FF5722] cursor-pointer"
                    >
                      {c.shortTitle} — Craft Blog
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">Work Group Tasks</h4>
              <ul className="space-y-2 text-zinc-400 text-left">
                {workGroups.slice(0, 4).map((g) => (
                  <li key={g.id} className="text-left">
                    <button
                      type="button"
                      onClick={() => setActiveWorkGroupModal(g)}
                      className="text-left hover:text-[#FF5722] cursor-pointer"
                    >
                      Group {g.groupNumber}: {g.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">Reference & Updates</h4>
              <p className="text-zinc-400 mb-3">
                Upload your hand-block photos or subscribe for VIP drops and ₹500 voucher.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageRefModal(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-zinc-900 hover:bg-[#FF5722] hover:text-white transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Photos</span>
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span>Subscribe for Updates</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© 2026 Rupal E-Commerce PWA. Copyright by Rupal Joshi. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Progressive Web App (PWA) Offline-Ready</span>
              <span>·</span>
              <span>Organic Vegetable & Mineral Fast Dyes</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Creation Blog & Details Modal */}
      {activeBlogCreation && (
        <CreationBlogModal
          creation={activeBlogCreation}
          onClose={() => setActiveBlogCreation(null)}
          products={PRODUCTS}
          workGroups={workGroups}
          onAddToCart={handleAddToCart}
          onSelectProduct={(p) => {
            setActiveBlogCreation(null);
            handleSelectProduct(p);
          }}
          customImages={customImages}
          onUploadCustomImage={handleUploadCustomImage}
          onResetCustomImage={handleResetCustomImage}
        />
      )}

      {/* 2. Work Group Small Tasks Modal */}
      {activeWorkGroupModal && (
        <WorkTasksModal
          workGroup={activeWorkGroupModal}
          onClose={() => setActiveWorkGroupModal(null)}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onFilterProductsByGroup={(groupId) => {
            scrollToShop('All', groupId);
          }}
          customImages={customImages}
          onUploadCustomImage={handleUploadCustomImage}
          onResetCustomImage={handleResetCustomImage}
        />
      )}

      {/* 4. Auth Modal (Login / Register) */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSuccess={(user) => {
            setCurrentUser({ name: user.name, email: user.email });
            if (user.cart && user.cart.length > 0) {
              setCart(user.cart);
            }
            if (user.wishlist && user.wishlist.length > 0) {
              setWishlist(user.wishlist);
            }
            showToast(`Welcome, ${user.name}!`);
          }}
        />
      )}

      {/* 5. Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          items={cart}
          currentUser={currentUser}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={() => {
            setCart([]);
            api.saveCart([]);
          }}
          customImages={customImages}
        />
      )}

      {/* 6. Image Reference Modal for swapping dummy photos */}
      {showImageRefModal && (
        <ImageReferenceModal
          onClose={() => setShowImageRefModal(false)}
          customImages={customImages}
          onUploadCustomImage={handleUploadCustomImage}
          onResetCustomImage={handleResetCustomImage}
          onResetAll={handleResetAllImages}
        />
      )}

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#111827] text-white px-4 py-3 shadow-xl border border-zinc-700 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-[#FF5722]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Mode Indicator */}
      {!isOnline && (
        <div className="fixed bottom-6 left-6 z-50 rounded-2xl bg-amber-600 text-white px-4 py-2.5 shadow-lg flex items-center gap-2 text-xs font-bold">
          <WifiOff className="w-4 h-4" />
          <span>Offline PWA Mode — Catalog cached</span>
        </div>
      )}
    </div>
  );
}
