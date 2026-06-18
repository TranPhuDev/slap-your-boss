# Deployment Rules

Target: Cloudflare Pages static hosting.

```text
Framework preset: Vue
Build command: pnpm build
Output directory: dist
```

Verify:

- model/cursor/sound/character paths;
- `pnpm preview`;
- direct load and refresh;
- HTTPS for camera-related features;
- no image upload request;
- graceful cursor/audio/vibration fallback.
