import { calculateRisk } from '@/lib/risk';
import { saveAssessment, getAll } from '@/lib/assessmentsStore';
import { invalidateSurveyCache } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid assessment submission body' }, { status: 400 });
    }

    const risk = calculateRisk(body);
    const isVillageSelected =
      body.village &&
      body.village.trim().toLowerCase() !== 'none' &&
      body.village.trim().toLowerCase() !== 'survey household' &&
      body.village.trim() !== '';

    const record = {
      id: isVillageSelected ? `SHL-LIVE-${Date.now().toString(36).slice(-4).toUpperCase()}` : uuid(),
      ...body,
      village: body.village || 'None',
      risk,
      createdAt: new Date().toISOString(),
    };

    try {
      saveAssessment(record);
      invalidateSurveyCache();
    } catch (saveErr) {
      console.warn('Non-blocking assessment save notice:', saveErr.message);
    }

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const all = getAll();
    return NextResponse.json(all);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
