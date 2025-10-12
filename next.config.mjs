/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Allow your domain + Wix’s wrapper iframes
    const FRAME_ANCESTORS = [
      "https://ppsconsulting.biz",
      "https://www.ppsconsulting.biz",
      "https://*.ppsconsulting.biz",        // future-proof
      "https://*.wixsite.com",
      "https://*.editorx.io",
      "https://*.wix.com",
      "https://*.wixstatic.com",
      "https://static.parastorage.com",
      "https://*.parastorage.com"
    ].join(' ');

    return [
      {
        source: "/:path*",
        headers: [
          // Final authority for iframe embedding
          { key: "Content-Security-Policy", value: `frame-ancestors ${FRAME_ANCESTORS};` },

          // Do NOT send X-Frame-Options at all (CSP is the modern control)
          // Some stacks treat blank values strangely; safest is: omit it entirely.

          // Nice-to-haves:
          { key: "Cache-Control", value: "no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" }
        ]
      }
    ];
  }
};

export default nextConfig;
