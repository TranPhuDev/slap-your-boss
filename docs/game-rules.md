# Game Rules

```ts
const GAME_DURATION_MS = 15_000;
const INPUT_COOLDOWN_MS = 80;
const COMBO_WINDOW_MS = 450;
const COMBO_RESET_MS = 700;
```

Use `performance.now()` for round timing.

Tap:

- <= 250 ms
- <= 15 px movement
- power 20–40

Swipe:

- >= 40 px
- <= 500 ms
- horizontal movement dominant
- one gesture creates one event

```ts
interface SlapEvent {
  direction: 'LEFT' | 'RIGHT';
  inputType: 'TAP' | 'SWIPE';
  power: number;
  x: number;
  y: number;
  timestamp: number;
}
```

Combo multiplier:

```ts
1 + Math.min(combo, 30) * 0.03
```

Damage:

```ts
rawDamage += slapPower * comboMultiplier;
faceDamage = Math.round(100 * (1 - Math.exp(-rawDamage / 2100)));
stressReleased = Math.round(totalSlaps * 1.1 + bestSlap * 0.22);
finalScore = Math.round(faceDamage * 0.48 + stressReleased * 0.32 + bestSlap * 0.2);
```

Cursor:

- only PLAYING;
- only fine/hover pointer;
- READY, DRAGGING, HITTING;
- restore default during cleanup.

SLAP AGAIN keeps boss/face transform and resets the round.
NEW BOSS clears boss data and releases image/texture resources.
