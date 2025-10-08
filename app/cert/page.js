// app/cert/page.js
import { headers } from 'next/headers';
import { getCertificateData } from '@/lib/sheets';   // <-- alias import (see step 3)

export const runtime = 'nodejs';     // <— force Node runtime on Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;


const nl2br = s => String(s || '').replace(/\r\n|\r|\n/g, '<br>');
const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[c]));

export default async function CertQueryPage({ searchParams }) {
  headers();                         // best-effort no-store
  const params = await searchParams; // Next 15 requires awaiting
  const cert = params?.cert;

  // No cert -> info screen
  if (!cert) {
    return (
      <div style={{ maxWidth:820, margin:'40px auto', padding:24 }}>
        <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 8px 30px rgba(0,0,0,.06)', padding:28 }}>
          <div style={{ fontWeight:800, letterSpacing:'.2px' }}>PPS Consulting • Certificate Verification</div>
          <h1 style={{ margin:'8px 0 0', fontSize:22 }}>PPS Certificate Verification</h1>
          <div style={{ margin:'12px 0 18px', fontWeight:600 }}>
            Add <code>?cert=&lt;CertID&gt;</code> to the URL.
          </div>
        </div>
      </div>
    );
  }

  // Lookup + render
  const data = await getCertificateData(cert);
  if (!data) {
    return <Card state="error" title="Certificate Not Found" message="We couldn’t find this certificate. Check the QR/link or contact PPS support." />;
  }

  const { rec, course, validity } = data;

  const details = {
    Learner: rec.LearnerName || '-',
    Course: rec.CourseName || course?.CourseName || '-',
    Mode: course?.Mode || '-',
    Location: course?.Location || '-',
    Hours: course?.Hours || '-',
    Duration: course?.Duration || '-',
    Instructors: course?.Instructors || '-',
    Issued: rec.IssueDate || '-',
    Expiry: rec.ExpiryDate || '-',
    CertID: rec.CertID || cert,
    Type: rec.Type || '-',
    CourseID: rec.CourseID || '-',
  };

  const courseLong = course ? {
    short: course.ShortDescription || '',
    detailsHtml: nl2br(course.CourseDetails || ''),
  } : null;

  const state = validity === 'Valid' ? 'success' : (validity === 'Revoked' ? 'warning' : 'error');

  return <Card state={state} title="Certificate Verification" message={`Status: ${validity}`} details={details} courseLong={courseLong} />;
}

function Card({ state='info', title, message, details=null, courseLong=null }) {
  const color = state === 'success' ? '#0f9d58' : state === 'warning' ? '#f4b400' : state === 'error' ? '#db4437' : '#3367d6';

  return (
    <div style={{ maxWidth:820, margin:'40px auto', padding:24 }}>
      <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 8px 30px rgba(0,0,0,.06)', padding:28 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:8, flexWrap:'wrap' }}>
          <div style={{ fontWeight:800, letterSpacing:'.2px' }}>PPS Consulting • Certificate Verification</div>
          <span style={{ padding:'4px 10px', borderRadius:999, color:'#fff', background:color, fontWeight:600, fontSize:12 }}>
            {esc(String(state).toUpperCase())}
          </span>
        </div>
        <h1 style={{ margin:'8px 0 0', fontSize:22 }}>{esc(title)}</h1>
        <div style={{ margin:'12px 0 18px', fontWeight:600 }}>{esc(message)}</div>

        {details && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'8px 16px' }}>
            {Object.entries(details).map(([k, v]) => (
              <div style={{ display:'contents' }} key={k}>
                <div style={{ color:'#6b7280' }}>{esc(k)}</div>
                <div style={{ color:'#111827', fontWeight:600 }}>{esc(String(v ?? '-'))}</div>
              </div>
            ))}
          </div>
        )}

        {courseLong && (
          <>
            <div style={{ height:1, background:'#eee', margin:'20px 0' }} />
            <div>
              <div style={{ fontWeight:800, marginBottom:6 }}>About this course</div>
              {courseLong.short && <div style={{ color:'#374151', marginBottom:8 }}>{esc(courseLong.short)}</div>}
              {courseLong.detailsHtml && <div style={{ color:'#111827' }} dangerouslySetInnerHTML={{ __html: courseLong.detailsHtml }} />}
            </div>
          </>
        )}

        <div style={{ marginTop:18, color:'#6b7280', fontSize:12 }}>
          If this looks incorrect, contact support@ppsconsulting.biz.
        </div>
      </div>
    </div>
  );
}
