# Apex Prototype (MVP Scaffold)

Minimal playable prototype aligned with the Apex ecosystem vision:

- Player-controlled organism in a 3D world.
- Autonomous flora, prey, predators, mates, and rival competitors.
- Energy + health survival loop.
- In-world reproduction interaction and generation handoff.
- Data-driven trait drift from observed behavior metrics.
- World tier expands ecological pressure over generations.
- Trait-driven phenotype rigs: creatures get unique body shapes and appendages.
- Phenotype DNA now differentiates every creature and produces hybrid offspring visuals.
- Phenotype rigs are animated from locomotion speed (gait, tail sway, idle motion).
- Player morphology now updates live during a generation from behavior telemetry.
- Prey use flocking rules (alignment/cohesion/separation), and predators use light pack-hunt coordination.
- Predators are enabled by default; press `P` in-game to toggle predator pressure on/off.

## Run

```bash
cd "/Users/michael/Documents/New project/apex"
python3 -m http.server 8158
```

Open: `http://127.0.0.1:8158`

## Controls

- `W A S D`: Camera-relative movement
- `Arrow keys`: Steering controls (`Up/Down` throttle, `Left/Right` turn)
- `Shift`: Sprint
- `Space`: Burst movement (short dash with cooldown/energy cost)
- `P`: Toggle predators on/off (for focused tuning sessions)
- `F`: Focus camera on player organism
- `G`: Toggle minimap/radar
- Mouse drag: Orbit camera
- `Shift + drag` (or middle/right drag): Pan camera target
- Mouse wheel: Zoom
- Touch: one finger orbit, two-finger pinch zoom + pan, three-finger orbit/pan blend
- `E`: Reproduction action button (signal mates, then reproduce with selected mate when in range)
- `1` / `2`: Select mate slot directly (`M1`/`M2`)
- `Q` / `R`: Cycle selected mate backward/forward
- `M`: Cycle tone profile (`Scientific` -> `Balanced` -> `Stylized`)
- `T`: Toggle telemetry line
- `K`: Save snapshot
- `L`: Load snapshot
- `N`: Start new lineage (clears saved snapshot)
- `Tab`: Toggle debug metrics

## Notes

- Balancing constants are centralized in `main.js` under `BALANCE` for rapid tuning.
- Tone profiles blend realism and charm with gameplay + phenotype effects.
- Gameplay director pass adds:
  - chained objectives with visible rewards (energy/health/trait boosts)
  - feeding combo multipliers for faster, more rewarding loops
  - emergency forage surge when energy is critically low
  - sprint + burst traversal for stronger movement feel
- Biodiversity pass adds:
  - varied flora + fauna species (some edible, some inedible/toxic)
  - tree populations that add terrain structure and movement blocking
  - mate species compatibility tiers (ideal/viable/risky/fragile) that affect lineage fertility
  - minimap/UI cues for harmful flora and inedible fauna for faster decision-making
- Terrain now uses procedural texture + elevation, and entities follow surface height.
- Telemetry shows FPS, populations, lineage events, tone, and biome.
- Save snapshots persist to browser `localStorage` (`apex_sim_save_v1`) and autosave every 10 seconds.
- Physics still uses simple sphere colliders while phenotype meshes are visual-only.
- Three.js is vendored locally at `vendor/three.module.min.js` for reliable local preview boot.
- Reproduction requires age + energy + health thresholds.
- Reproduction HUD now provides:
  - readiness checklist (age/energy/health/cooldown)
  - explicit 3-step action line (`0/3` to `3/3`) telling exactly when to press `E`
  - mate spawn is centered near the player when ready
- Mate readability: mates use cyan/green beacon markers (green = eligible); rivals use orange warning cones.
- Mate/rival markers now include floating labels (`M1/M2`, `R1/R2`) for quick identification.
- Mate lock HUD line + world-space lock beam now prioritize your selected mate (`M#`) and turn green in interaction range.
- Mate cards are shown in HUD with trait deltas and requirement shorthand so evolution choices can be deliberate.
- Creature presentation pass: segmented body/head rigs, snout/mouth/ornament features, eye+pupil animation, markings, outline shell, and soft ground shadow.
- Creature presentation now adds cached procedural skin textures (stripes/spots/rosettes/bands) and stronger per-organism silhouette asymmetry.
- Creature materials now use stylized toon-like shading bands + rim-light accents for clearer Zelda-like readability.
- Generation handoff now has a visible metamorphosis transition (growth + glow cocoon) so evolution reads clearly in play.
- Rendering now applies species-aware material presets (aquatic/avian/predator/mate) for more distinct surface response and highlights.
- Mates can have requirements (forage/chase/energy), and rivals can steal mates.
- World/biome pass now emulates mixed terrain profiles inspired by places like New Zealand and Costa Rica:
  - Coastal beaches and lowlands
  - Rainforest basins
  - Highland/alpine ridges
  - Volcanic zone (heat pressure)
  - Wetland + cloud-forest pockets (movement pressure)
- Biome availability still scales by tier (`tier 2` unlocks volcanic/highland, `tier 3+` unlocks wetland/cloud-forest).
