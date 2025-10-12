export const runtime = 'nodejs';

export default function Home() {
  return (
    <main style={{maxWidth:840, margin:'48px auto', padding:'0 16px', fontFamily:'system-ui'}}>
      <h1>PPS Certificate Verification</h1>
      <p>Use <code>/cert?cert=&lt;CertID&gt;</code> or the Wix page at <code>/verify</code>.</p>
    </main>
  );
}
