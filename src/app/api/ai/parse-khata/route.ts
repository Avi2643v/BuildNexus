import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json({ success: false, error: 'No transcript provided' }, { status: 400 });
    }

    const text = transcript.trim().toLowerCase();

    // Natural Language Parsing Engine tailored for Indian Construction terminology
    const workers = [
      { name: 'Ramesh Sardar', defaultWage: 850 },
      { name: 'Suresh Kumar', defaultWage: 750 },
      { name: 'Ganesh Das', defaultWage: 750 },
      { name: 'Manjunath Gowda', defaultWage: 800 },
      { name: 'Raju Mason', defaultWage: 850 },
      { name: 'Praveen Bar-bender', defaultWage: 780 },
    ];

    const detectedEntries: Array<{
      type: 'ATTENDANCE' | 'MATERIAL' | 'EXPENSE' | 'PAYMENT';
      title: string;
      workerName?: string;
      wagePromised?: number;
      wagePaid?: number;
      amount: number;
      notes: string;
    }> = [];

    // Check for worker attendance
    for (const w of workers) {
      const firstName = w.name.split(' ')[0].toLowerCase();
      if (text.includes(firstName)) {
        let isHalfDay = text.includes(`${firstName} half`) || text.includes('half day') || text.includes('aadha');
        let shiftMultiplier = isHalfDay ? 0.5 : 1.0;
        let wagePromised = Math.round(w.defaultWage * shiftMultiplier);

        // Check if advance/paid is mentioned
        let advanceMatch = text.match(new RegExp(`(?:paid|advance|diya|de diya|rupees|rs|₹)\\s*(\\d+)`));
        let wagePaid = 0;
        if (text.includes(`${firstName} paid`) || text.includes(`paid ${firstName}`) || text.includes(`${firstName} advance`) || text.includes(`advance to ${firstName}`)) {
          wagePaid = advanceMatch ? parseInt(advanceMatch[1], 10) : wagePromised;
        }

        detectedEntries.push({
          type: 'ATTENDANCE',
          title: `${w.name} - ${isHalfDay ? 'Half Day Shift' : 'Full Day Shift'}`,
          workerName: w.name,
          wagePromised,
          wagePaid,
          amount: wagePaid,
          notes: `AI Parsed voice transcript: "${transcript}"`,
        });
      }
    }

    // Check for materials / general expenses if no specific worker or if cement/diesel/sand mentioned
    if (text.includes('cement') || text.includes('steel') || text.includes('sand') || text.includes('diesel') || text.includes('bricks') || text.includes('truck')) {
      const amountMatch = text.match(/(?:rs|inr|₹|amount|paid)?\s*(\d{3,7})/i);
      const amount = amountMatch ? parseInt(amountMatch[1], 10) : 1500;

      let materialTitle = 'Site Material Purchase';
      if (text.includes('cement')) materialTitle = 'Cement Bags Intake / Khata';
      else if (text.includes('steel')) materialTitle = 'Steel Rebar Procurement';
      else if (text.includes('sand')) materialTitle = 'M-Sand Truck Tipping';
      else if (text.includes('diesel')) materialTitle = 'Site Generator Diesel Expense';

      detectedEntries.push({
        type: 'MATERIAL',
        title: materialTitle,
        amount,
        notes: `AI Parsed site expense entry from: "${transcript}"`,
      });
    }

    // Fallback if nothing detected
    if (detectedEntries.length === 0) {
      const numbers = text.match(/\d+/g);
      const firstNum = numbers ? parseInt(numbers[0], 10) : 500;
      detectedEntries.push({
        type: 'EXPENSE',
        title: 'Daily Site Log / Miscellaneous',
        amount: firstNum,
        notes: `AI Audio Transcript: "${transcript}"`,
      });
    }

    return NextResponse.json({
      success: true,
      transcript,
      parsedEntries: detectedEntries,
      message: `Successfully extracted ${detectedEntries.length} structured log entry(ies).`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
