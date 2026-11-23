import { NextResponse } from 'next/server';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface NexusBotAction {
  label: string;
  actionType: 'ADD_TO_CART' | 'NAVIGATE' | 'OPEN_ESTIMATOR' | 'VIEW_LABOUR' | 'VIEW_FORECAST';
  payload?: any;
}

export async function POST(req: Request) {
  try {
    const { message, language = 'en' } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, error: 'Empty message' }, { status: 400 });
    }

    const query = message.toLowerCase().trim();
    let replyText = '';
    let actions: NexusBotAction[] = [];

    // AI Intent Classification & Construction Domain Knowledge Engine
    if (query.includes('cement') || query.includes('ultratech') || query.includes('acc') || query.includes('bag')) {
      if (language === 'hi') {
        replyText = `वर्तमान में अल्ट्राटेक पीपीसी सीमेंट ₹380/बोरी पर उपलब्ध है। लक्ष्मी बिल्डिंग सप्लाइज से तत्काल डिलीवरी उपलब्ध है। हमारे एआई मॉडल का पूर्वानुमान है कि अगले 7 दिनों में सीमेंट के दाम 3.4% बढ़ सकते हैं। क्या आप अभी ऑर्डर बुक करना चाहते हैं?`;
      } else if (language === 'kn') {
        replyText = `ಪ್ರಸ್ತುತ ಅಲ್ಟ್ರಾಟೆಕ್ PPC ಸಿಮೆಂಟ್ ಚೀಲಕ್ಕೆ ₹380 ದರದಲ್ಲಿದೆ. ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ಬೆಲೆಗಳು 3.4% ಹೆಚ್ಚಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ಈಗಲೇ ಆರ್ಡರ್ ಮಾಡಲು ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿರಿ.`;
      } else {
        replyText = `Current UltraTech PPC Cement is ₹380/bag from Lakshmi Building Supplies (Verified). Our AI Commodity Predictor forecasts a +3.4% price hike over the next 7 days due to supply crunches. Locking your order today is recommended.`;
      }

      actions = [
        {
          label: '🛒 Add 50 Bags to Cart (₹19,000)',
          actionType: 'ADD_TO_CART',
          payload: {
            materialId: 'mat-1',
            name: 'UltraTech PPC Cement (50kg)',
            price: 380,
            unit: 'bag',
            quantity: 50,
            supplierId: 'sup-1',
            supplierName: 'Lakshmi Building Supplies',
            image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
          },
        },
        {
          label: '📈 View 30-Day Cement Forecast',
          actionType: 'VIEW_FORECAST',
          payload: { category: 'cement' },
        },
      ];
    } else if (query.includes('steel') || query.includes('tmt') || query.includes('iron') || query.includes('rebar')) {
      replyText = `Tata Tiscon 550D TMT Rebar is priced at ₹65/kg (₹58,500/MT). AI Prediction: Steel is currently signaling **WAIT TO BUY** — primary mills in eastern India have stepped up capacity, which is expected to trigger a ₹1,600/MT price dip in 6 to 9 days.`;
      actions = [
        {
          label: '📈 Check Steel Price Trend Curve',
          actionType: 'VIEW_FORECAST',
          payload: { category: 'steel' },
        },
        {
          label: '🛒 Add 500kg TMT Rebar to Cart',
          actionType: 'ADD_TO_CART',
          payload: {
            materialId: 'mat-2',
            name: 'Tata Tiscon 550D TMT Rebar (12mm)',
            price: 65,
            unit: 'kg',
            quantity: 500,
            supplierId: 'sup-2',
            supplierName: 'Kaveri Steel Corporation',
            image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
          },
        },
      ];
    } else if (query.includes('estimate') || query.includes('boq') || query.includes('calculate') || query.includes('sq ft') || query.includes('sqft')) {
      const areaMatch = query.match(/\d+/);
      const area = areaMatch ? parseInt(areaMatch[0], 10) : 1000;
      const cementApprox = Math.round(area * 0.42);
      const steelApprox = parseFloat(((area * 3.8) / 1000).toFixed(2));
      const approxCost = Math.round(area * 1450);

      replyText = `For a ${area} sq.ft standard residential RCC structure, our engineering model estimates:\n• **Cement**: ~${cementApprox} bags\n• **TMT Steel**: ~${steelApprox} Metric Tonnes\n• **Sand**: ~${Math.round(area * 0.085)} Tons M-Sand\n• **Aggregates**: ~${Math.round(area * 0.11)} Tons\n• **Approx Civil Budget**: ₹${approxCost.toLocaleString('en-IN')}.\n\nWould you like to open the full interactive BOQ estimator?`;

      actions = [
        {
          label: `🏗️ Open AI BOQ Estimator (${area} sq.ft)`,
          actionType: 'OPEN_ESTIMATOR',
          payload: { area },
        },
      ];
    } else if (query.includes('labour') || query.includes('labor') || query.includes('mason') || query.includes('sardar') || query.includes('worker')) {
      replyText = `BuildNexus currently has 18 verified worker squads and sardars ready in Bengaluru with guaranteed 100% fair minimum wages (₹850/day masons, ₹550/day helpers). All crews are protected with zero middleman deductions and simulated Aadhaar checks.`;
      actions = [
        {
          label: '👷 Explore Labour Heatmap & Availability',
          actionType: 'VIEW_LABOUR',
        },
      ];
    } else if (query.includes('warehouse') || query.includes('staging') || query.includes('delivery') || query.includes('safety')) {
      replyText = `BuildNexus operates centralized staging hubs (Bays A1 through C4). Contractors can store ordered materials safely for up to 72 hours for free, verify quality before final truck dispatch, and release payment with 4-digit OTP upon job-site unloading.`;
      actions = [
        {
          label: '🚚 Track Active Deliveries & GPS',
          actionType: 'NAVIGATE',
          payload: { url: '/delivery' },
        },
        {
          label: '🛡️ BuildNexus Admin Bay Status',
          actionType: 'NAVIGATE',
          payload: { url: '/admin' },
        },
      ];
    } else {
      replyText = `Hello! I am **NexusBot**, your construction intelligence assistant powered by BuildNexus AI. 

I can assist you with:
• **Real-time commodity price forecasts** (Cement, Steel, Aggregates)
• **Instant BOQ material calculation** for any building dimensions
• **Labour crew discovery & wage estimations**
• **Negotiation strategies & warehouse staging guidance**

What are you building or procuring today?`;
      actions = [
        {
          label: '🏗️ Calculate 1,000 sq.ft BOQ',
          actionType: 'OPEN_ESTIMATOR',
          payload: { area: 1000 },
        },
        {
          label: '📈 Check Steel & Cement Predictions',
          actionType: 'VIEW_FORECAST',
        },
        {
          label: '👷 Find Available Masons',
          actionType: 'VIEW_LABOUR',
        },
      ];
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      actions,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
