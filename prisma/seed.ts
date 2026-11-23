import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.case.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.notebookEntry.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.material.deleteMany();
  await prisma.laborSkill.deleteMany();
  await prisma.laborAvailability.deleteMany();
  await prisma.laborProfile.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.laborType.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Labor Types...');
  const laborTypes = [
    {
      id: 'lt-1',
      name: 'Brick Jointer',
      description: 'Specialist in precision brick alignment, mortar laying, and joint finishing for structural walls.',
      defaultWage: 750,
      icon: 'BrickWall',
    },
    {
      id: 'lt-2',
      name: 'Brick Breaker',
      description: 'Expert in manual demolition, chiseled brick sizing, and site surface preparation.',
      defaultWage: 650,
      icon: 'Hammer',
    },
    {
      id: 'lt-3',
      name: 'Masala Mixer',
      description: 'Master mortar and concrete blender ensuring uniform sand-cement water ratios for high durability.',
      defaultWage: 600,
      icon: 'Blend',
    },
    {
      id: 'lt-4',
      name: 'Material Coolie',
      description: 'Sturdy site logistics worker for rapid material movement, unloading, and staging.',
      defaultWage: 550,
      icon: 'Boxes',
    },
  ];

  for (const lt of laborTypes) {
    await prisma.laborType.create({ data: lt });
  }

  console.log('Seeding Demo Users for each Role...');

  // 1. Contractor
  const contractor = await prisma.user.create({
    data: {
      id: 'user-contractor-1',
      name: 'Rajesh Sharma',
      mobile: '9876543210',
      role: 'CONTRACTOR',
      govtIdType: 'AADHAAR',
      maskedGovtId: 'XXXX XXXX 4912',
      isVerified: true,
      status: 'APPROVED',
      city: 'Kolkata, West Bengal',
      rating: 4.9,
      bio: 'Class-A Builder with 12+ years experience in residential and commercial projects in Whitefield & Electronic City.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 2. Sardar / Laborer
  const sardarUser = await prisma.user.create({
    data: {
      id: 'user-laborer-1',
      name: 'Ramesh Sardar & Team',
      mobile: '9876543211',
      role: 'LABORER',
      govtIdType: 'AADHAAR',
      maskedGovtId: 'XXXX XXXX 8831',
      isVerified: true,
      status: 'APPROVED',
      city: 'Kolkata, West Bengal',
      rating: 4.85,
      bio: 'Certified Sardar team head managing 15 skilled workers with guaranteed 100% direct fair wages.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      laborProfile: {
        create: {
          id: 'lp-1',
          isSardar: true,
          teamName: 'Cauvery Skilled Brick & Masonry Squad',
          teamSize: 15,
          fairWageGuarantee: true,
          dailyWage: 750,
          experienceYears: 8,
          wageSplitDetails: JSON.stringify({
            workerPromisedWage: 750,
            supervisorAllowance: 50,
            platformFee: 0,
            guaranteeBadge: '100% Direct Bank Credit - No Middleman Cut',
          }),
          skills: {
            create: [
              { name: 'Brick Jointer' },
              { name: 'Masala Mixer' },
              { name: 'Brick Breaker' },
            ],
          },
          availability: {
            create: [
              { date: '2026-10-10', status: 'AVAILABLE', slotsAvailable: 5, totalSlots: 5 },
              { date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 5, totalSlots: 5 },
              { date: '2026-10-12', status: 'PARTIAL', slotsAvailable: 2, totalSlots: 5 },
              { date: '2026-10-13', status: 'BOOKED', slotsAvailable: 0, totalSlots: 5 },
              { date: '2026-10-14', status: 'AVAILABLE', slotsAvailable: 5, totalSlots: 5 },
            ],
          },
        },
      },
    },
  });

  // 3. Supplier 1
  const supplier1 = await prisma.user.create({
    data: {
      id: 'user-supplier-1',
      name: 'Lakshmi Building Supplies',
      mobile: '9876543212',
      role: 'SUPPLIER',
      govtIdType: 'PAN',
      maskedGovtId: 'XXXXX 1234 P',
      isVerified: true,
      status: 'APPROVED',
      city: 'Kolkata, West Bengal',
      rating: 4.9,
      bio: 'Authorized dealer for UltraTech, JSW Steel, and ACC Cement with 24-hour staging dispatch.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    },
  });

  // Supplier 2
  const supplier2 = await prisma.user.create({
    data: {
      id: 'user-supplier-2',
      name: 'Karnataka Steel & Aggregates',
      mobile: '9876543222',
      role: 'SUPPLIER',
      govtIdType: 'GSTIN',
      maskedGovtId: 'XXXX 9918 G',
      isVerified: true,
      status: 'APPROVED',
      city: 'Kolkata, West Bengal',
      rating: 4.75,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 4. Delivery Agent
  const deliveryAgent = await prisma.user.create({
    data: {
      id: 'user-delivery-1',
      name: 'Vikram Express Logistics',
      mobile: '9876543213',
      role: 'DELIVERY_AGENT',
      govtIdType: 'VOTER_ID',
      maskedGovtId: 'XXXX XXXX 9081',
      isVerified: true,
      status: 'APPROVED',
      city: 'Kolkata, West Bengal',
      rating: 4.95,
      bio: 'Heavy-duty 10-ton flatbed truck driver stationed at BuildNexus Central Warehouse (Yeshwanthpur).',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 5. Admin
  await prisma.user.create({
    data: {
      id: 'user-admin-1',
      name: 'BuildNexus Central Admin',
      mobile: '9876543214',
      role: 'ADMIN',
      govtIdType: 'AADHAAR',
      maskedGovtId: 'XXXX XXXX 0001',
      isVerified: true,
      status: 'APPROVED',
      city: 'Kolkata, West Bengal',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
  });

  console.log('Seeding 20+ Materials across Categories...');
  const materialsData = [
    {
      id: 'mat-1',
      name: 'UltraTech PPC Cement (50kg)',
      category: 'cement',
      price: 380,
      unit: 'bag',
      stock: 500,
      rating: 4.9,
      supplierId: supplier1.id,
      isVerifiedSupplier: true,
      deliveryEtaDays: 1,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
      brand: 'UltraTech',
      city: 'Kolkata, West Bengal',
      isBoosted: true,
    },
    {
      id: 'mat-2',
      name: 'ACC Super Gold Cement (50kg)',
      category: 'cement',
      price: 375,
      unit: 'bag',
      stock: 350,
      rating: 4.8,
      supplierId: supplier2.id,
      isVerifiedSupplier: true,
      deliveryEtaDays: 1,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
      brand: 'ACC',
      city: 'Kolkata, West Bengal',
    },
    {
      id: 'mat-3',
      name: 'Red Wire Cut Solid Clay Bricks',
      category: 'bricks',
      price: 9.5,
      unit: 'pc',
      stock: 10000,
      rating: 4.7,
      supplierId: supplier1.id,
      isVerifiedSupplier: true,
      deliveryEtaDays: 2,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      brand: 'Cauvery Clay Works',
      city: 'Kolkata, West Bengal',
    },
    {
      id: 'mat-4',
      name: 'JSW Neosteel TMT Bars 12mm (Fe-550D)',
      category: 'steel',
      price: 62,
      unit: 'kg',
      stock: 2500,
      rating: 4.95,
      supplierId: supplier2.id,
      isVerifiedSupplier: true,
      deliveryEtaDays: 1,
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
      brand: 'JSW Steel',
      city: 'Kolkata, West Bengal',
      isBoosted: true,
    },
    {
      id: 'mat-5',
      name: 'Tata Tiscon 16mm TMT Rebars',
      category: 'steel',
      price: 64,
      unit: 'kg',
      stock: 1800,
      rating: 4.9,
      supplierId: supplier1.id,
      isVerifiedSupplier: true,
      deliveryEtaDays: 1,
      image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=400&q=80',
      brand: 'Tata Tiscon',
      city: 'Kolkata, West Bengal',
    },
    {
      id: 'mat-6',
      name: 'M-Sand (Manufactured Sand for Mortar)',
      category: 'sand',
      price: 45,
      unit: 'sq.ft',
      stock: 5000,
      rating: 4.6,
      supplierId: supplier2.id,
      isVerifiedSupplier: true,
      deliveryEtaDays: 1,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      brand: 'Cauvery Sands',
      city: 'Kolkata, West Bengal',
    },
    {
      id: 'mat-7',
      name: '20mm Jelly Crushed Stone Aggregates',
      category: 'aggregates',
      price: 38,
      unit: 'sq.ft',
      stock: 6000,
      rating: 4.75,
      supplierId: supplier2.id,
      isVerifiedSupplier: true,
      deliveryEtaDays: 1,
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80',
      brand: 'Deccan Quarries',
      city: 'Kolkata, West Bengal',
    },
    {
      id: 'mat-8',
      name: 'Kajaria Vitrified Floor Tiles (2x2 ft)',
      category: 'tiles',
      price: 65,
      unit: 'sq.ft',
      stock: 1200,
      rating: 4.85,
      supplierId: supplier1.id,
      isVerifiedSupplier: true,
      deliveryEtaDays: 2,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      brand: 'Kajaria',
      city: 'Kolkata, West Bengal',
    },
    {
      id: 'mat-9',
      name: 'Asian Paints Apex Weatherproof (20L)',
      category: 'paint',
      price: 4200,
      unit: 'bucket',
      stock: 80,
      rating: 4.9,
      supplierId: supplier1.id,
      isVerifiedSupplier: true,
      deliveryEtaDays: 1,
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=400&q=80',
      brand: 'Asian Paints',
      city: 'Kolkata, West Bengal',
    },
    {
      id: 'mat-10',
      name: 'Surplus JSW TMT 10mm Cut Pieces (Leftover)',
      category: 'steel',
      price: 48,
      unit: 'kg',
      stock: 350,
      rating: 4.7,
      supplierId: contractor.id, // Sold by Contractor!
      isVerifiedSupplier: true,
      deliveryEtaDays: 1,
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
      brand: 'JSW Steel',
      city: 'Kolkata, West Bengal',
      isContractorListing: true,
      condition: 'SURPLUS',
      status: 'APPROVED',
    },
  ];

  for (const m of materialsData) {
    await prisma.material.create({ data: m });
  }

  console.log('Seeding 25+ Additional Laborers across all 4 labor types...');
  const additionalLaborers = [
    { name: 'Suresh Kumar', type: 'Brick Jointer', wage: 720, rating: 4.9, exp: 6 },
    { name: 'Manjunath B', type: 'Brick Jointer', wage: 700, rating: 4.8, exp: 5 },
    { name: 'Kiran Gowda', type: 'Brick Breaker', wage: 650, rating: 4.7, exp: 4 },
    { name: 'Anil Naik', type: 'Masala Mixer', wage: 600, rating: 4.85, exp: 5 },
    { name: 'Ganesh Moorthy', type: 'Material Coolie', wage: 550, rating: 4.6, exp: 3 },
    { name: 'Prakash Rao', type: 'Brick Jointer', wage: 750, rating: 4.95, exp: 8 },
    { name: 'Basavaraj K', type: 'Brick Breaker', wage: 640, rating: 4.65, exp: 4 },
    { name: 'Shiva Kumar', type: 'Masala Mixer', wage: 620, rating: 4.75, exp: 4 },
  ];

  for (let i = 0; i < additionalLaborers.length; i++) {
    const lab = additionalLaborers[i];
    await prisma.user.create({
      data: {
        id: `user-lab-extra-${i}`,
        name: lab.name,
        mobile: `98765433${10 + i}`,
        role: 'LABORER',
        govtIdType: 'AADHAAR',
        maskedGovtId: `XXXX XXXX ${3000 + i}`,
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: lab.rating,
        laborProfile: {
          create: {
            dailyWage: lab.wage,
            experienceYears: lab.exp,
            fairWageGuarantee: true,
            skills: {
              create: [{ name: lab.type }],
            },
            availability: {
              create: [
                { date: '2026-10-10', status: 'AVAILABLE', slotsAvailable: 5, totalSlots: 5 },
                { date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 5, totalSlots: 5 },
              ],
            },
          },
        },
      },
    });
  }

  console.log('Seeding Sample Orders & Deliveries...');
  const sampleOrder = await prisma.order.create({
    data: {
      id: 'ord-1001',
      contractorId: contractor.id,
      subtotal: 50000,
      gstAmount: 9000,
      deliveryFee: 1500,
      stagingFee: 500,
      totalAmount: 61000,
      status: 'IN_TRANSIT',
      deliveryAddress: 'Plot 42, Green Glen Layout, Bellandur, Bengaluru',
      deliveryDate: '2026-10-10',
      deliveryTimeSlot: '10:00 AM - 01:00 PM',
      items: {
        create: [
          {
            materialId: 'mat-1',
            supplierId: supplier1.id,
            quantity: 100,
            unitPrice: 380,
          },
          {
            materialId: 'mat-4',
            supplierId: supplier2.id,
            quantity: 200,
            unitPrice: 60,
            isNegotiated: true,
          },
        ],
      },
      delivery: {
        create: {
          agentId: deliveryAgent.id,
          status: 'IN_TRANSIT',
          otpCode: '4921',
          itemMatches: true,
          quantityVerified: true,
          currentLat: 12.9352,
          currentLng: 77.6245,
        },
      },
    },
  });

  console.log('Seeding Conversations & Offers for In-App Negotiation...');
  const conv = await prisma.conversation.create({
    data: {
      id: 'conv-101',
      participant1Id: contractor.id,
      participant2Id: supplier1.id,
      messages: {
        create: [
          {
            senderId: contractor.id,
            text: 'Hello! I need 500 bags of UltraTech Cement for our Bellandur residential project. Can we negotiate a bulk discount?',
          },
          {
            senderId: supplier1.id,
            text: 'Namaste Rajeshji! For 500 bags, our standard price is ₹380/bag. I can offer ₹365/bag with BuildNexus warehouse dispatch guarantee.',
          },
        ],
      },
      offers: {
        create: {
          id: 'offer-501',
          senderId: supplier1.id,
          materialId: 'mat-1',
          price: 365,
          quantity: 500,
          status: 'VERIFIED_BUILDNEXUS',
        },
      },
    },
  });

  console.log('Seeding Digital Notebook Entries...');
  await prisma.notebookEntry.createMany({
    data: [
      {
        contractorId: contractor.id,
        projectId: 'proj-1',
        projectName: 'Bellandur Villa Project',
        date: '2026-10-09',
        type: 'ATTENDANCE',
        title: 'Brick Jointer & Mixer Team (5 Workers)',
        amount: 3650,
        workerName: 'Ramesh Sardar Squad',
        wagePromised: 750,
        wagePaid: 750,
        notes: 'Constructed outer perimeter wall, 120 sq.ft completed cleanly.',
      },
      {
        contractorId: contractor.id,
        projectId: 'proj-1',
        projectName: 'Bellandur Villa Project',
        date: '2026-10-09',
        type: 'MATERIAL',
        title: 'Received 100 bags UltraTech Cement via BuildNexus Express',
        amount: 38000,
        notes: 'Unloaded at site staging bay by Material Coolies. Staging verified.',
      },
      {
        contractorId: contractor.id,
        projectId: 'proj-1',
        projectName: 'Bellandur Villa Project',
        date: '2026-10-10',
        type: 'PAYMENT',
        title: 'Advance Paid to Masonry Team',
        amount: 2000,
        notes: 'UPI direct transfer via BuildNexus Ledger.',
      },
    ],
  });

  console.log('Database successfully seeded with realistic BuildNexus demo data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
