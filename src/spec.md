# Specification

## Summary
**Goal:** Build a playable 2D endless running game with scoring, difficulty progression, themed UI screens, and an authenticated global leaderboard backed by a Motoko canister.

**Planned changes:**
- Implement the core endless runner loop: Start action, automatic forward motion, keyboard control(s) to avoid obstacles, repeated obstacle spawning, collision detection, and Game Over + Restart flow.
- Add scoring over time/distance plus gradual difficulty progression (speed and/or obstacle frequency) and deterministic reset behavior on restart.
- Create UI flow and HUD: Start screen (title + controls), in-game HUD (score and optionally best score), Game Over screen (final score + restart), and a Leaderboard view accessible from Start and/or Game Over.
- Add Motoko backend persistence keyed by authenticated principal: submit score (update best only if higher), fetch caller best score, and fetch global top leaderboard.
- Connect frontend to backend using React Query: submit score on Game Over when signed in, fetch best score and leaderboard with loading/error states, and show clear sign-in-required messaging when not authenticated.
- Apply a single coherent visual theme (colors, typography, consistent button styling) across all screens and game presentation.

**User-visible outcome:** Users can play an endless runner, see score and increasing difficulty, reach a Game Over state with restart, and view a leaderboard; signed-in users can save their best score and appear on the global top scores list.
