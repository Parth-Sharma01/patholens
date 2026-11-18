/**
 * lib/assessmentsStore.js — Resilient Persistence for Assessments
 * Supports local filesystem, serverless read-only environments (Netlify / Vercel),
 * /tmp caching, and in-memory fallback so saving NEVER crashes.
 */
import fs from 'fs';
import path from 'path';
import os from 'os';

const PRIMARY_PATH = path.join(process.cwd(), 'data', 'assessments.json');
const TMP_PATH = path.join(os.tmpdir(), 'patholens_assessments.json');

// In-memory store persists across warm serverless function invocations
let memoryStore = null;

function safeReadJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    // Ignore read errors
  }
  return null;
}

export function getAll() {
  if (memoryStore !== null) {
    return memoryStore;
  }

  // 1. Try reading from project data directory
  const fromPrimary = safeReadJSON(PRIMARY_PATH);
  if (fromPrimary !== null) {
    memoryStore = fromPrimary;
    return memoryStore;
  }

  // 2. Try reading from /tmp directory (serverless fallback)
  const fromTmp = safeReadJSON(TMP_PATH);
  if (fromTmp !== null) {
    memoryStore = fromTmp;
    return memoryStore;
  }

  memoryStore = [];
  return memoryStore;
}

export function saveAssessment(record) {
  // Always update in-memory cache first
  const all = getAll();
  all.unshift(record);
  memoryStore = all;

  // 1. Try writing to primary path (local dev / writable containers)
  let savedToDisk = false;
  try {
    const dir = path.dirname(PRIMARY_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PRIMARY_PATH, JSON.stringify(memoryStore, null, 2));
    savedToDisk = true;
  } catch (err) {
    // Filesystem may be read-only (EROFS on Netlify / AWS Lambda)
  }

  // 2. If primary failed, try saving to /tmp directory
  if (!savedToDisk) {
    try {
      fs.writeFileSync(TMP_PATH, JSON.stringify(memoryStore, null, 2));
    } catch (err) {
      // In-memory cache is already updated, safe to continue
    }
  }

  return record;
}
