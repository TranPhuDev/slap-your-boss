# Privacy and Security Rules

Non-negotiable:

- photos never leave the device;
- no backend upload endpoint;
- no third-party face API;
- no image/base64/File/Blob/landmarks in storage, analytics, or logs;
- no `v-html` for user input;
- no public gallery.

Permitted network requests are static app/model/assets only unless separately approved.

Vercel Web Analytics is permitted for basic page views only. Do not send custom events or analytics properties containing boss names, uploaded image data, File/Blob/Object URLs, base64, landmarks, face mesh, camera information, or Slap Report contents.

Never log:

- File objects;
- Object URLs;
- pixels/base64;
- landmarks/crops;
- boss names to production analytics.

Use cartoon-only deformation. No blood, gore, realistic wounds, or identity-targeted insults.
