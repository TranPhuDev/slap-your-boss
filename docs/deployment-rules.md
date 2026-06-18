# Deployment Rules

Primary target: Vercel static hosting.

Production canonical domain:

```text
https://www.slap-your-boss.online/
```

Vercel settings:

```text
Framework preset: Vite
Build command: pnpm build
Output directory: dist
```

Vercel Web Analytics:

- enabled with `@vercel/analytics`;
- initialized once in `src/main.ts`;
- basic page views only;
- no custom events;
- no boss names, uploaded image data, File/Blob/Object URLs, base64, landmarks, face mesh, camera information, or Slap Report contents.

Secondary target: Cloudflare Pages static hosting.

```text
Framework preset: Vue
Build command: pnpm build
Output directory: dist
```

Verify:

- model/cursor/sound/character paths;
- `pnpm preview`;
- direct load and refresh;
- canonical, robots, sitemap, Open Graph, Twitter card, and structured data;
- Vercel Dashboard Analytics enabled before expecting production analytics data;
- HTTPS for camera-related features;
- no image upload request;
- graceful cursor/audio/vibration fallback.
