import { calculateRisk, RISK_WEIGHTS } from '@/lib/risk';
import { saveAssessment, getAll } from '@/lib/assessmentsStore';
import { invalidateSurveyCache } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

// Note: assessmentsStore is an in-memory store and will not persist across serverless invocations or container restarts.

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const invalidFields = [];

    // Validate waterTreatmentMethod: must be an array whose values are all in the allowed set
    if (!Array.isArray(body.waterTreatmentMethod) || body.waterTreatmentMethod.length === 0) {
      invalidFields.push('waterTreatmentMethod');
    } else {
      const allowedMethods = Object.keys(RISK_WEIGHTS.waterTreatmentMethod.options);
      const allAllowed = body.waterTreatmentMethod.every(m => allowedMethods.includes(m));
      if (!allAllowed) {
        invalidFields.push('waterTreatmentMethod');
      }
    }

    // Validate all other 36 scored fields against RISK_WEIGHTS options
    for (const [fieldName, config] of Object.entries(RISK_WEIGHTS)) {
      if (fieldName === 'waterTreatmentMethod') continue;
      const val = body[fieldName];
      if (val === undefined || val === null || val === '' || config.options[val] === undefined) {
        invalidFields.push(fieldName);
      }
    }

    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed: one or more scored fields are missing or have unrecognised values.',
          fields: invalidFields,
        },
        { status: 400 }
      );
    }

    const risk = calculateRisk(body);
    const isVillageSelected = body.village && body.village.trim().toLowerCase() !== 'none' && body.village.trim().toLowerCase() !== 'survey household' && body.village.trim() !== '';
    const record = {
      id: isVillageSelected ? `SHL-LIVE-${Date.now().toString(36).slice(-4).toUpperCase()}` : uuid(),
      ...body,
      village: body.village || 'None',
      risk,
      createdAt: new Date().toISOString(),
    };
    saveAssessment(record);
    invalidateSurveyCache();
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
