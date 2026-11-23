/**
 * BuildNexus Executive Project Report PDF Generator
 * Generates a clean, highly structured, multi-page professional PDF report for all team members.
 */
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function createProjectReport() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2); // 174mm

  let currentPage = 1;

  // Color Palette
  const colors = {
    navyDark: [15, 23, 42],      // #0F172A
    navyCard: [30, 41, 59],      // #1E293B
    orangePrimary: [234, 88, 12],// #EA580C
    orangeLight: [255, 247, 237],// #FFF7ED
    emerald: [16, 185, 129],     // #10B981
    emeraldBg: [236, 253, 245],  // #ECFDF5
    blueAccent: [37, 99, 235],   // #2563EB
    blueBg: [239, 246, 255],     // #EFF6FF
    slateText: [71, 85, 105],    // #475569
    slateMuted: [148, 163, 184], // #94A3B8
    borderLight: [226, 232, 240],// #E2E8F0
    white: [255, 255, 255],
    lightBg: [248, 250, 252]     // #F8FAFC
  };

  // Helper: Header on inner pages
  function drawPageHeader(title) {
    doc.setFillColor(...colors.navyDark);
    doc.rect(0, 0, pageWidth, 16, 'F');

    doc.setTextColor(...colors.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('BUILDNEXUS  |  EXECUTIVE PROJECT REPORT', margin, 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.slateMuted);
    doc.text(title.toUpperCase(), pageWidth - margin, 10, { align: 'right' });

    // Thin accent orange bar
    doc.setFillColor(...colors.orangePrimary);
    doc.rect(0, 16, pageWidth, 1.2, 'F');
  }

  // Helper: Footer on all pages
  function drawPageFooter(pageNum, totalPages = 6) {
    const y = pageHeight - 12;
    doc.setDrawColor(...colors.borderLight);
    doc.setLineWidth(0.4);
    doc.line(margin, y - 2, pageWidth - margin, y - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.slateMuted);
    doc.text('BuildNexus ConTech Platform  *  Confidential & Proprietary', margin, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, y + 4, { align: 'right' });
  }

  // Helper: Section Title
  function drawSectionHeader(title, y, icon = '') {
    doc.setFillColor(...colors.orangePrimary);
    doc.rect(margin, y, 4, 10, 'F');

    doc.setTextColor(...colors.navyDark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`${icon ? icon + '  ' : ''}${title}`, margin + 7, y + 7.5);

    return y + 15;
  }

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Background Header Block
  doc.setFillColor(...colors.navyDark);
  doc.rect(0, 0, pageWidth, 140, 'F');

  // Decorative Accent Bar
  doc.setFillColor(...colors.orangePrimary);
  doc.rect(0, 140, pageWidth, 4, 'F');

  // Badge on cover
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, 25, 68, 8, 3, 3, 'F');
  doc.setTextColor(...colors.orangePrimary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('* CONTECH DIGITAL PLATFORM', margin + 4, 30.5);

  // Big Title
  doc.setTextColor(...colors.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('BuildNexus', margin, 52);

  doc.setFontSize(16);
  doc.setTextColor(...colors.orangePrimary);
  doc.text('Comprehensive Project Report & Architecture Guide', margin, 64);

  // Subtitle / Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...colors.slateMuted);
  const taglines = [
    'A Unified Digital Ecosystem Connecting Contractors, Material Suppliers,',
    'Specialized Trade Squads, Homeowners, and Fleet Carriers with 100% Fair Pay,',
    'Transparent Wholesale Rates, and Net-Zero Transit Logistics.'
  ];
  doc.text(taglines, margin, 78);

  // Key Value Metric Badges on Cover
  const coverStats = [
    { label: 'Role Portals', val: '5 Distinct' },
    { label: 'Fair Wage Guarantee', val: '100% Direct' },
    { label: 'Logistics Policy', val: 'Buyer Tolls' },
    { label: 'Platform Cut on Labor', val: '0% Broker' }
  ];

  let statX = margin;
  coverStats.forEach(s => {
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(statX, 102, 38, 20, 2, 2, 'F');
    doc.setTextColor(...colors.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(s.val, statX + 19, 111, { align: 'center' });
    doc.setTextColor(...colors.slateMuted);
    doc.setFontSize(7.5);
    doc.text(s.label, statX + 19, 117, { align: 'center' });
    statX += 45;
  });

  // Cover Meta Box (Bottom Half)
  doc.setFillColor(...colors.lightBg);
  doc.rect(0, 144, pageWidth, pageHeight - 144, 'F');

  doc.setFillColor(...colors.white);
  doc.roundedRect(margin, 160, contentWidth, 105, 4, 4, 'FD');
  doc.setDrawColor(...colors.borderLight);

  doc.setTextColor(...colors.navyDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Document Overview & Metadata', margin + 8, 172);

  const metaRows = [
    ['Project Name', 'BuildNexus Construction Technology Platform (Web Application)'],
    ['Version', 'Release 1.0 (Production Architecture Ready)'],
    ['Target Operating Region', 'West Bengal (Kolkata, Howrah, Hooghly, Dankuni, Durgapur)'],
    ['Core Stakeholders', 'Contractors / Builders, Suppliers, Labourers / Sardars, Homeowners, Admin'],
    ['Technology Foundation', 'Next.js 14, TypeScript, Prisma ORM, Tailwind CSS, SQLite, jsPDF'],
    ['Document Prepared For', 'All Project Members, Technical Stakeholders, & Project Evaluators'],
    ['Date of Generation', 'October 2026']
  ];

  let metaY = 182;
  metaRows.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...colors.slateText);
    doc.text(k + ':', margin + 8, metaY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.navyDark);
    doc.text(v, margin + 55, metaY);
    metaY += 10.5;
  });

  drawPageFooter(1, 6);

  // ==========================================
  // PAGE 2: EXECUTIVE SUMMARY & PROBLEM STATEMENT
  // ==========================================
  doc.addPage();
  currentPage = 2;
  drawPageHeader('Executive Summary & Market Problem');

  let y = 28;
  y = drawSectionHeader('1. Executive Summary', y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.slateText);
  const execSummary = [
    'BuildNexus is an end-to-end digital construction operating system (ConTech) engineered to address',
    'the multi-tiered inefficiencies of India\'s civil construction sector. Traditionally characterized by opaque',
    'broker markups, unfair daily wage deductions, untracked transit tolls, and delayed supply-chain deliveries,',
    'the industry suffers massive cost leakage of 12-18% per project.',
    '',
    'BuildNexus unifies five foundational stakeholders under transparent, real-time digital interfaces:',
    '* Contractors & Builders: Manage procurement, stock depletion burn horizons, and worker squads.',
    '* Material Suppliers: Showcase real-time rate decks and buy back excess site materials.',
    '* Skilled Trade Labourers: Receive verified job bookings on sq.ft basis with guaranteed 100% fair pay.',
    '* Homeowners & Clients: Discover verified turnkey builders and trade squads with strict confidentiality.',
    '* BuildNexus Central Admin: Monitor escrow transactions, staging depots, and Fastag transit audits.'
  ];
  doc.text(execSummary, margin, y);
  y += 56;

  y = drawSectionHeader('2. Key Construction Industry Problems vs BuildNexus Solutions', y);

  // Comparison Grid
  const compCards = [
    {
      problem: 'Uncontrolled Broker Markups',
      probDesc: 'Up to 15% added cost on cement and rebar through 3-tier sub-dealers.',
      sol: 'Direct Supplier Catalog & Live Bidding',
      solDesc: 'Wholesale live rate decks with dynamic slab volume discounts.'
    },
    {
      problem: 'Labour Exploitation & Wage Theft',
      probDesc: 'Labourers lose 20-30% daily wages to middlemen recruiters and Sardars.',
      sol: '100% Direct Fair Wage Guarantee',
      solDesc: 'Transparent sq.ft wage computation, phone confirmation & zero broker cuts.'
    },
    {
      problem: 'Sudden Material Stock-Outs',
      probDesc: 'Unmonitored site stock causes sudden work stoppage and labor idle costs.',
      sol: 'Site Stock Depletion Monitor',
      solDesc: 'Real-time burn rate horizon countdown and one-click re-order buffers.'
    },
    {
      problem: 'Transit Toll Disputes & Confusion',
      probDesc: 'Suppliers get deductions from material earnings due to highway toll fares.',
      sol: 'Protected Net Catalog Payouts',
      solDesc: 'En-route highway tolls explicitly billed to and paid by the Buyer/Contractor.'
    }
  ];

  compCards.forEach(card => {
    // Left Box: Problem
    doc.setFillColor(254, 242, 242); // Rose light
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, y, (contentWidth / 2) - 2, 26, 2, 2, 'FD');

    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`[X] Problem: ${card.problem}`, margin + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.slateText);
    const probLines = doc.splitTextToSize(card.probDesc, (contentWidth / 2) - 10);
    doc.text(probLines, margin + 4, y + 12);

    // Right Box: Solution
    const rightX = margin + (contentWidth / 2) + 2;
    doc.setFillColor(...colors.emeraldBg);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(rightX, y, (contentWidth / 2) - 2, 26, 2, 2, 'FD');

    doc.setTextColor(4, 120, 87);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`[OK] Solution: ${card.sol}`, rightX + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.slateText);
    const solLines = doc.splitTextToSize(card.solDesc, (contentWidth / 2) - 10);
    doc.text(solLines, rightX + 4, y + 12);

    y += 29;
  });

  drawPageFooter(2, 6);

  // ==========================================
  // PAGE 3: FIVE DEDICATED STAKEHOLDER PORTALS
  // ==========================================
  doc.addPage();
  currentPage = 3;
  drawPageHeader('Stakeholder Architecture & Dedicated Portals');

  y = 28;
  y = drawSectionHeader('3. Dedicated Role Dashboards & Tailored Interfaces', y);

  const roles = [
    {
      title: '1. Contractor / Builder Portal (Joyjit Constructions)',
      badge: 'PWD Class-A Licensed',
      color: colors.orangePrimary,
      bgColor: colors.orangeLight,
      desc: 'Command center for active building projects across New Town, Salt Lake & Rajarhat.',
      features: [
        'Materials Procurement: Real-time price comparisons across Dankuni & Kona staging yards.',
        'Two-Way Supplier Negotiations: Vice-versa deal desk displaying changed prices & cart savings.',
        'Excess Stock Buyback (/sell): Sell surplus cement, steel, or bricks back to verified suppliers.',
        'Site Stock Depletion Monitor (/stock): Real-time burn rate countdown preventing site stoppages.',
        'Inbound Telematics & Delivery OTP: Secure 4-digit code handover to carrier drivers.'
      ]
    },
    {
      title: '2. Material Supplier Portal (Lakshmi Building Supplies)',
      badge: 'Dankuni Central Yard',
      color: [147, 51, 234], // Purple
      bgColor: [250, 245, 255],
      desc: 'Wholesale material rate cards, live builder request desk, and outbound consignment logistics.',
      features: [
        'Live Rate Deck (/marketplace): Published base rates, volume discount slabs, and hub location.',
        'Builder Buyback Desk: Inspect and bid on surplus materials posted by builders.',
        'Live Builder Request Desk: Negotiate quotes with instant counter-proposals.',
        'Builder Credit Rankings: Track punctuality scores and monthly inward volumes.',
        'Outbound Fleet Dispatch: Carrier flatbed assignments with OTP delivery proof.'
      ]
    },
    {
      title: '3. Labour & Specialized Trade Squads (Subhas Sardar & Team)',
      badge: 'Govt Licensed Electricians',
      color: colors.emerald,
      bgColor: colors.emeraldBg,
      desc: 'Transparent work bookings window with wage rates calculated strictly as per sq.ft area.',
      features: [
        'Sq.Ft Area Job Windows: Specific work area (e.g. 1,200 sq.ft) with explicit rate per sq.ft.',
        'Direct Fair Wage Guarantee: Zero supervisor split deduction; 100% fair take-home pay.',
        'Two-Way Counter Rate Proposals: Submit wage counters directly to contracting builders.',
        'Official Verification Call: BuildNexus team phone verification scheduled upon job acceptance.'
      ]
    }
  ];

  roles.forEach(role => {
    doc.setFillColor(...role.bgColor);
    doc.setDrawColor(...colors.borderLight);
    doc.roundedRect(margin, y, contentWidth, 54, 3, 3, 'FD');

    // Title strip
    doc.setFillColor(...role.color);
    doc.rect(margin, y, 3, 54, 'F');

    doc.setTextColor(...colors.navyDark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(role.title, margin + 6, y + 7);

    doc.setFontSize(7.5);
    doc.setTextColor(...role.color);
    doc.text(role.badge.toUpperCase(), pageWidth - margin - 4, y + 7, { align: 'right' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...colors.slateText);
    doc.text(role.desc, margin + 6, y + 13);

    let featY = y + 20;
    role.features.forEach(f => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...role.color);
      doc.text('*', margin + 6, featY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.navyDark);
      doc.text(f, margin + 11, featY);
      featY += 6.5;
    });

    y += 59;
  });

  drawPageFooter(3, 6);

  // ==========================================
  // PAGE 4: HOMEOWNER & ADMIN HUBS + TOLL POLICY
  // ==========================================
  doc.addPage();
  currentPage = 4;
  drawPageHeader('Homeowner, Admin Hub & Highway Toll Policy');

  y = 28;
  y = drawSectionHeader('4. Homeowner Portal & BuildNexus Central Admin Hub', y);

  // Role 4 & 5
  const rolesPart2 = [
    {
      title: '4. Homeowner / Customer Solution Portal',
      badge: 'Turnkey Construction & Trade Squads',
      color: colors.blueAccent,
      bgColor: colors.blueBg,
      desc: 'Designed for residential property owners seeking civil construction or renovation.',
      features: [
        'Confidential Builder Showcase: View completed sq.ft, delivered projects, and areas without exposing wholesale bulk contractor pricing.',
        'Direct Builder Consultations: Request official site visits and architectural consultations.',
        'Verified Trade Squad Booking: Book certified trade squads strictly on a transparent per sq.ft area basis with BuildNexus phone verification.'
      ]
    },
    {
      title: '5. BuildNexus Super Admin Command Hub',
      badge: 'Platform Root Oversight',
      color: [225, 29, 72], // Rose red
      bgColor: [255, 241, 242],
      desc: 'Centralized administrative oversight over all transactions, staging depots, and compliance.',
      features: [
        'Active Deals Escrow Oversight: Audit platform deal volume, staging approvals, and payments.',
        'NETC Fastag Toll Compliance: Inspect freight toll deductions (NH-19 Dankuni, Belghoria Expressway, Vidyasagar Setu).',
        'KYC & PWD Class-A License Verifications: Verify contractor and trade squad credentials.',
        'Dispute Settlement & Case Log: Real-time conflict resolution and incident auditing.'
      ]
    }
  ];

  rolesPart2.forEach(role => {
    doc.setFillColor(...role.bgColor);
    doc.setDrawColor(...colors.borderLight);
    doc.roundedRect(margin, y, contentWidth, 42, 3, 3, 'FD');

    doc.setFillColor(...role.color);
    doc.rect(margin, y, 3, 42, 'F');

    doc.setTextColor(...colors.navyDark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(role.title, margin + 6, y + 7);

    doc.setFontSize(7.5);
    doc.setTextColor(...role.color);
    doc.text(role.badge.toUpperCase(), pageWidth - margin - 4, y + 7, { align: 'right' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...colors.slateText);
    doc.text(role.desc, margin + 6, y + 13);

    let featY = y + 19;
    role.features.forEach(f => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...role.color);
      doc.text('*', margin + 6, featY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.navyDark);
      const textLines = doc.splitTextToSize(f, contentWidth - 16);
      doc.text(textLines, margin + 11, featY);
      featY += (textLines.length * 4.5) + 2;
    });

    y += 48;
  });

  y = drawSectionHeader('5. Highway & Transit Toll Policy (100% Paid by Buyer/Contractor)', y);

  doc.setFillColor(...colors.white);
  doc.setDrawColor(...colors.borderLight);
  doc.roundedRect(margin, y, contentWidth, 54, 3, 3, 'FD');

  doc.setTextColor(...colors.navyDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Key Principle: Zero Toll Deductions from Supplier Net Catalog Earnings', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.slateText);
  const tollText = [
    'When building materials are dispatched from major supplier staging yards (Dankuni Central Hub, Kona Expressway,',
    'or Hooghly Belts) to job sites (New Town, Salt Lake, Rajarhat), transit highway and bridge tolls are incurred.',
    '',
    '* Enforcement: Highway tolls are itemized as a separate transparent line-item at checkout and paid by the Buyer/Contractor.',
    '* Plaza Coverage: NH-19 Dankuni Toll Plaza (Rs 450), Belghoria Expressway (Rs 350), Vidyasagar Setu (Rs 680).',
    '* NETC Fastag Audit: Real-time telemetry logs Fastag transaction IDs and binds them to the consignment manifest.',
    '* Supplier Protection: Suppliers receive 100% of their net material rate deck without unexpected transit fee deductions.'
  ];
  doc.text(tollText, margin + 6, y + 14);

  drawPageFooter(4, 6);

  // ==========================================
  // PAGE 5: TECHNICAL ARCHITECTURE & DATA FLOW
  // ==========================================
  doc.addPage();
  currentPage = 5;
  drawPageHeader('Technical Architecture & System Stack');

  y = 28;
  y = drawSectionHeader('6. Technical Architecture & Component Stack', y);

  // Tech Stack Grid
  const techItems = [
    { layer: 'Frontend Layer', tech: 'Next.js 14 App Router, React 18, TypeScript', detail: 'Server-side rendering, responsive glassmorphic design, WCAG-compliant 44px tap targets.' },
    { layer: 'Styling & Icons', tech: 'Tailwind CSS, Framer Motion, Lucide-React', detail: 'Industrial Navy (#0F172A) & Safety Orange (#EA580C) design system with dark/light themes.' },
    { layer: 'State & Forms', tech: 'Zustand Store, React Hook Form, Zod', detail: 'Persisted client state across carts, negotiations, stock logs, and multi-step verification.' },
    { layer: 'Database & ORM', tech: 'Prisma ORM, SQLite (dev.db)', detail: 'Relational data models for users, materials, orders, labour squads, site stock, and chats.' },
    { layer: 'Document Generation', tech: 'jsPDF, XLSX (SheetJS)', detail: 'Direct in-browser generation of printable invoices, contractor Khatas, and audit PDF reports.' },
    { layer: 'Internationalization', tech: 'Multi-language Localization (i18n)', detail: 'Full locale dictionary support for English (en), Hindi (hi), and Kannada (kn).' }
  ];

  techItems.forEach(item => {
    doc.setFillColor(...colors.lightBg);
    doc.setDrawColor(...colors.borderLight);
    doc.roundedRect(margin, y, contentWidth, 16.5, 2, 2, 'FD');

    doc.setTextColor(...colors.navyDark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(item.layer + ':', margin + 4, y + 5.5);

    doc.setTextColor(...colors.orangePrimary);
    doc.text(item.tech, margin + 40, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.slateText);
    doc.text(item.detail, margin + 4, y + 11.5);

    y += 19;
  });

  y = drawSectionHeader('7. Security, Privacy & Integrity Protocols', y);

  const securityPoints = [
    { title: 'Simulated Govt ID KYC Verification', desc: 'Aadhaar / PAN simulated 2-factor OTP verification generating masked IDs (XXXX XXXX 4912) and verified badges.' },
    { title: 'In-App Phone & Contact Masking', desc: 'Automated privacy filter masking mobile phone numbers in negotiation chats to prevent platform disintermediation.' },
    { title: 'Consignment Handover OTP Code', desc: 'Secure 4-digit site reception OTP required by delivery drivers before unloading, guaranteeing zero phantom delivery claims.' },
    { title: 'Architectural Blueprint Confidentiality', desc: 'Complete suppression of wholesale pricing when homeowners browse turnkey builders to protect commercial blueprints.' }
  ];

  securityPoints.forEach(sec => {
    doc.setFillColor(...colors.white);
    doc.setDrawColor(...colors.borderLight);
    doc.roundedRect(margin, y, contentWidth, 13, 2, 2, 'FD');

    doc.setTextColor(...colors.emerald);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('[SEC]', margin + 4, y + 5);

    doc.setTextColor(...colors.navyDark);
    doc.text(sec.title, margin + 18, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.slateText);
    doc.text(sec.desc, margin + 18, y + 9.5);

    y += 15.5;
  });

  drawPageFooter(5, 6);

  // ==========================================
  // PAGE 6: CONCLUSION, ROADMAP & TEAM SUMMARY
  // ==========================================
  doc.addPage();
  currentPage = 6;
  drawPageHeader('Strategic Roadmap & Project Summary');

  y = 28;
  y = drawSectionHeader('8. Production Roadmap & Future Enhancements', y);

  const roadmapSteps = [
    { phase: 'Phase 1 (Completed)', title: 'Core ConTech Engine & 5 Persona Portals', desc: 'Two-way negotiations, stock depletion horizon, buyback desk, homeowner showcase, and toll allocation rules.' },
    { phase: 'Phase 2 (Near-Term)', title: 'UPI / Escrow Gateway & Net Zero Fleet Tracking', desc: 'Integration of real bank escrow hooks, GST e-way bill generation, and live GPS vehicle telematics.' },
    { phase: 'Phase 3 (Medium-Term)', title: 'AI Predictive Material Forecasting & Scheduling', desc: 'Machine learning demand forecasting based on Kolkata monsoon patterns and regional infrastructure tenders.' },
    { phase: 'Phase 4 (Long-Term)', title: 'Pan-India Multi-Hub Staging Network', desc: 'Expansion from Dankuni/Kona hubs to Mumbai, Bengaluru, and NCR construction corridors.' }
  ];

  roadmapSteps.forEach(rm => {
    doc.setFillColor(...colors.lightBg);
    doc.setDrawColor(...colors.borderLight);
    doc.roundedRect(margin, y, contentWidth, 19, 2, 2, 'FD');

    doc.setFillColor(...colors.navyDark);
    doc.rect(margin, y, 3, 19, 'F');

    doc.setTextColor(...colors.orangePrimary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(rm.phase.toUpperCase(), margin + 6, y + 6);

    doc.setTextColor(...colors.navyDark);
    doc.setFontSize(9);
    doc.text(rm.title, margin + 55, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.slateText);
    doc.text(rm.desc, margin + 6, y + 13.5);

    y += 22;
  });

  y = drawSectionHeader('9. Conclusion & Project Deliverable Summary', y);

  doc.setFillColor(...colors.white);
  doc.setDrawColor(...colors.borderLight);
  doc.roundedRect(margin, y, contentWidth, 68, 3, 3, 'FD');

  doc.setTextColor(...colors.navyDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('BuildNexus: Pioneering Fair, Transparent, and Efficient Construction', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.slateText);
  const conclusionText = [
    'BuildNexus successfully demonstrates how digital technology can bring structure, safety, and operational excellence',
    'to an historically fragmented civil construction ecosystem. By introducing direct price negotiations, site stock burn',
    'monitoring, surplus material buybacks, fair wage protection, and explicit transit toll allocations, BuildNexus establishes',
    'a high standard for modern Indian construction platforms.',
    '',
    'All five stakeholder interfaces are fully operational, tested with end-to-end user workflows, and backed by a robust',
    'production-ready architecture.',
    '',
    'For code review and testing, clone the repository and launch via standard npm commands:',
    '  * Repository: https://github.com/aihikbasu/BuildNexus.git',
    '  * Development Port: http://localhost:3000',
    '  * Technology Foundation: Next.js 14, TypeScript, Prisma, Tailwind CSS'
  ];
  doc.text(conclusionText, margin + 6, y + 15);

  drawPageFooter(6, 6);

  // ==========================================
  // SAVE FILE
  // ==========================================
  const projectRoot = path.resolve(__dirname, '..');
  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'BuildNexus_Project_Report.pdf');
  const rootOutputPath = path.join(projectRoot, 'BuildNexus_Project_Report.pdf');

  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));
  fs.writeFileSync(rootOutputPath, Buffer.from(pdfBytes));

  console.log('Project Report PDF successfully created at:');
  console.log('  ->', outputPath);
  console.log('  ->', rootOutputPath);
  console.log('File size:', fs.statSync(outputPath).size, 'bytes');
  return outputPath;
}

createProjectReport();
