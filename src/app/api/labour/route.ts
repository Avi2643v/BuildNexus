import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEMO_LABORERS, type LaborerItem } from '@/lib/demo-labour';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSkill = searchParams.get('skill') || 'all';
    const normalizedSkill = rawSkill.trim().toLowerCase();

    // Query from Prisma database
    let dbLaborers: any[] = [];
    try {
      dbLaborers = await prisma.user.findMany({
        where: {
          role: 'LABORER',
          status: 'APPROVED',
        },
        include: {
          laborProfile: {
            include: {
              skills: true,
              availability: true,
            },
          },
        },
      });
    } catch (e) {
      console.warn('Prisma fetch warning, continuing with demo catalog:', e);
    }

    // Merge DB records and DEMO_LABORERS, avoiding duplicate IDs
    const mergedMap = new Map<string, LaborerItem>();

    // Put DEMO_LABORERS first
    for (const item of DEMO_LABORERS) {
      mergedMap.set(item.id, item);
    }

    // Overlay any DB records
    for (const u of dbLaborers) {
      if (u.laborProfile) {
        mergedMap.set(u.id, {
          id: u.id,
          name: u.name,
          mobile: u.mobile,
          avatar: u.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          rating: u.rating || 4.8,
          city: u.city || 'Kolkata, West Bengal',
          maskedGovtId: u.maskedGovtId,
          laborProfile: {
            id: u.laborProfile.id,
            isSardar: !!u.laborProfile.isSardar,
            teamName: u.laborProfile.teamName,
            teamSize: u.laborProfile.teamSize || 1,
            fairWageGuarantee: u.laborProfile.fairWageGuarantee ?? true,
            dailyWage: u.laborProfile.dailyWage || 750,
            ratePerSqFt: Math.round((u.laborProfile.dailyWage || 750) / 25),
            rateUnit: 'sq.ft',
            experienceYears: u.laborProfile.experienceYears || 5,
            wageSplitDetails: u.laborProfile.wageSplitDetails,
            skills: u.laborProfile.skills.map((s: any) => ({ id: s.id, name: s.name })),
            availability: (u.laborProfile.availability || []).map((a: any) => ({
              id: a.id,
              date: a.date,
              status: a.status,
              slotsAvailable: a.slotsAvailable,
              totalSlots: a.totalSlots,
            })),
          },
        });
      }
    }

    let allLaborers = Array.from(mergedMap.values());

    // Apply Filter Tab Logic
    let filtered = allLaborers;

    if (normalizedSkill !== 'all' && normalizedSkill !== '') {
      if (normalizedSkill === 'sardar') {
        filtered = allLaborers.filter((u) => u.laborProfile?.isSardar === true);
      } else if (normalizedSkill.includes('electric') || normalizedSkill === 'electrician') {
        filtered = allLaborers.filter((u) =>
          u.laborProfile?.skills.some((s) => s.name.toLowerCase().includes('electr'))
        );
      } else if (normalizedSkill.includes('plumb') || normalizedSkill === 'plumber') {
        filtered = allLaborers.filter((u) =>
          u.laborProfile?.skills.some(
            (s) => s.name.toLowerCase().includes('plumb') || s.name.toLowerCase().includes('sanitar')
          )
        );
      } else if (normalizedSkill.includes('mason') || normalizedSkill === 'mason') {
        filtered = allLaborers.filter((u) =>
          u.laborProfile?.skills.some(
            (s) =>
              s.name.toLowerCase().includes('mason') ||
              s.name.toLowerCase().includes('brick layer') ||
              s.name.toLowerCase().includes('bricklayer') ||
              s.name.toLowerCase().includes('plaster')
          )
        );
      } else if (
        normalizedSkill.includes('bar bender') ||
        normalizedSkill.includes('steel') ||
        normalizedSkill.includes('rebar')
      ) {
        filtered = allLaborers.filter((u) =>
          u.laborProfile?.skills.some(
            (s) =>
              s.name.toLowerCase().includes('bar') ||
              s.name.toLowerCase().includes('bender') ||
              s.name.toLowerCase().includes('steel') ||
              s.name.toLowerCase().includes('rebar')
          )
        );
      } else if (normalizedSkill.includes('jointer') || normalizedSkill.includes('brick jointer')) {
        filtered = allLaborers.filter((u) =>
          u.laborProfile?.skills.some((s) => s.name.toLowerCase().includes('joint'))
        );
      } else {
        filtered = allLaborers.filter((u) =>
          u.laborProfile?.skills.some(
            (s) =>
              s.name.toLowerCase().includes(normalizedSkill) ||
              normalizedSkill.includes(s.name.toLowerCase())
          )
        );
      }
    }

    return NextResponse.json({ success: true, count: filtered.length, laborers: filtered });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
