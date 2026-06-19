#!/usr/bin/env node
/**
 * Cập nhật catalog_url và invoice_url từ Google Drive links
 * Chạy: node scripts/update-media-links.js
 */

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlY2VmOGZkLTZlMzEtNDBkMi1iMmFkLTAzZThhNzg3MWM5ZSIsImVtYWlsIjoicGhhbnRydW9uZ3RoYW8xOTlAZ21haWwuY29tIiwicm9sZSI6ImRpcmVjdG9yIiwiaWF0IjoxNzgxODcwMjA5LCJleHAiOjE3ODE5NTY2MDl9.jXmi1oge4CXrTt6LGEkjWXYCIp8LTSEq7gJaC78cJ3E';
const API_BASE = 'https://thongtintruonghan.vercel.app';
const DRIVE_BASE = 'https://drive.google.com/file/d/';

// Catalog links (Google Drive file IDs)
const CATALOG_LINKS = {
  'dh-busan-catholic': '1c4XfGO424-5OINQI9YuaCNPYY4WXNeaC',
  'dh-daewon': '1UY4eFsyTNxAiOxseN5Ofxu5hfPNGE_P5',
  'dh-dongeui': '1OvD9XCX6dLBaIR6IKTdgtnfoT-Op3gU-',
  'dh-gimhae': '1Yy3ceBqYGYelV-tmfAl-9ZVprNvctmhN',
  'dh-jeonju': '1SRni65v84X5v6ujbKBsdLHbj2JHAZGpo',
  'dh-catholic-kwandong': '1-udyYf1vbgkUrX1QMPNpsfJnUyxoUXfA',
  'dh-nu-sinh-kyungin': '1koKmGXVjZmSBtiSRcqaMuf3blbO_w4W0',
  'dh-nu-sinh-dongduk': '1jjenscO1WB2cBjLkAut7IxTSCLxDHUEt',
  'dh-sangmyung': '1U79U2e7tqad3s4rHVBWOh1v7-bqe4Y76',
  'cd-suncheon-jeil': '1xVMO320agblD8atS_Mvj8jFenFePBDOz',
};

// Invoice links (Google Drive file IDs)
const INVOICE_LINKS = {
  'cd-suncheon-jeil': '1qcyCKMkHSUhwHmKkycw2qEiyHZf_-mhA',
  'dh-dongeui': '1mo1sCUbmhxxrZlprtSNmh5KibJQYJR8e',
  'dh-y-te-dongnam': '1cQt0uqhosBjyHgX4UuAPaF__6WjRIpEu',
  'dh-induk': '1AbOCZIBRHMO8LKGGym7lcc4qfcWjNazU',
  'dh-jeonju': '1vFPfCVRaBn8rZvKwl4-ZYvodimvmQ8DM',
  'dh-nu-sinh-kyungin': '15_g8BgeSQAyDkqLAFCz8XE04mnXcjeX0',
  'dh-yeonsung': '1KrIVtDkD_siHLxkqTI7wSdVtxBc6SASZ',
};

async function getSchoolList() {
  const res = await fetch(`${API_BASE}/api/schools`);
  const json = await res.json();
  return json.data || [];
}

async function updateSchool(schoolId, data) {
  const res = await fetch(`${API_BASE}/api/admin/schools?id=${schoolId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${json.error || JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  console.log('Lấy danh sách trường...');
  const schools = await getSchoolList();
  console.log(`Tổng: ${schools.length} trường\n`);

  let catCount = 0;
  let invCount = 0;

  for (const school of schools) {
    const slug = school.slug;
    const name = school.name || slug;
    const updateData = {};

    // Add catalog URL
    const catFileId = CATALOG_LINKS[slug];
    if (catFileId) {
      updateData.catalogUrl = `${DRIVE_BASE}${catFileId}/view`;
    }

    // Add invoice URL
    const invFileId = INVOICE_LINKS[slug];
    if (invFileId) {
      updateData.invoiceUrl = `${DRIVE_BASE}${invFileId}/view`;
    }

    if (Object.keys(updateData).length === 0) {
      continue;
    }

    try {
      await updateSchool(school.id, updateData);
      const parts = [];
      if (updateData.catalogUrl) { catCount++; parts.push('catalog'); }
      if (updateData.invoiceUrl) { invCount++; parts.push('invoice'); }
      console.log(`  ✅ ${name} — Thêm ${parts.join(', ')}`);
    } catch (err) {
      console.log(`  ❌ ${name} — Lỗi: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== HOÀN THÀNH ===`);
  console.log(`✅ Catalog: ${catCount}/10 trường`);
  console.log(`✅ Invoice: ${invCount}/7 trường`);
}

main().catch(console.error);
