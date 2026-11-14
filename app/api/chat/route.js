import { getSurveyData } from '@/lib/googleSheets';
import { retrieveContext, generateLocalRAGResponse } from '@/lib/ragEngine';
import { NEARBY_HOSPITALS, EMERGENCY_HELPLINES } from '@/lib/emergencyHospitals';
import { NextResponse } from 'next/server';

// ── AI Provider Callers with Timeout & Graceful Handling ─────────────────────

async function callGemini(systemPrompt, messages) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY missing');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Understood. I am PathoLens RAG AI Assistant, powered by live rural survey data, microbiological pathogen standards, and the Solan hospital emergency network.' }] },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.65 },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini status ${res.status}: ${err}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');
    return text;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callGroq(systemPrompt, messages) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY missing');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 1024,
        temperature: 0.65,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq status ${res.status}: ${err}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty Groq response');
    return text;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Main Route Handler ───────────────────────────────────────────────────────

export async function POST(req) {
  try {
    const { messages = [] } = await req.json();
    const latestUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';

    // 1. Fetch live or cohort survey data
    const survey = await getSurveyData();

    // 2. Perform RAG Retrieval: Extract top relevant domain chunks
    const retrievedChunks = retrieveContext(latestUserMsg, survey, 4);

    const contextBlock = retrievedChunks
      .map((c, i) => `[DOCUMENT ${i + 1} - ${c.category}]\n${c.content}`)
      .join('\n\n---\n\n');

    // Quick hospital reference for the AI
    const hospitalList = NEARBY_HOSPITALS
      .map(h => `- ${h.name} (${h.category}) | Dist: ${h.distance} | Phone: ${h.phone} / Emergency: ${h.emergencyPhone}`)
      .join('\n');

    const helplineList = EMERGENCY_HELPLINES
      .map(e => `- ${e.name}: Dial ${e.number} (${e.desc})`)
      .join('\n');

    // 3. Construct System Prompt with Injected Retrieval Context
    const systemPrompt = `You are PathoLens RAG AI, an expert epidemiological and community health assistant for project PathoLens by team Udte Parinde (Social Project Group-4).
The project surveys foodborne illness risk and water safety across 20+ rural villages surrounding Shoolini University in Solan District, Himachal Pradesh.

### RETRIEVED EPIDEMIOLOGICAL KNOWLEDGE & SURVEY CONTEXT:
${contextBlock}

### SOLAN / SHOOLINI EMERGENCY CONTACTS & HOSPITALS:
${hospitalList}
${helplineList}

### YOUR OPERATIONAL INSTRUCTIONS:
1. Always ground your answers in the retrieved documents, verified survey statistics, and WHO food hygiene guidelines.
2. If the user asks about emergency care, severe symptoms, critical risk, hospitals, or medical assistance, immediately provide:
   - Dial 108 (State Emergency Ambulance)
   - Specific nearby facilities (Regional Hospital Solan: 01792-224145, MMU Hospital Kumarhatti: 01792-268300, Shoolini Campus Dispensary: +91 1792 308000)
   - First-aid oral rehydration steps (WHO ORS).
3. Be professional, empathetic, and direct. Use clear Markdown with headings, bullet points, and bold keywords.
4. Keep answers concise (2-4 paragraphs or structured lists) unless the user asks for a comprehensive breakdown.`;

    let aiResponse = null;
    let providerUsed = 'rag-engine';

    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasGroq = !!process.env.GROQ_API_KEY;

    // Try Gemini if available
    if (hasGemini) {
      try {
        aiResponse = await callGemini(systemPrompt, messages);
        providerUsed = 'gemini';
      } catch (geminiErr) {
        console.warn('[PathoLens AI] Gemini failed/quota reached:', geminiErr.message);
      }
    }

    // Try Groq if Gemini wasn't available or failed
    if (!aiResponse && hasGroq) {
      try {
        aiResponse = await callGroq(systemPrompt, messages);
        providerUsed = 'groq';
      } catch (groqErr) {
        console.warn('[PathoLens AI] Groq failed:', groqErr.message);
      }
    }

    // Zero-Failure Guaranteed Fallback: RAG Synthesis Engine
    if (!aiResponse) {
      aiResponse = generateLocalRAGResponse(latestUserMsg, retrievedChunks, survey);
      providerUsed = 'rag-engine';
    }

    return NextResponse.json({
      content: aiResponse,
      provider: providerUsed,
      retrievedCount: retrievedChunks.length,
    });
  } catch (err) {
    console.error('[/api/chat]', err);
    // Even in case of unexpected runtime error, return a clean helpful response
    const fallback = generateLocalRAGResponse('emergency assistance', [], null);
    return NextResponse.json({
      content: fallback,
      provider: 'rag-engine',
    });
  }
}
