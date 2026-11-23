import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export const MiniCartDrawer: React.FC = () => {
  const { cart, isCartDrawerOpen, setCartDrawerOpen, updateCartQty, removeFromCart } =
    useAppStore();

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.negotiatedPrice || item.price) * item.quantity,
    0
  );
  const totalSavings = cart.reduce(
    (acc, item) =>
      item.negotiatedPrice && item.negotiatedPrice < item.price
        ? acc + (item.price - item.negotiatedPrice) * item.quantity
        : acc,
    0
  );
  const gst = Math.round(subtotal * 0.18);
  const deliveryFee = subtotal > 0 ? 1200 : 0;
  const highwayToll = subtotal > 0 ? 450 : 0; // Highway toll tax paid by builder/contractor
  const grandTotal = subtotal + gst + deliveryFee + highwayToll;

  return (
    <BottomSheet
      isOpen={isCartDrawerOpen}
      onClose={() => setCartDrawerOpen(false)}
      title={`Your Construction Cart (${cart.length} items)`}
    >
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
            Your cart is currently empty.
          </p>
          <Button
            onClick={() => setCartDrawerOpen(false)}
            variant="outline"
            className="mt-4"
          >
            Browse Materials Catalog
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {cart.map((item) => {
              const currentPrice = item.negotiatedPrice || item.price;
              const hasNegotiatedDiscount =
                item.negotiatedPrice && item.negotiatedPrice < item.price;
              return (
                <div
                  key={item.materialId}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Supplier: {item.supplierName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-xs font-extrabold text-brand-orange">
                        {formatINR(currentPrice)} / {item.unit}
                      </span>
                      {hasNegotiatedDiscount && (
                        <>
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatINR(item.price)}
                          </span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded font-black border border-emerald-300 dark:border-emerald-700">
                            Supplier Locked Rate
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-1.5 py-1">
                    <button
                      onClick={() => updateCartQty(item.materialId, item.quantity - 1)}
                      className="p-1 text-slate-500 hover:text-slate-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.materialId, item.quantity + 1)}
                      className="p-1 text-slate-500 hover:text-slate-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.materialId)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Itemized Price Summary */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Materials Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {formatINR(subtotal)}
              </span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Negotiation Savings (Supplier Locked)</span>
                <span>-{formatINR(totalSavings)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>GST (18% Configurable)</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {formatINR(gst)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>BuildNexus Warehouse Logistics Fee</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {formatINR(deliveryFee)}
              </span>
            </div>
            {highwayToll > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  Highway &amp; Expressway Toll <span className="text-[10px] text-brand-orange font-bold">(Paid by Builder)</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatINR(highwayToll)}
                </span>
              </div>
            )}
            <div className="p-2 rounded-xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/60 text-[10px] text-slate-600 dark:text-slate-300">
              ℹ️ <strong>Toll Terms:</strong> En-route highway and bridge tolls for material supply are paid by the contractor/buyer.
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-extrabold text-slate-900 dark:text-white">
              <span>Grand Total</span>
              <span className="text-brand-orange text-base">{formatINR(grandTotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            onClick={() => setCartDrawerOpen(false)}
            className="block w-full mt-4"
          >
            <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Proceed to Itemized Checkout ({formatINR(grandTotal)})
            </Button>
          </Link>
        </div>
      )}
    </BottomSheet>
  );
};
