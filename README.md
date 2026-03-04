# Apex Prototype (MVP Scaffold)

Minimal playable prototype aligned with the Apex ecosystem vision:

- Player-controlled organism in a 3D world.
- Autonomous flora, prey, predators, mates, and rival competitors.
- Energy + health survival loop.
- In-world reproduction interaction and generation handoff.
- Data-driven trait drift from observed behavior metrics.
- World tier expands ecological pressure over generations.
- Trait-driven phenotype rigs: creatures get unique body shapes and appendages.
- Phenotype rigs are animated from locomotion speed (gait, tail sway, idle motion).
- Player morphology now updates live during a generation from behavior telemetry.
- Prey use flocking rules (alignment/cohesion/separation), and predators use light pack-hunt coordination.

## Run

```bash
cd "/Users/michael/Documents/New project/apex"
python3 -m http.server 8158
```

Open: `http://127.0.0.1:8158`

## Controls

- `W A S D`: Move
- `F`: Focus camera on player organism
- `G`: Toggle minimap/radar
- Mouse drag: Orbit camera
- `Shift + drag` (or middle/right drag): Pan camera target
- Mouse wheel: Zoom
- Touch: one finger orbit, two-finger pinch zoom + pan, three-finger orbit/pan blend
- `E`: Reproduce when near an eligible mate
- `M`: Cycle tone profile (`Scientific` -> `Balanced` -> `Stylized`)
- `T`: Toggle telemetry line
- `K`: Save snapshot
- `L`: Load snapshot
- `N`: Start new lineage (clears saved snapshot)
- `Tab`: Toggle debug metrics

## Notes

- Balancing constants are centralized in `main.js` under `BALANCE` for rapid tuning.
- Tone profiles blend realism and charm with gameplay + phenotype effects.
- Terrain now uses procedural texture + elevation, and entities follow surface height.
- Telemetry shows FPS, populations, lineage events, tone, and biome.
- Save snapshots persist to browser `localStorage` (`apex_sim_save_v1`) and autosave every 10 seconds.
- Physics still uses simple sphere colliders while phenotype meshes are visual-only.
- Three.js is vendored locally at `vendor/three.module.min.js` for reliable local preview boot.
- Reproduction requires age + energy + health thresholds.
- Reproduction feedback now shows nearest mate distance/lock reason, and mate spawn is centered near the player when ready.
- Mate readability: mates use cyan/green beacon markers (green = eligible); rivals use orange warning cones.
- Mate/rival markers now include floating labels (`M1/M2`, `R1/R2`) for quick identification.
- Mate lock HUD line + world-space lock beam now point to the current target (`M#`) and turn green in interaction range.
- Mates can have requirements (forage/chase/energy), and rivals can steal mates.
- Biomes expand as generation tier increases:
  - Tier 1: meadow only
  - Tier 2: scorch zone unlocks (heat pressure)
  - Tier 3+: wetland unlocks (movement pressure)
