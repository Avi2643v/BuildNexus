import { NextResponse } from 'next/server';

export interface CommodityTrend {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  unit: string;
  prediction7d: number;
  prediction14d: number;
  prediction30d: number;
  direction: 'DOWN' | 'UP' | 'STABLE';
  changePercent7d: number;
  confidenceScore: number;
  recommendation: 'STRONG_BUY' | 'WAIT_TO_BUY' | 'ACCUMULATE' | 'STABLE';
  reasoning: string;
  priceHistory: { day: string; actual?: number; predicted?: number }[];
}

const mockCommodities: CommodityTrend[] = [
  {
    id: 'tmt-steel-550d',
    name: 'Fe-550D TMT Rebar (Tata / Jindal)',
    category: 'Steel',
    currentPrice: 58500,
    unit: 'MT (Metric Tonne)',
    prediction7d: 56900,
    prediction14d: 55800,
    prediction30d: 57400,
    direction: 'DOWN',
    changePercent7d: -2.74,
    confidenceScore: 92,
    recommendation: 'WAIT_TO_BUY',
    reasoning: 'Blast furnace output in Odisha and secondary re-rollers has increased 8%, causing secondary market price cooling. Ideal bulk procurement window is in 6-9 days.',
    priceHistory: [
      { day: 'Day -6', actual: 60200 },
      { day: 'Day -4', actual: 59800 },
      { day: 'Day -2', actual: 59100 },
      { day: 'Today', actual: 58500, predicted: 58500 },
      { day: '+3 Days', predicted: 57700 },
      { day: '+7 Days', predicted: 56900 },
      { day: '+14 Days', predicted: 55800 },
      { day: '+21 Days', predicted: 56500 },
      { day: '+30 Days', predicted: 57400 },
    ],
  },
  {
    id: 'opc-53-cement',
    name: 'OPC 53 Grade Cement (UltraTech / ACC)',
    category: 'Cement',
    currentPrice: 385,
    unit: '50kg Bag',
    prediction7d: 398,
    prediction14d: 405,
    prediction30d: 410,
    direction: 'UP',
    changePercent7d: 3.38,
    confidenceScore: 88,
    recommendation: 'STRONG_BUY',
    reasoning: 'Upcoming state infrastructure projects and power tariff revisions for South clinker units will push retail bag rates up ₹15-20. Lock procurement immediately.',
    priceHistory: [
      { day: 'Day -6', actual: 375 },
      { day: 'Day -4', actual: 378 },
      { day: 'Day -2', actual: 382 },
      { day: 'Today', actual: 385, predicted: 385 },
      { day: '+3 Days', predicted: 392 },
      { day: '+7 Days', predicted: 398 },
      { day: '+14 Days', predicted: 405 },
      { day: '+21 Days', predicted: 408 },
      { day: '+30 Days', predicted: 410 },
    ],
  },
  {
    id: 'm-sand-concrete',
    name: 'Manufactured M-Sand (Zone II)',
    category: 'Sand',
    currentPrice: 1450,
    unit: 'Ton',
    prediction7d: 1420,
    prediction14d: 1410,
    prediction30d: 1430,
    direction: 'STABLE',
    changePercent7d: -2.07,
    confidenceScore: 85,
    recommendation: 'ACCUMULATE',
    reasoning: 'Quarry operations in Kanakapura and Hoskote running at optimal crushing capacity. Local logistics supply steady.',
    priceHistory: [
      { day: 'Day -6', actual: 1480 },
      { day: 'Day -4', actual: 1470 },
      { day: 'Day -2', actual: 1460 },
      { day: 'Today', actual: 1450, predicted: 1450 },
      { day: '+3 Days', predicted: 1435 },
      { day: '+7 Days', predicted: 1420 },
      { day: '+14 Days', predicted: 1410 },
      { day: '+21 Days', predicted: 1420 },
      { day: '+30 Days', predicted: 1430 },
    ],
  },
  {
    id: 'coarse-aggregate-20mm',
    name: '20mm Blue Metal Coarse Aggregate',
    category: 'Aggregates',
    currentPrice: 1100,
    unit: 'Ton',
    prediction7d: 1110,
    prediction14d: 1125,
    prediction30d: 1140,
    direction: 'UP',
    changePercent7d: 0.91,
    confidenceScore: 81,
    recommendation: 'ACCUMULATE',
    reasoning: 'Diesel freight revisions expected at month end. Moderate upward pressure on delivered tonnage.',
    priceHistory: [
      { day: 'Day -6', actual: 1080 },
      { day: 'Day -4', actual: 1090 },
      { day: 'Day -2', actual: 1095 },
      { day: 'Today', actual: 1100, predicted: 1100 },
      { day: '+3 Days', predicted: 1105 },
      { day: '+7 Days', predicted: 1110 },
      { day: '+14 Days', predicted: 1125 },
      { day: '+21 Days', predicted: 1135 },
      { day: '+30 Days', predicted: 1140 },
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    commodities: mockCommodities,
    marketOverview: {
      marketSentiment: 'MILD_BUY',
      bestTimeToBuyCategory: 'Steel & TMT',
      estimatedContractorSavings: '₹14,200 per 1000 sq.ft project',
      lastModelRun: new Date().toISOString(),
    },
  });
}
