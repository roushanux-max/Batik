import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Share2,
  Sparkles,
  Info,
  ChevronRight,
  Clock,
  Layers,
  Award,
  CheckCircle2,
  Circle,
  MessageSquare,
} from 'lucide-react';
import { Product, WorkGroup, formatINR, ProductReview } from '../data/storeData';
import { SmartImage } from './SmartImage';
import { api } from '../services/api';

interface ProductPageProps {
  product: Product;
  allProducts: Product[];
  workGroups: WorkGroup[];
  onBackToHome: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, quantity?: number) => void;
  onBuyNow: (product: Product, size: string, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  customImages: Record<string, string>;
  onUploadCustomImage: (key: string, dataUrl: string) => void;
  onResetCustomImage: (key: string) => void;
  onOpenWorkGroupModal?: (workGroup: WorkGroup) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  allProducts,
  workGroups,
  onBackToHome,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  customImages,
  onUploadCustomImage,
  onResetCustomImage,
  onOpenWorkGroupModal,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'care' | 'process'>('overview');

  // Customer Reviews state with pre-populated authentic craft reviews
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(
    product.customerReviewsList || [
      {
        id: 'rev-default-1',
        author: 'Sunita Mehra',
        location: 'Mumbai, Maharashtra',
        rating: 5,
        date: '12 Sept 2026',
        title: 'Superb artisan finish and handfeel',
        content: 'The drape and vegetable dye depth are remarkable. You can immediately feel the heritage difference compared to mass mill garments.',
        verified: true,
      },
    ]
  );

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');

  // Reset image and size when product changes & load backend reviews
  useEffect(() => {
    setActiveImage(product.image);
    setSelectedSize(product.sizes[0] || 'Standard');
    setQuantity(1);

    // Initial base reviews
    const baseReviews = product.customerReviewsList || [];
    setReviewsList(baseReviews);

    // Fetch persistent reviews from backend API
    api.getReviews(product.id).then((serverReviews) => {
      if (serverReviews && serverReviews.length > 0) {
        // Merge without duplicates
        setReviewsList((current) => {
          const existingIds = new Set(current.map((r) => r.id));
          const toAdd = serverReviews.filter((r) => !existingIds.has(r.id));
          return [...toAdd, ...current];
        });
      }
    }).catch((err) => console.warn('Could not load reviews:', err));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  const handleBuy = () => {
    onBuyNow(product, selectedSize, quantity);
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewContent.trim()) return;

    const author = newReviewAuthor.trim();
    const city = newReviewCity.trim() || 'India';
    const title = newReviewTitle.trim() || 'Verified Buyer Review';
    const content = newReviewContent.trim();
    const rating = newReviewRating;

    // Optimistically update UI
    const optimisticRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author,
      location: city,
      rating,
      date: 'Just now',
      title,
      content,
      verified: true,
    };

    setReviewsList((prev) => [optimisticRev, ...prev]);
    setNewReviewAuthor('');
    setNewReviewCity('');
    setNewReviewTitle('');
    setNewReviewContent('');
    setShowReviewForm(false);

    // Persist to backend database
    try {
      const saved = await api.postReview({
        productId: product.id,
        author,
        city,
        rating,
        title,
        content,
      });
      // Update with server assigned ID
      setReviewsList((prev) =>
        prev.map((r) => (r.id === optimisticRev.id ? { ...r, id: saved.id } : r))
      );
    } catch (err) {
      console.warn('Failed to save review in backend:', err);
    }
  };

  // Find linked Work Group
  const linkedWorkGroup = workGroups.find((w) => w.id === product.workGroupId);

  // Gallery items (lead image + gallery array)
  const galleryImages = [
    product.image,
    ...(product.gallery ? product.gallery.filter((img) => img !== product.image) : []),
  ];

  // Related products from same category or cluster
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.workGroupId === product.workGroupId))
    .slice(0, 4);

  // Discount calculation
  const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0;
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 pb-20">
      {/* 1. Breadcrumbs Bar */}
      <div className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-[69px] z-30">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 font-semibold text-zinc-700 hover:text-[#FF5722] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
            <span className="text-zinc-300">/</span>
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Shop
            </button>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-600 font-medium">{product.category}</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-900 font-bold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer"
              title="Share listing"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>{copiedUrl ? 'Copied Link!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Product Showcase (Left Gallery, Right Purchase Module) */}
      <main className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Multi-Angle Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-square sm:aspect-4/3 rounded-3xl overflow-hidden bg-white border border-zinc-200/90 shadow-sm group">
              <SmartImage
                src={activeImage}
                customKey={`prod-pdp-${product.id}`}
                customImages={customImages}
                onUploadCustomImage={onUploadCustomImage}
                onResetCustomImage={onResetCustomImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Status / Discount Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                      product.badgeType === 'discount'
                        ? 'bg-[#FF5722] text-white'
                        : 'bg-[#111827] text-white'
                    }`}
                  >
                    {product.badge}
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-500 text-white shadow-sm">
                    Heritage Bestseller
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 backdrop-blur-xs text-zinc-700 shadow-md hover:text-[#FF5722] transition-colors cursor-pointer z-10"
                aria-label="Toggle Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-[#FF5722] text-[#FF5722]' : ''
                  }`}
                />
              </button>

              {/* Subtle hover note */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full pointer-events-none">
                Hover top right to swap reference photo
              </div>
            </div>

            {/* Thumbnail Selection Row */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImage === img
                        ? 'border-[#FF5722] ring-2 ring-[#FF5722]/30 scale-102 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Craft Guarantee Box */}
            <div className="rounded-2xl bg-white border border-zinc-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center shrink-0 text-[#FF5722]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">
                    Craftmark Certified Authentic Weave
                  </h4>
                  <p className="text-zinc-500 mt-0.5 leading-relaxed">
                    Handmade by certified artisans in {product.origin}. Finished with botanical mordants and seasoned teakwood printing matrices.
                  </p>
                </div>
              </div>
              <div className="shrink-0 self-end sm:self-center">
                <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  100% Eco Mineral Dye
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {/* Header info */}
            <div>
              {/* Category & Origin kicker */}
              <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                <span className="text-[#FF5722] font-bold">{product.category}</span>
                <span className="text-zinc-300">·</span>
                <span>{product.origin}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 mt-2 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating and Social Proof */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/70">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-zinc-900">{product.rating}</span>
                </div>
                <span className="text-xs font-medium text-zinc-600">
                  Based on {product.reviews} verified artisan reviews
                </span>
                <span className="text-zinc-300">·</span>
                <span className="text-xs font-semibold text-emerald-600">
                  {product.inStock !== false ? 'In Stock' : 'Made to order'}
                </span>
              </div>

              {/* Price Block */}
              <div className="mt-5 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-zinc-900 tabular-nums">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg font-semibold text-zinc-400 line-through tabular-nums">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                  {discountAmount > 0 && (
                    <span className="ml-auto text-xs font-bold text-[#FF5722] bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
                      Save {formatINR(discountAmount)} ({discountPercent}% Off)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 font-medium">
                  Inclusive of all GST. Free insured express courier across India.
                </p>
              </div>
            </div>

            {/* Size / Format Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Select Format / Size
                </label>
                <span className="text-[11px] text-zinc-400">
                  {product.dimensions || 'Handcrafted specifications'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                        isSelected
                          ? 'border-[#FF5722] bg-white text-[#FF5722] ring-2 ring-[#FF5722]/20 shadow-xs'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add Actions */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center rounded-xl border border-zinc-200 bg-white p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-black text-zinc-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-[#111827] text-white hover:bg-[#FF5722]'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag · {formatINR(product.price * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                type="button"
                onClick={handleBuy}
                className="w-full py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FF5722] text-white hover:bg-[#E64A19] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Instant Checkout / Buy Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Value Trust Features Strip */}
            <div className="rounded-2xl bg-white border border-zinc-200/80 p-4 space-y-3 text-xs">
              <div className="flex items-center gap-3 text-zinc-700">
                <Truck className="w-4 h-4 text-[#FF5722] shrink-0" />
                <span>
                  <strong>Free Insured Shipping</strong> in 3–5 business days across India
                </span>
              </div>
              <div className="flex items-center gap-3 text-zinc-700">
                <RotateCcw className="w-4 h-4 text-[#FF5722] shrink-0" />
                <span>
                  <strong>7-Day Easy Exchange</strong> on all unworn items
                </span>
              </div>
              <div className="flex items-center gap-3 text-zinc-700">
                <ShieldCheck className="w-4 h-4 text-[#FF5722] shrink-0" />
                <span>
                  <strong>Cash on Delivery (COD)</strong> & Secure UPI / Card payments
                </span>
              </div>
            </div>

            {/* Linked Work Group Teaser */}
            {linkedWorkGroup && (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 border border-orange-200">
                    <img
                      src={linkedWorkGroup.image}
                      alt={linkedWorkGroup.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#FF5722] uppercase tracking-wider block">
                      CRAFT PROCESS GROUP {linkedWorkGroup.groupNumber}
                    </span>
                    <h5 className="text-xs font-bold text-zinc-900">{linkedWorkGroup.title}</h5>
                  </div>
                </div>
                {onOpenWorkGroupModal && (
                  <button
                    type="button"
                    onClick={() => onOpenWorkGroupModal(linkedWorkGroup)}
                    className="text-xs font-bold text-[#FF5722] hover:underline shrink-0 cursor-pointer"
                  >
                    View Tasks
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. Deep Specifications, Story & Process Tabs */}
        <section className="mt-16 pt-12 border-t border-zinc-200">
          {/* Segmented Tab Controls (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Craft Overview & Story
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Material & Technical Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('care')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'care'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Care & Maintenance
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('process')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'process'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Artisan Making Steps ({linkedWorkGroup?.smallTasks.length || 4})
            </button>
          </div>

          {/* Tab 1: Craft Overview & Story */}
          {activeTab === 'overview' && (
            <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-xl font-bold text-zinc-900">
                  Honoring 10,000 Years of Rock Art & Handloom Heritage
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{product.description}</p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Every single piece is shaped without mechanical mass duplication. Hand-stamped impressions carry subtle micro-variations in dye saturation, pressure, and pigment density—the hallmark of true human craft created across small artisan clusters in Central India.
                </p>

                {product.features && product.features.length > 0 && (
                  <div className="pt-4 space-y-2.5">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                      Distinctive Features
                    </h4>
                    <ul className="space-y-2">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700">
                          <CheckCircle2 className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="md:col-span-5 rounded-2xl bg-white border border-zinc-200/80 p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <Sparkles className="w-4 h-4 text-[#FF5722]" />
                  <span>Provenance Snapshot</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-500">Artisan Guild</span>
                    <span className="font-semibold text-zinc-900">{product.artisanName || 'Bhopal Heritage Guild'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-500">Cluster Region</span>
                    <span className="font-semibold text-zinc-900">{product.origin}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-500">Mordant / Ground</span>
                    <span className="font-semibold text-zinc-900">{product.dye}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-zinc-500">Dimensions</span>
                    <span className="font-semibold text-zinc-900">{product.dimensions || 'Custom Handloom Standard'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Material & Technical Matrix */}
          {activeTab === 'specs' && (
            <div className="pt-8 max-w-4xl space-y-6 animate-in fade-in duration-300">
              <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-6">Specification</th>
                      <th className="py-3.5 px-6">Studio Formulation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    <tr>
                      <td className="py-3.5 px-6 font-semibold text-zinc-700">Base Material</td>
                      <td className="py-3.5 px-6 text-zinc-900 font-medium">{product.material}</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-semibold text-zinc-700">Dye Chemistry</td>
                      <td className="py-3.5 px-6 text-zinc-900 font-medium">{product.dye}</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-semibold text-zinc-700">Artisan Cluster</td>
                      <td className="py-3.5 px-6 text-zinc-900 font-medium">{product.origin}</td>
                    </tr>
                    {product.highlights?.map((h, i) => (
                      <tr key={i}>
                        <td className="py-3.5 px-6 font-semibold text-zinc-700">{h.label}</td>
                        <td className="py-3.5 px-6 text-zinc-900 font-medium">{h.value}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-3.5 px-6 font-semibold text-zinc-700">Eco Invariant</td>
                      <td className="py-3.5 px-6 text-zinc-900 font-medium">Zero synthetic azo dyes, 100% biodegradable botanical runoff</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Care & Maintenance */}
          {activeTab === 'care' && (
            <div className="pt-8 max-w-3xl space-y-5 animate-in fade-in duration-300">
              <div className="rounded-2xl bg-white border border-zinc-200/80 p-6 space-y-4">
                <h4 className="text-base font-bold text-zinc-900">
                  Preserving Botanical Pigments & Handloom Fibers
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {product.careInstructions ||
                    'Gentle hand wash in cold water using mild eco-friendly liquid detergent or soapnut (reetha) water. Do not bleach or wring. Dry flat in natural shade to preserve pigment depth.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-200/60 text-xs">
                    <span className="font-bold text-zinc-900 block mb-1">Cold Water Wash</span>
                    <span className="text-zinc-500">Prevents tannin migration and protects metallic zari luster.</span>
                  </div>
                  <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-200/60 text-xs">
                    <span className="font-bold text-zinc-900 block mb-1">Dry in Shade</span>
                    <span className="text-zinc-500">Avoid harsh noon sunlight to keep vegetable colors deep and vibrant.</span>
                  </div>
                  <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-200/60 text-xs">
                    <span className="font-bold text-zinc-900 block mb-1">Low Steam Reverse</span>
                    <span className="text-zinc-500">Iron on the reverse side to protect hand-carved block relief lines.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Artisan Making Steps */}
          {activeTab === 'process' && (
            <div className="pt-8 max-w-3xl space-y-4 animate-in fade-in duration-300">
              {linkedWorkGroup ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white border border-zinc-200/80 p-5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#FF5722] uppercase tracking-wider">
                        WORK GROUP {linkedWorkGroup.groupNumber}
                      </span>
                      <h4 className="text-base font-bold text-zinc-900">{linkedWorkGroup.title}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">{linkedWorkGroup.summary}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {linkedWorkGroup.smallTasks.map((t, idx) => (
                      <div
                        key={t.id}
                        className="rounded-xl bg-white border border-zinc-200/70 p-4 flex items-start gap-3.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#FF5722] text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-zinc-900">{t.title}</h5>
                            <span className="text-[11px] text-zinc-400 font-mono">{t.duration}</span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">{t.detail}</p>
                        </div>
                        {t.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-white border border-zinc-200 p-6 text-center text-xs text-zinc-500">
                  Standard artisan guild workflow applies.
                </div>
              )}
            </div>
          )}
        </section>

        {/* 4. Verified Customer Reviews Section */}
        <section className="mt-16 pt-12 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                COMMUNITY VOICES
              </span>
              <h2 className="text-2xl font-black text-zinc-900 mt-1">
                Verified Buyer Reviews ({reviewsList.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Interactive Review Form */}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-8 rounded-3xl bg-white border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-4 max-w-2xl animate-in fade-in duration-200"
            >
              <h3 className="text-sm font-bold text-zinc-900">Share your craft experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={newReviewCity}
                    onChange={(e) => setNewReviewCity(e.target.value)}
                    placeholder="e.g. Pune, MH"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewReviewRating(st)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          st <= newReviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-zinc-700">
                    {newReviewRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Outstanding weave texture and color"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                  Detailed Feedback *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReviewContent}
                  onChange={(e) => setNewReviewContent(e.target.value)}
                  placeholder="How does the fabric drape? How was the packaging and natural dye fragrance?"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-[#111827] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#FF5722] transition-colors cursor-pointer"
              >
                Post Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl bg-white border border-zinc-200/80 p-5 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400' : 'text-zinc-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">{rev.date}</span>
                </div>

                <h4 className="text-xs font-bold text-zinc-900">{rev.title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{rev.content}</p>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-zinc-800">
                    {rev.author} · <span className="text-zinc-400 font-normal">{rev.location}</span>
                  </span>
                  {rev.verified && (
                    <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Related Product Listings (Clicking opens their dedicated page, NO POPUP!) */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-zinc-200">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                  DISCOVER MORE
                </span>
                <h2 className="text-2xl font-black text-zinc-900 mt-1">
                  You May Also Appreciate
                </h2>
              </div>
              <button
                type="button"
                onClick={onBackToHome}
                className="text-xs font-bold text-zinc-700 hover:text-[#FF5722] transition-colors cursor-pointer"
              >
                Explore All Products →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="group rounded-2xl bg-white p-3 border border-zinc-200/80 hover:border-zinc-300 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-zinc-50 relative">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {rel.badge && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-zinc-900 text-white text-[10px] font-bold uppercase">
                          {rel.badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#FF5722] transition-colors truncate mt-0.5">
                        {rel.name}
                      </h4>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-zinc-900">
                          {formatINR(rel.price)}
                        </span>
                        {rel.originalPrice && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            {formatINR(rel.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-bold text-zinc-600 group-hover:text-[#FF5722]">
                    <span>View Product</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 6. Mobile Sticky Bottom Buy Bar (Under 15% Mobile Sticky Cap) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-4 py-3 sm:hidden shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-zinc-900 truncate">{product.name}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-zinc-900">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-zinc-400 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`py-2.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer ${
            addedSuccess ? 'bg-emerald-600 text-white' : 'bg-[#111827] text-white hover:bg-[#FF5722]'
          }`}
        >
          {addedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
