/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // IMPORTANT: allow your Wix site & your domain to frame this app
    const FRAME_ANCESTORS = [
      "https://ppsconsulting.biz",
      "https://www.ppsconsulting.biz",
      "https://*.wixsite.com",
      "https://*.editorx.io"
    ].join(' ');

    return [
      {
        source: "/:path*",
        headers: [
          // Explicitly allow being embedded by your Wix domain
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${FRAME_ANCESTORS};`
          },
          // Some proxies/browsers still honor X-Frame-Options
          // ALLOWALL is non-standard but effectively removes the block in engines that still default
          { key: "X-Frame-Options", value: "ALLOWALL" },

          // Optional hardening
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },

          // Avoid caching verification results
          { key: "Cache-Control", value: "no-store" }
        ]
      }
    ];
  }
};

export default nextConfig;
