/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Allow embedding by your Wix site + Wix wrapper iframes
    const FRAME_ANCESTORS = [
      "https://ppsconsulting.biz",
      "https://www.ppsconsulting.biz",
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
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${FRAME_ANCESTORS};`
          },
          // REMOVE X-Frame-Options entirely; CSP is the modern control.
          // Some stacks treat unknown values like ALLOWALL as invalid and fallback to blocking.
          { key: "Cache-Control", value: "no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" }
        ]
      }
    ];
  }
};

export default nextConfig;
