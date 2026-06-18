# RISKS.md

| ID | Risk | Mitigation | Status |
|---|---|---|---|
| R-001 | MediaPipe model/WASM fails on static hosting | Stable local asset paths, retry UX, production preview | Open |
| R-002 | Large phone photo causes memory pressure | 10 MB limit, resize before detection, release resources | Open |
| R-003 | PixiJS resources accumulate | Explicit lifecycle and repeated-session tests | Open |
| R-004 | Custom cursor harms FPS | RAF/direct DOM, no per-move Vue reactivity, fine pointer only | Open |
| R-005 | Audio autoplay blocked | Resume AudioContext from PLAY, tolerate failure | Open |
| R-006 | Vibration unsupported | Optional progressive enhancement | Open |
| R-007 | Deformation tears texture | Clamp impulses, preserve origin geometry, fallback renderer | Open |
| R-008 | Image accidentally persists/uploads | Storage/network audit and hard privacy rules | Open |
| R-009 | Unclear asset license | Original assets or documented license | Open |
| R-010 | AI agent scope drift | WIP=1, active feature, explicit out-of-scope, harness check | Open |
| R-011 | Browser/manual verification was unavailable in this session | Record blocked cases and require real-device verification before public release | Open |
| R-012 | PixiJS and MediaPipe produce a large main chunk | Build passes; consider dynamic imports/code splitting before public launch | Open |
