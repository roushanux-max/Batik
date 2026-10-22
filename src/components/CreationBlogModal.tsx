import React from 'react';
import { X, Clock, MapPin, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { HeroCreation, Product, WorkGroup, formatINR } from '../data/storeData';
import { SmartImage } from './SmartImage';

interface CreationBlogModalProps {
  creation: HeroCreation;
  onClose: () => void;
  products: Product[];
  workGroups: WorkGroup[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  customImages: Record<string, string>;
  onUploadCustomImage: (key: string, dataUrl: string) => void;
  onResetCustomImage: (key: string) => void;
}

export const CreationBlogModal: React.FC<CreationBlogModalProps> = ({
  creation,
  onClose,
  products,
  workGroups,
  onAddToCart,
  onSelectProduct,
  customImages,
  onUploadCustomImage,
  onResetCustomImage,
}) => {
  const relatedProducts = products.filter((p) =>
    creation.blogPost.relatedProductIds.includes(p.id)
  );

  const relatedWorkGroups = workGroups.filter((w) =>
    creation.blogPost.relatedWorkGroupIds.includes(w.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-zinc-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#FF5722] tracking-wider uppercase">
              {creation.tag}
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-xs text-zinc-500 font-medium">{creation.shortTitle} Craft Blog</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10 sm:py-8 space-y-8">
          {/* Hero Banner inside Blog */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mb-3">
              <span className="inline-flex items-center gap-1 font-medium text-zinc-700">
                <Clock className="w-3.5 h-3.5 text-[#FF5722]" />
                {creation.readTime}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 font-medium text-zinc-700">
                <MapPin className="w-3.5 h-3.5 text-[#FF5722]" />
                {creation.cluster}
              </span>
              <span>·</span>
              <span>By {creation.blogPost.author} ({creation.blogPost.role})</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              {creation.title}
            </h1>
            <p className="mt-3 text-base text-zinc-600 leading-relaxed max-w-2xl">
              {creation.subtitle}
            </p>
          </div>

          {/* Main Visual Frame */}
          <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
            <SmartImage
              src={creation.blogHeroImage || creation.heroImage}
              customKey={`hero-blog-${creation.id}`}
              customImages={customImages}
              onUploadCustomImage={onUploadCustomImage}
              onResetCustomImage={onResetCustomImage}
              alt={creation.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Lead Paragraph */}
          <p className="text-base sm:text-lg text-zinc-800 leading-relaxed font-medium border-l-4 border-[#FF5722] pl-4 italic">
            "{creation.blogPost.lead}"
          </p>

          {/* Technical Specs Grid */}
          <div className="rounded-2xl bg-zinc-50 p-6 border border-zinc-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF5722] tracking-wider uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              <span>TEXTILE MATERIAL SPECIFICATIONS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creation.blogPost.specs.map((spec, i) => (
                <div key={i} className="border-b border-zinc-200/60 pb-2.5">
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase">{spec.label}</div>
                  <div className="text-sm font-bold text-zinc-900 mt-0.5">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Chapters */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-zinc-900">Creation & Craft Process Chapters</h2>
            <div className="space-y-5">
              {creation.blogPost.chapters.map((ch, idx) => (
                <div key={idx} className="rounded-2xl border border-zinc-200 p-5 bg-white space-y-2.5">
                  <h3 className="text-base font-bold text-zinc-900">{ch.title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{ch.body}</p>
                  <div className="text-xs bg-[#FFF5F2] text-[#D84315] font-medium p-3 rounded-xl border border-[#FFE0D6]">
                    <strong>Craft Master Note:</strong> {ch.craftTip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Work Groups Breakdown */}
          {relatedWorkGroups.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-lg font-bold text-zinc-900">Execution Work Groups for This Creation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedWorkGroups.map((wg) => (
                  <div key={wg.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] font-bold text-[#FF5722]">WORK GROUP {wg.groupNumber}</span>
                    <h4 className="text-sm font-bold text-zinc-900 mt-0.5">{wg.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{wg.summary}</p>
                    <span className="inline-block text-[11px] text-zinc-600 font-semibold mt-2">
                      {wg.smallTasks.length} micro-tasks defined
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shoppable Products from this creation */}
          {relatedProducts.length > 0 && (
            <div className="pt-4 border-t border-zinc-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">Shop Items From This Creation</h2>
                  <p className="text-xs text-zinc-500">Handcrafted in our partner artisan clusters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="group/card rounded-2xl border border-zinc-200 p-3 bg-white hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div
                        onClick={() => {
                          onClose();
                          onSelectProduct(p);
                        }}
                        className="aspect-square rounded-xl overflow-hidden bg-zinc-100 cursor-pointer"
                      >
                        <SmartImage
                          src={p.image}
                          customKey={`prod-${p.id}`}
                          customImages={customImages}
                          onUploadCustomImage={onUploadCustomImage}
                          onResetCustomImage={onResetCustomImage}
                          alt={p.name}
                        />
                      </div>
                      <div className="mt-2.5">
                        <span className="text-[10px] font-medium text-zinc-400">{p.category}</span>
                        <h4
                          onClick={() => {
                            onClose();
                            onSelectProduct(p);
                          }}
                          className="text-xs font-bold text-zinc-900 group-hover/card:text-[#FF5722] cursor-pointer line-clamp-1"
                        >
                          {p.name}
                        </h4>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-900">{formatINR(p.price)}</span>
                      <button
                        type="button"
                        onClick={() => onAddToCart(p)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#FF5722] transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Close / Action Bar */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
          >
            ← Back to Storefront
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#111827] px-5 py-2 text-xs font-bold text-white hover:bg-[#FF5722] transition-colors cursor-pointer"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
