---
"remix-hook-form": minor
---

Fix type errors with react-hook-form 7.75.0. `FormState` gained an `isReady` field and `UseFormReturn` gained `setValues` in 7.75; the wrapped `formState` now exposes `isReady` (preserving the lazy getter behavior) and `setValues` flows through the hook's return type. Resolves the "Property 'setValues'/'isReady' is missing" errors (#180).
