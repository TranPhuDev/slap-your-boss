# Privacy and Security Rules

Non-negotiable:

- photos never leave the device;
- no backend upload endpoint;
- no third-party face API;
- no image/base64/File/Blob/landmarks in storage, analytics, or logs;
- no `v-html` for user input;
- no public gallery.

Permitted network requests are static app/model/assets only unless separately approved.

Never log:

- File objects;
- Object URLs;
- pixels/base64;
- landmarks/crops;
- boss names to production analytics.

Use cartoon-only deformation. No blood, gore, realistic wounds, or identity-targeted insults.
