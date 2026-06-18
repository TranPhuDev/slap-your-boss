# Architecture Rules

## Layers

- Vue UI: screens, forms, transitions, HUD, result controls.
- Game runtime: PixiJS, loop, input, animation, effects.
- Services: face processing and image processing.
- Composables: app state, boss profile, settings.

Dependency direction:

```text
Vue -> controllers/composables -> runtime/services -> utilities/types
```

Rules:

- Game runtime must not import Vue components.
- Prevent invalid state transitions centrally.
- Use interfaces between processing/preview, Vue/runtime, input/SlapEvent, deformation/rendering, score/result.
- Resource owner performs cleanup.
- No giant App.vue or single god class.
- No network face-processing service.
- No duplicated score formulas.
