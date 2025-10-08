import { google } from 'googleapis';

const SHEET_ID = process.env.SHEET_ID;
const CERTS_TAB = 'Certificates';
const COURSES_TAB = 'Courses';

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function getTabValues(tabName) {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: tabName,
    valueRenderOption: 'FORMATTED_VALUE',
  });
  return res.data.values || [];
}

export async function lookupByKey(tabName, keyCol, keyVal) {
  const values = await getTabValues(tabName);
  if (values.length < 2) return null;

  const headers = values[0].map(String);
  const idx = headers.indexOf(keyCol);
  if (idx === -1) return null;

  const row = values.slice(1).find(r => String(r[idx] ?? '').trim() === String(keyVal).trim());
  if (!row) return null;

  const obj = {};
  headers.forEach((h, i) => (obj[h] = row[i]));
  return obj;
}

export async function getCertificateData(certId) {
  const rec = await lookupByKey(CERTS_TAB, 'CertID', certId);
  if (!rec) return null;

  const course = rec.CourseID ? await lookupByKey(COURSES_TAB, 'CourseID', rec.CourseID) : null;

  const stripTime = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const parseDate = s => {
    if (!s) return null;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : stripTime(d);
  };

  const today = stripTime(new Date());
  const status = String(rec.Status || '').toLowerCase() === 'active' ? 'Active' : 'Revoked';
  const exp = parseDate(rec.ExpiryDate);
  const expired = exp ? exp < today : false;
  const validity = status !== 'Active' ? 'Revoked' : expired ? 'Expired' : 'Valid';

  return { rec, course, validity };
}
