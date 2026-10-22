import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, CheckCircle2, Truck, Loader2, ShieldCheck } from 'lucide-react';
import { Product, formatINR } from '../data/storeData';
import { SmartImage } from './SmartImage';
import { api, CreatedOrder } from '../services/api';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

interface CartDrawerProps {
  items: CartItem[];
  currentUser?: { name: string; email: string } | null;
  onClose: () => void;
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  customImages: Record<string, string>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  currentUser,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  customImages,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [checkoutError, setCheckoutError] = useState('');

  const subtotal = items.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 99;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    setCheckoutError('');
    setIsCheckingOut(true);

    try {
      const order = await api.createOrder({
        items,
        subtotal,
        shipping: shippingFee,
        discount: 0,
        total,
        paymentMethod: 'Cash On Delivery / UPI Express',
        shippingAddress: {
          name: currentUser?.name || 'Artisan Textile Patron',
          address: 'Prime Textile Cluster, Heritage Way',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380015',
        },
        customerName: currentUser?.name,
        customerEmail: currentUser?.email,
      });

      setCreatedOrder(order);
      onClearCart();
    } catch (err: any) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF5722]" />
            <h2 className="text-base font-extrabold text-zinc-900">
              Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress bar */}
        <div className="px-6 py-3 bg-[#FFF8F6] border-b border-[#FFEFEA] text-xs">
          {subtotal < freeShippingThreshold && subtotal > 0 ? (
            <div>
              <p className="text-zinc-700 font-medium">
                Add <span className="font-bold text-[#FF5722]">{formatINR(freeShippingThreshold - subtotal)}</span> more to get <strong>Free Shipping</strong>!
              </p>
              <div className="mt-1.5 h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF5722] rounded-full transition-all"
                  style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Truck className="w-4 h-4" />
              <span>You've unlocked Free Worldwide Shipping!</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {createdOrder ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-900">Order Confirmed!</h3>
                <p className="text-xs font-mono font-bold text-[#FF5722]">
                  {createdOrder.orderNumber}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-left text-xs space-y-2 max-w-xs mx-auto">
                <div className="flex justify-between text-zinc-500">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-600">{createdOrder.status}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Total Amount:</span>
                  <span className="font-black text-zinc-900">{formatINR(createdOrder.total)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Customer:</span>
                  <span className="font-medium text-zinc-700">{currentUser?.email || 'Guest Patron'}</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Saved to persistent backend database</span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Your artisan textile package is registered in our database and being prepared for dispatch.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCreatedOrder(null);
                  onClose();
                }}
                className="rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#FF5722] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-zinc-800">Your bag is currently empty</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Explore hand-block revivals, Sagwan blocks, and Bhimbetka motifs.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-4 p-3 rounded-2xl border border-zinc-100 bg-white hover:border-zinc-200 transition-colors shadow-2xs"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                    <SmartImage
                      src={item.product.image}
                      customKey={`prod-${item.product.id}`}
                      customImages={customImages}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-zinc-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id, item.size)}
                          className="text-zinc-400 hover:text-rose-500 cursor-pointer p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        Size: {item.size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-zinc-900">
                        {formatINR(item.product.price * item.quantity)}
                      </span>

                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                          className="p-1 hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                          className="p-1 hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !createdOrder && (
          <div className="p-6 border-t border-zinc-100 bg-zinc-50 space-y-3">
            {checkoutError && (
              <p className="text-xs text-rose-600 font-medium">{checkoutError}</p>
            )}

            <div className="space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-zinc-900">
                  {isFreeShipping ? 'FREE' : formatINR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FF5722] py-3.5 text-xs font-bold text-white shadow-lg hover:bg-[#E64A19] transition-all cursor-pointer disabled:opacity-75"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Order in Backend...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
