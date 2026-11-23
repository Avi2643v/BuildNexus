# 🏗️ BuildNexus — The Digital Era of Construction

> **"Build smarter. Pay fairly."**  
> A next-generation digital construction platform connecting **Contractors/Builders**, **Laborers (and Sardars/team heads)**, **Material Suppliers**, and **Delivery Agents**, with an **BuildNexus Central Warehouse and Admin** in the middle.

---

## 🌟 Core Value Proposition & Principles
1. **Zero Unnecessary Middlemen**: Direct buyer-to-supplier and builder-to-laborer workflows eliminate exploitative broker cuts.
2. **100% Guaranteed Fair Wages**: Laborers receive their full promised wages without contractor deduction; Sardars supervise teams with transparent split ledgers.
3. **Private In-App Negotiation**: Price negotiation happens inside private chat where phone numbers and contact details are automatically masked.
4. **Centralized Warehouse Staging**: All material deliveries route through the BuildNexus Central Warehouse (Yeshwanthpur) for quality inspection before final dispatch.
5. **Mobile-First & WCAG Accessible**: High-contrast large tap targets (44px min), Inter font, icon-first labels for low-literacy users, and multi-language support (**English, Hindi, Kannada**).

---

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Design System**: Navy `#0F172A`, Orange `#EA580C`, Slate `#475569`, Light `#F8FAFC`, Border `#E2E8F0`
- **Animations & Icons**: Framer Motion + Lucide-React
- **State & Forms**: Zustand + React Hook Form + Zod
- **Backend & Database**: Next.js API Routes + Prisma ORM + SQLite (`dev.db`)
- **Document Generation**: jsPDF (PDF Invoices & Khata Reports) + XLSX (Excel Ledgers)
- **i18n Localization**: English (`en.json`), Hindi (`hi.json`), Kannada (`kn.json`)

---

## 🚀 Quick Setup & Run Instructions

```bash
# 1. Install dependencies
npm install

# 2. Push Prisma DB Schema
npx prisma db push

# 3. Seed Realistic Demo Data (5 Suppliers, 20+ Materials, 30+ Laborers, Orders, Chats)
npx tsx prisma/seed.ts

# 4. Start Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Logins & User Personas

| Role | Demo User Name | Demo Mobile | Masked ID | Verified Badge |
|---|---|---|---|---|
| **Contractor / Builder** | Rajesh Sharma | `9876543210` | `XXXX XXXX 4912` | ✅ Verified |
| **Laborer / Sardar Head** | Ramesh Sardar & Team | `9876543211` | `XXXX XXXX 8831` | ✅ Verified |
| **Material Supplier** | Lakshmi Building Supplies | `9876543212` | `XXXXX 1234 P` | ✅ Verified |
| **Delivery Agent** | Vikram Express Logistics | `9876543213` | `XXXX XXXX 9081` | ✅ Verified |
| **BuildNexus Admin** | BuildNexus Staff Admin | `9876543214` | `XXXX XXXX 0001` | ✅ Super Admin |

*Tip: Use the top bar role switcher or the one-click demo login buttons on the `/auth/login` page to switch personas instantly.*

---

## 📋 Comprehensive Presentation Walkthrough Script

### Step 1: Simulated Government ID Authentication (`/auth/login`)
1. Select role (e.g., Contractor).
2. Enter simulated Aadhaar/PAN number.
3. Receive mock OTP (`123456`).
4. Watch animated Government DB verification and generate a green `ID Verified` badge with a masked ID (`XXXX XXXX 1234`).

### Step 2: Materials Marketplace & Transparent Price Comparison (`/marketplace`)
1. Filter by category (Cement, Steel, Bricks, Sand).
2. Click **⚡ Compare Prices** on any item to view transparent side-by-side rates across all suppliers.
3. Click **Add to Cart** with quantity stepper.

### Step 3: Private Negotiation & In-App Deal Verification (`/chat`)
1. Open chat with a supplier.
2. Type a message containing phone numbers (e.g., `Call me at 9876543210`) — notice privacy auto-masking in action!
3. Click **Make Offer** (Price: ₹365, Qty: 500 bags).
4. Recipient accepts offer → Deal status moves to `Approved by Supplier` → Admin verifies it → Click **Add to Cart at Negotiated Rate**.

### Step 4: Itemized Calculation & Checkout (`/checkout`)
1. Review itemized calculation breakdown: Materials Subtotal, Bulk Discount, 18% GST, Warehouse Logistics Fee, and Grand Total.
2. Select required delivery date & time slot.
3. Confirm order to generate printable PDF invoice, auto-create delivery tracking record, and create a Digital Khata entry!

### Step 5: Labour Discovery, Availability Check & Dated Booking (`/labour`)
1. Browse Brick Jointers, Brick Breakers, Masala Mixers, Material Coolies, and Sardar Squads.
2. Inspect the **Real-time Slot Availability Heatmap** ("3 of 5 Available").
3. View the **Fair Wage Guarantee** and expand the **Sardar Wage Split** (Worker: ₹750/day, Supervisor: ₹50, Platform cut: ₹0).
4. Select date range and workers count -> system auto-computes cost -> Confirm booking!

### Step 6: Contractor Digital Notebook "Khata" (`/notebook`)
1. View daily site attendance, material receipts, and payments.
2. Use **Voice-to-Text (Web Speech API)** to record notes hands-free.
3. Check the **Labor Payment Ledger** (Wage Promised vs Wage Paid).
4. Export full ledger to PDF or Excel.

### Step 7: Central Warehouse Delivery Tracking & Case Checklist (`/delivery`)
1. Switch to Delivery Agent -> Verify checklist (Item matches, quality inspected) -> Enter contractor OTP (`4921`).
2. Switch to Contractor -> View live simulated map with moving delivery truck and ETA.
3. Raise a dispute case for damaged/short items.

### Step 8: Contractor Selling Surplus Materials (`/sell`)
1. Contractor lists leftover TMT steel / cement.
2. Listing appears in the marketplace tagged with **"Sold by Contractor"**.
3. All surplus materials route through BuildNexus Central Warehouse for inspection upon dispatch.

### Step 9: Central Admin Command & About Page (`/admin` & `/about`)
1. Admin queues: User approvals, Deal verifications, Warehouse staging bays, Price trend monitor, and Dispute resolution.
2. View revenue streams monetization model (Subscriptions, Logistics, Boosted Listings, Commission).
3. Explore the **About BuildNexus** pitch deck page with team cards, target market, and strategic roadmap.

