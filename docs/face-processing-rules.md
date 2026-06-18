# Face Processing Rules

Pipeline:

```text
validate -> decode -> resize -> detect -> largest face
-> padded bounds -> soft crop/mask -> local texture -> preview
```

Rules:

- input max 10 MB;
- processing dimension normally <= 1280;
- detect once after photo selection;
- never detect in game loop;
- select largest bounding-box area;
- no-face produces friendly retry;
- never upload/log/store image or landmarks;
- revoke replaced Object URLs;
- release temporary canvases.

Preview transform:

```ts
interface FaceTransform {
  x: number;
  y: number;
  scale: number;    // 0.7–1.5
  rotation: number; // -15 to 15 degrees
}
```
