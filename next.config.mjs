/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
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
          // ⛔ Explicitly override any legacy X-Frame-Options from Next/Vercel
          { key: "X-Frame-Options", value: "" },
          { key: "Cache-Control", value: "no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" }
        ]
      }
    ];
  }
};

export default nextConfig;
