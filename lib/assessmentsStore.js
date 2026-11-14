/**
 * lib/assessmentsStore.js — Local JSON-file persistence for assessments
 * In production swap this for MongoDB/PostgreSQL/Firebase.
 */
import fs from 'fs';
import path from 'path';

const STORE_PATH = path.join(process.cwd(), 'data', 'assessments.json');

function ensureDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function getAll() {
  ensureDir();
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAssessment(record) {
  ensureDir();
  const all = getAll();
  all.unshift(record); // newest first
  fs.writeFileSync(STORE_PATH, JSON.stringify(all, null, 2));
  return record;
}
