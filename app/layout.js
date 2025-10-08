export const metadata = {
  title: 'PPS Elevate Certificate Verification',
  icons: { icon: [], apple: [], shortcut: [] }, // disables favicon lookups
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin:0, background:'#f9fafb', font:'16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu', color:'#111' }}>
        {children}
      </body>
    </html>
  );
}
