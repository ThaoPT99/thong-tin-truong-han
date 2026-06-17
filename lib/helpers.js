// helpers.js — Shared helpers cho API admin
const { supabase } = require('./supabase');

/**
 * Xoá hết rows cũ trong child table, sau đó insert rows mới.
 * Dùng cho: school_conditions, school_majors, school_advantages,
 *           school_conversions, school_documents
 */
async function replaceChildTable(table, schoolId, items) {
  if (!items || !Array.isArray(items) || items.length === 0) return;
  const { error: delErr } = await supabase.from(table).delete().eq('school_id', schoolId);
  if (delErr) {
    console.error(`delete ${table} error:`, delErr.message);
    return;
  }
  const rows = items.map((text, i) => ({
    school_id: schoolId,
    text: String(text),
    sort_order: i,
  }));
  const { error: insErr } = await supabase.from(table).insert(rows);
  if (insErr) console.error(`insert ${table} error:`, insErr.message);
}

/**
 * Xoá hết partners cũ, insert partners mới.
 */
async function replacePartners(schoolId, partners) {
  if (!partners || !Array.isArray(partners)) return;
  await supabase.from('school_partners').delete().eq('school_id', schoolId);
  if (partners.length > 0) {
    const rows = partners.map((p) => ({
      school_id: schoolId,
      code: p.code || '',
      name: p.name || '',
      name_kr: p.nameKr || '',
    }));
    const { error: insErr } = await supabase.from('school_partners').insert(rows);
    if (insErr) console.error('insert partners error:', insErr.message);
  }
}

/**
 * Upsert advisor profile (1-1 với school).
 * Nếu đã có → update, chưa có → insert.
 */
async function upsertAdvisorProfile(schoolId, ap) {
  if (!ap) return;
  const { data: existing } = await supabase
    .from('school_advisor_profiles')
    .select('id')
    .eq('school_id', schoolId)
    .maybeSingle();

  const data = {
    school_id: schoolId,
    gender: ap.gender || 'all',
    min_gpa: ap.minGpa || 5.0,
    max_absences: ap.maxAbsences || 30,
    cost_level: ap.costLevel || 3,
    visa_chance: ap.visaChance || 3,
    job_opportunity: ap.jobOpportunity || 3,
    e7_opportunity: ap.e7Opportunity || 3,
    study_load: ap.studyLoad || 3,
    interview_difficulty: ap.interviewDifficulty || 2,
    tags: ap.tags || [],
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    await supabase.from('school_advisor_profiles').update(data).eq('id', existing.id);
  } else {
    await supabase.from('school_advisor_profiles').insert(data);
  }
}

/**
 * Insert child records cho school mới (không xoá, vì chưa có gì).
 */
async function insertChildTable(table, schoolId, items) {
  if (!items || !Array.isArray(items) || items.length === 0) return;
  const rows = items.map((text, i) => ({
    school_id: schoolId,
    text: String(text),
    sort_order: i,
  }));
  const { error: err } = await supabase.from(table).insert(rows);
  if (err) console.error(`insert ${table} error:`, err.message);
}

module.exports = {
  replaceChildTable,
  replacePartners,
  upsertAdvisorProfile,
  insertChildTable,
};
