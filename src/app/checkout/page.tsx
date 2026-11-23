'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Stepper } from '@/components/ui/Stepper';
import { Modal } from '@/components/ui/Modal';
import { formatINR } from '@/lib/utils';
import { triggerConfetti } from '@/lib/confetti';
import {
  ShoppingCart,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Truck,
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, user, clearCart, addToast } = useAppStore();

  const [currentStep, setCurrentStep] = useState(0); // 0: Cart Review, 1: Address & Slot, 2: Invoice & Confirm
  const [address, setAddress] = useState('Plot 42, Action Area II, New Town, Kolkata, West Bengal - 700156');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [gstPercent, setGstPercent] = useState(18); // Configurable GST
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Math Calculations
  const subtotal = cart.reduce(
    (acc, item) => acc + (item.negotiatedPrice || item.price) * item.quantity,
    0
  );
  const totalNegotiationSavings = cart.reduce(
    (acc, item) =>
      item.negotiatedPrice && item.negotiatedPrice < item.price
        ? acc + (item.price - item.negotiatedPrice) * item.quantity
        : acc,
    0
  );
  const bulkDiscount = subtotal > 50000 ? Math.round(subtotal * 0.05) : 0;
  const taxableAmount = subtotal - bulkDiscount;
  const gstAmount = Math.round((taxableAmount * gstPercent) / 100);
  const deliveryFee = subtotal > 0 ? 1200 : 0;
  const stagingFee = 500;
  const highwayToll = subtotal > 0 ? 450 : 0; // Highway toll tax paid by builder/contractor
  const grandTotal = taxableAmount + gstAmount + deliveryFee + stagingFee + highwayToll;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: user?.id || 'user-contractor-1',
          items: cart,
          subtotal,
          gstAmount,
          deliveryFee,
          stagingFee,
          highwayToll,
          totalAmount: grandTotal,
          deliveryAddress: address,
          deliveryDate,
          deliveryTimeSlot: timeSlot,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPlacedOrder(data.order);
        clearCart();
        triggerConfetti();
        addToast({
          title: 'Order Placed Successfully!',
          message: `Order #${data.order.id.slice(0, 8)} sent to BuildNexus Central Warehouse.`,
          type: 'success',
        });
        setCurrentStep(2);
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to place order', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Checkout & Live Total Calculation
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400 mt-1">
            Itemized price transparency with GST & Central Warehouse staging breakdown.
          </p>
        </div>
        <Badge variant="verified">100% Tax Compliant Invoice</Badge>
      </div>

      <Stepper
        steps={[
          { label: 'Cart Items' },
          { label: 'Delivery & Slot' },
          { label: 'Invoice & Done' },
        ]}
        currentStep={currentStep}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: Steps Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 0: Cart Review */}
          {currentStep === 0 && (
            <Card className="p-6 space-y-4">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center justify-between">
                <span>Selected Construction Materials</span>
                <span className="text-xs text-slate-500 font-normal">{cart.length} items</span>
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">Your cart is empty.</p>
                  <Link href="/marketplace">
                    <Button variant="primary" className="mt-4">
                      Browse Materials Marketplace
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => {
                    const price = item.negotiatedPrice || item.price;
                    const hasNegotiatedDiscount =
                      item.negotiatedPrice && item.negotiatedPrice < item.price;
                    return (
                      <div
                        key={item.materialId}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700"
                      >
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-500">Supplier: {item.supplierName}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs font-bold text-brand-orange">
                              {item.quantity} {item.unit} × {formatINR(price)} = {formatINR(price * item.quantity)}
                            </span>
                            {hasNegotiatedDiscount && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded font-black border border-emerald-300 dark:border-emerald-700">
                                Negotiated Locked Deal
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="primary"
                    className="w-full mt-4"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Proceed to Delivery Date & Slot
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* STEP 1: Delivery Address & Time Slot */}
          {currentStep === 1 && (
            <Card className="p-6 space-y-5">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-orange" /> Delivery Location & Required Time Slot
              </h2>

              <Input
                label="Site Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Required Delivery Date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  leftIcon={<Calendar className="w-4 h-4" />}
                />

                <Select
                  label="Delivery Time Slot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  options={[
                    { value: '07:00 AM - 10:00 AM', label: 'Morning Slot (07:00 AM - 10:00 AM)' },
                    { value: '10:00 AM - 01:00 PM', label: 'Standard Slot (10:00 AM - 01:00 PM)' },
                    { value: '02:00 PM - 05:00 PM', label: 'Afternoon Slot (02:00 PM - 05:00 PM)' },
                  ]}
                />
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/40 p-4 rounded-2xl border border-orange-200 dark:border-orange-800 text-xs text-orange-900 dark:text-orange-200 flex items-start gap-2">
                <Truck className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">BuildNexus Central Warehouse Staging Guarantee</p>
                  <p>
                    All material shipments are consolidated at Dankuni / Howrah Central Warehouse Hub for quality audit before dispatching to your site.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setCurrentStep(0)} className="w-1/3">
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePlaceOrder}
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  Confirm Order & Generate Invoice
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 2: Invoice Preview & Order Confirmation */}
          {currentStep === 2 && placedOrder && (
            <Card className="p-6 space-y-6 bg-white dark:bg-slate-900 border-2 border-emerald-500">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <Badge variant="success">Order Placed & Scheduled</Badge>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Invoice #{placedOrder.id.slice(0, 8)}
                </h2>
                <p className="text-xs text-slate-500">
                  Scheduled for delivery on <span className="font-bold text-slate-900 dark:text-white">{placedOrder.deliveryDate}</span> ({placedOrder.deliveryTimeSlot})
                </p>
              </div>

              {/* Printable Invoice Summary Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50 dark:bg-slate-800/40 text-xs">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2 font-bold">
                  <span>Item Description</span>
                  <span>Total Rate</span>
                </div>
                {placedOrder.items?.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>{it.quantity}x Units @ {formatINR(it.unitPrice)}</span>
                    <span className="font-bold">{formatINR(it.quantity * it.unitPrice)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1 font-semibold">
                  <div className="flex justify-between">
                    <span>GST ({gstPercent}%)</span>
                    <span>{formatINR(placedOrder.gstAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warehouse Logistics</span>
                    <span>{formatINR(placedOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-brand-orange pt-1">
                    <span>Total Amount Paid</span>
                    <span>{formatINR(placedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/delivery" className="flex-1">
                  <Button variant="primary" className="w-full" leftIcon={<Truck className="w-4 h-4" />}>
                    Track Live Delivery
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download PDF Invoice
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT COL: Live Total Calculation Card */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4 sticky top-20 border-2 border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center justify-between">
              <span>Itemized Total</span>
              <Sparkles className="w-4 h-4 text-brand-orange" />
            </h3>

            {/* Live Animated Grand Total Display */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1 shadow-inner text-center">
              <span className="text-xs uppercase font-bold text-slate-400">Grand Total Amount</span>
              <p className="text-3xl font-black text-brand-orange tracking-tight transition-all">
                {formatINR(grandTotal)}
              </p>
              {bulkDiscount > 0 && (
                <span className="inline-block text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  🎉 Saved {formatINR(bulkDiscount)} Bulk Discount
                </span>
              )}
            </div>

            {/* Expandable Breakdown Button */}
            <button
              onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
              className="w-full text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800"
            >
              <span>How is this calculated?</span>
              {isBreakdownExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Breakdown Content */}
            {isBreakdownExpanded && (
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <div className="flex justify-between">
                  <span>Materials Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatINR(subtotal)}</span>
                </div>
                {totalNegotiationSavings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Supplier Locked Discount</span>
                    <span>-{formatINR(totalNegotiationSavings)}</span>
                  </div>
                )}
                {bulkDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Bulk Discount (5% &gt; ₹50k)</span>
                    <span className="font-semibold">-{formatINR(bulkDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST ({gstPercent}%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatINR(gstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics Transport Fee</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatINR(deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Warehouse Staging Fee</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatINR(stagingFee)}</span>
                </div>
                {highwayToll > 0 && (
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      Highway &amp; Expressway Toll <span className="text-[10px] text-brand-orange font-bold">(Paid by Builder)</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatINR(highwayToll)}</span>
                  </div>
                )}
                <div className="p-2.5 rounded-xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/60 text-[10px] text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-brand-orange">🛣️ Toll Allocation Terms:</span> When materials are supplied from supplier staging depots, en-route highway &amp; bridge tolls (Dankuni NH-19, Belghoria Expressway, Vidyasagar Setu) are paid by the contractor/buyer.
                </div>
              </div>
            )}

            {/* Configurable GST Selector */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Select
                label="Configurable GST Rate"
                value={gstPercent.toString()}
                onChange={(e) => setGstPercent(parseInt(e.target.value, 10))}
                options={[
                  { value: '18', label: '18% Standard GST Rate' },
                  { value: '12', label: '12% Special Tax Slab' },
                  { value: '5', label: '5% Essential Concession Rate' },
                ]}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
