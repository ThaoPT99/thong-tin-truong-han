// GET /api/schools/:slug — chi tiết 1 trường (Supabase client)
const { supabase } = require('../../lib/supabase');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug } = req.query;
    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    const { data, error } = await supabase
      .from('schools')
      .select(`
        *,
        school_conditions(*),
        school_majors(*),
        school_advantages(*),
        school_conversions(*),
        school_documents(*),
        school_partners(*),
        school_advisor_profiles(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'School not found' });
      }
      throw error;
    }

    const conditions = data.school_conditions || [];
    const majors = data.school_majors || [];
    const advantages = data.school_advantages || [];
    const conversion = data.school_conversions || [];
    const documents = data.school_documents || [];
    const partners = data.school_partners || [];
    const advisorProfiles = data.school_advisor_profiles || [];

    const result = {
      ...data,
      school_conditions: undefined,
      school_majors: undefined,
      school_advantages: undefined,
      school_conversions: undefined,
      school_documents: undefined,
      school_partners: undefined,
      school_advisor_profiles: undefined,
      conditions,
      majors,
      advantages,
      conversion,
      documents,
      partners,
      advisorProfile: advisorProfiles.length > 0 ? advisorProfiles[0] : null,
    };

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('GET /api/schools/:slug error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
