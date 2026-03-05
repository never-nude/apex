"use strict";

const BALANCE = {
  gameplay: {
    predatorsEnabled: true,
    simpleReproduction: true,
  },
  world: {
    baseRadius: 80,
    radiusPerTier: 28,
    hazardScalePerTier: 0.17,
    generationsPerTier: 2,
    maxTier: 6,
  },
  populations: {
    floraBase: 24,
    floraPerTier: 12,
    treeBase: 12,
    treePerTier: 8,
    preyBase: 12,
    preyPerTier: 7,
    predatorBase: 5,
    predatorPerTier: 3,
    aquaticBase: 8,
    aquaticPerTier: 5,
    avianBase: 7,
    avianPerTier: 4,
  },
  player: {
    maxEnergyBase: 70,
    maxEnergyFromStamina: 70,
    moveSpeedBase: 4.2,
    moveSpeedFromTrait: 9.2,
    steerTurnRate: 2.7,
    steerReverseScale: 0.72,
    reproductionAgeMin: 42,
    reproductionEnergyRatio: 0.66,
    reproductionHealthMin: 35,
    reproductionInteractDistance: 3.4,
    reproductionCooldownAfterFail: 12,
    reproductionCooldownAfterBirth: 10,
    matingPhaseDurationSeconds: 150,
    offspringStartEnergyRatio: 0.74,
    deathResetEnergyRatio: 0.68,
    energyDrainBase: 0.31,
    energyDrainMoveScale: 0.5,
    scorchDrainScale: 0.95,
    wetlandDrainScale: 0.74,
    lowEnergyRatio: 0.22,
    lowEnergyDamageBase: 0.48,
    lowEnergyDamageHazardScale: 0.28,
    passiveHealthRegen: 0.7,
    earlyLifeGraceSeconds: 42,
    earlyLifeDrainMult: 0.64,
    lowEnergyDamageGraceSeconds: 28,
    idleDrainScale: 0.44,
    idleThresholdRatio: 0.28,
    idleEnergyRecovery: 0.31,
    floraHealthGain: 1.2,
    preyHealthGain: 2.2,
    aquaticHealthGain: 1.7,
    avianHealthGain: 1.45,
    predatorContactDamage: 18,
    predatorKnockback: 4.8,
  },
  feeding: {
    floraGainBase: 0.42,
    preyGainBase: 0.5,
    aquaticGainBase: 0.44,
    avianGainBase: 0.38,
    floraRespawnMin: 12,
    floraRespawnMax: 20,
    floraTierRespawnScale: 0.05,
    preyRespawnMin: 9,
    preyRespawnMax: 16,
    preyTierRespawnScale: 0.04,
    preyEnergyMin: 10,
    preyEnergyMax: 16,
    aquaticRespawnMin: 8,
    aquaticRespawnMax: 14,
    avianRespawnMin: 10,
    avianRespawnMax: 17,
    aquaticEnergyMin: 8,
    aquaticEnergyMax: 14,
    avianEnergyMin: 7,
    avianEnergyMax: 13,
    chaseSuccessWindow: 8,
  },
  resources: {
    meadowShare: 0.58,
    scorchShare: 0.2,
    wetlandShare: 0.22,
    meadowEnergyMin: 9,
    meadowEnergyMax: 16,
    scorchEnergyMin: 11,
    scorchEnergyMax: 21,
    wetlandEnergyMin: 8,
    wetlandEnergyMax: 15,
    scorchRespawnScale: 1.18,
    wetlandRespawnScale: 0.9,
  },
  evolution: {
    mutationMin: -0.045,
    mutationMax: 0.045,
    parentWeight: 0.64,
    targetWeight: 0.28,
    dietCap: 1.3,
  },
  social: {
    preyFlockRadius: 11,
    preySeparationRadius: 2.2,
    preyAlignmentWeight: 0.78,
    preyCohesionWeight: 0.54,
    preySeparationWeight: 1.2,
    predatorPackRadius: 16,
    predatorSeparationRadius: 2.9,
    predatorAlignmentWeight: 0.48,
    predatorCohesionWeight: 0.38,
    predatorSeparationWeight: 0.88,
    predatorPackChaseBoost: 0.35,
  },
  phenotype: {
    liveBlendRate: 1.8,
    refreshMinSeconds: 2.4,
    refreshThreshold: 0.028,
    maxDietSum: 1.35,
  },
  fun: {
    comboWindowSeconds: 7,
    comboStep: 0.09,
    comboMaxBonus: 0.78,
    comboHealthScale: 0.45,
    objectiveEnergyRewardBase: 12,
    objectiveEnergyRewardScale: 2.2,
    objectiveHealthRewardBase: 3,
    objectiveHealthRewardScale: 0.75,
    objectiveTraitRewardBase: 0.018,
    objectiveTraitRewardScale: 0.0035,
    rescueEnergyRatio: 0.3,
    rescueEnergyBoost: 10,
    rescueHealthBoost: 6,
    rescueFloraCount: 5,
    rescueCooldownSeconds: 22,
    sprintSpeedMult: 1.18,
    sprintDrainMult: 1.22,
    burstSpeedMult: 1.5,
    burstDurationSeconds: 0.85,
    burstCooldownSeconds: 3.5,
    burstEnergyCost: 7,
    burstDrainPerSecond: 0.7,
  },
  save: {
    key: "apex_sim_save_v1",
    schema: 1,
    autosaveSeconds: 10,
    maxLineageEntries: 120,
  },
};

const DEFAULT_TRAITS = Object.freeze({
  speed: 0.34,
  stamina: 0.28,
  herbivore: 0.63,
  carnivore: 0.22,
  swim: 0.18,
  heat: 0.2,
  social: 0.2,
});
const TRAIT_KEYS = Object.keys(DEFAULT_TRAITS);
const TRAIT_SHORT = Object.freeze({
  speed: "spd",
  stamina: "stam",
  herbivore: "herb",
  carnivore: "carn",
  swim: "swim",
  heat: "heat",
  social: "social",
});

const DEFAULT_PHENOTYPE_DNA = Object.freeze({
  frame: 0.5,
  mass: 0.5,
  cranial: 0.5,
  limb: 0.5,
  dorsal: 0.5,
  tail: 0.5,
  pigment: 0.5,
  pattern: 0.5,
});
const PHENOTYPE_DNA_KEYS = Object.keys(DEFAULT_PHENOTYPE_DNA);
const PHENOTYPE_SKIN_CACHE = new Map();
const PHENOTYPE_SKIN_CACHE_MAX = 160;

const SPECIES_ARCHETYPES = Object.freeze({
  generalist: "Generalist",
  grazer: "Grazer",
  hunter: "Hunter",
  swimmer: "Swimmer",
  glider: "Glider",
});

const SPECIES_COMPATIBILITY = Object.freeze({
  generalist: Object.freeze({ generalist: 0.9, grazer: 0.84, hunter: 0.82, swimmer: 0.78, glider: 0.8 }),
  grazer: Object.freeze({ generalist: 0.84, grazer: 0.93, hunter: 0.52, swimmer: 0.66, glider: 0.72 }),
  hunter: Object.freeze({ generalist: 0.82, grazer: 0.52, hunter: 0.92, swimmer: 0.68, glider: 0.75 }),
  swimmer: Object.freeze({ generalist: 0.78, grazer: 0.66, hunter: 0.68, swimmer: 0.9, glider: 0.65 }),
  glider: Object.freeze({ generalist: 0.8, grazer: 0.72, hunter: 0.75, swimmer: 0.65, glider: 0.89 }),
});

const TONE_PROFILES = Object.freeze([
  {
    id: "scientific",
    label: "Scientific",
    energyDrainMult: 1.14,
    damageMult: 1.18,
    regenMult: 0.78,
    mutationScale: 0.58,
    targetWeightScale: 0.86,
    reproductionAgeMult: 1.12,
    reproductionEnergyMult: 1.08,
    reproductionHealthAdd: 5,
    mateRequirementScale: 1.2,
    rivalSpeedMult: 1.14,
    rivalClaimScale: 0.82,
    socialExposureMult: 0.84,
    cuteVisual: 0.15,
    cuteMotion: 0.2,
  },
  {
    id: "balanced",
    label: "Balanced",
    energyDrainMult: 1.0,
    damageMult: 1.0,
    regenMult: 1.0,
    mutationScale: 1.0,
    targetWeightScale: 1.0,
    reproductionAgeMult: 1.0,
    reproductionEnergyMult: 1.0,
    reproductionHealthAdd: 0,
    mateRequirementScale: 1.0,
    rivalSpeedMult: 1.0,
    rivalClaimScale: 1.0,
    socialExposureMult: 1.0,
    cuteVisual: 0.4,
    cuteMotion: 0.46,
  },
  {
    id: "stylized",
    label: "Stylized",
    energyDrainMult: 0.92,
    damageMult: 0.9,
    regenMult: 1.12,
    mutationScale: 1.08,
    targetWeightScale: 1.06,
    reproductionAgeMult: 0.9,
    reproductionEnergyMult: 0.92,
    reproductionHealthAdd: -4,
    mateRequirementScale: 0.86,
    rivalSpeedMult: 0.9,
    rivalClaimScale: 1.18,
    socialExposureMult: 1.1,
    cuteVisual: 0.68,
    cuteMotion: 0.72,
  },
]);

const toneState = {
  index: 1,
};

const WORLD = {
  baseRadius: BALANCE.world.baseRadius,
  tier: 1,
  radius: BALANCE.world.baseRadius,
  hazardScale: 1.0,
};

const KEY = Object.create(null);
const ACTIVE_CHASE = new Map();
const ACTIVE_THREATS = new Map();

const ui = {
  lineage: document.getElementById("lineage"),
  status: document.getElementById("status"),
  repro: document.getElementById("repro"),
  target: document.getElementById("target"),
  objective: document.getElementById("objective"),
  matingCallBtn: document.getElementById("matingCallBtn"),
  mateCards: document.getElementById("mateCards"),
  mateInfo: document.getElementById("mateInfo"),
  traits: document.getElementById("traits"),
  save: document.getElementById("save"),
  telemetry: document.getElementById("telemetry"),
  mapPanel: document.getElementById("mapPanel"),
  minimap: document.getElementById("minimap"),
  mapLegend: document.getElementById("mapLegend"),
  hint: document.getElementById("hint"),
  debug: document.getElementById("debug"),
};

const saveState = {
  loadedFromDisk: false,
  lastReason: "none",
  lastSavedAt: 0,
  error: "",
};

let actionMessage = "";
let actionMessageTimer = 0;
let selectedMateId = null;
let mateCardsRenderKey = "";
const matingPhase = {
  active: false,
  timer: 0,
};
const telemetry = {
  enabled: true,
  fps: 0,
  sampleFrames: 0,
  sampleTime: 0,
  births: 0,
  deaths: 0,
};

const funState = {
  comboCount: 0,
  comboTimer: 0,
  comboMultiplier: 1,
  lastFeedAt: -999,
  lastComboFlash: -999,
  objective: null,
  objectiveChain: 0,
  objectiveCounter: 0,
  rescueTimer: 0,
};

function toneProfile() {
  return TONE_PROFILES[toneState.index];
}

function setToneIndex(nextIndex) {
  const max = TONE_PROFILES.length - 1;
  toneState.index = clamp(Math.floor(nextIndex) || 0, 0, max);
}

function cycleToneProfile() {
  setToneIndex((toneState.index + 1) % TONE_PROFILES.length);
  refreshPlayerPhenotype(true);
  setActionMessage(`Tone mode: ${toneProfile().label}`, 2.4);
  saveSnapshot("tone-change");
}

function setPredatorMode(enabled, reason, silent) {
  BALANCE.gameplay.predatorsEnabled = !!enabled;
  ACTIVE_THREATS.clear();
  syncPopulation();
  if (!silent) {
    setActionMessage(`Predators ${BALANCE.gameplay.predatorsEnabled ? "enabled" : "disabled"}.`, 1.8);
  }
  if (reason) saveSnapshot(reason);
}

function togglePredatorMode() {
  setPredatorMode(!BALANCE.gameplay.predatorsEnabled, "predator-toggle", false);
}

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xd5e8b6, 0.0036);

const camera = new THREE.PerspectiveCamera(
  62,
  window.innerWidth / window.innerHeight,
  0.1,
  900
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false;
renderer.setClearColor(0xbfe2ff, 1);
renderer.domElement.id = "viewport";
document.body.appendChild(renderer.domElement);

const minimapCtx = ui.minimap ? ui.minimap.getContext("2d") : null;
const mapState = {
  enabled: true,
  range: 92,
};

const hemi = new THREE.HemisphereLight(0xfff7d8, 0xa6c278, 1.44);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff3cc, 1.26);
sun.position.set(56, 112, 44);
scene.add(sun);

const warmFill = new THREE.DirectionalLight(0xffe8ba, 0.4);
warmFill.position.set(-52, 64, -26);
scene.add(warmFill);

const zoneVisuals = [];
const BIOMES = {
  meadow: { id: "meadow", color: 0x82bc63, unlockTier: 1 },
  beach: { id: "beach", color: 0xe7cf93, unlockTier: 1 },
  rainforest: { id: "rainforest", color: 0x62ad57, unlockTier: 1 },
  highland: { id: "highland", color: 0xb3c07a, unlockTier: 2 },
  volcanic: { id: "volcanic", color: 0xcd864e, unlockTier: 2 },
  wetland: { id: "wetland", color: 0x8fbe6b, unlockTier: 3 },
  cloudforest: { id: "cloudforest", color: 0xb8cf8a, unlockTier: 3 },
};
const BIOME_INDEX = Object.fromEntries(Object.values(BIOMES).map((biome) => [biome.id, biome]));
const VOLCANIC_CENTER = new THREE.Vector3(42, 0, 22);
const VOLCANIC_RADIUS = 34;
const LAGOON_CENTER = new THREE.Vector3(-34, 0, -44);
const LAGOON_RADIUS = 36;
const worldDecor = [];
const TERRAIN = {
  size: 720,
  segments: 180,
  elevationScale: 6.4,
};

function terrainClimateAt(x, z) {
  const heat = clamp(
    0.52 +
      Math.sin(x * 0.012 + 1.7) * 0.21 +
      Math.cos(z * 0.011 - 0.9) * 0.18 +
      Math.sin((x - z) * 0.006) * 0.09,
    0,
    1
  );
  const moisture = clamp(
    0.49 +
      Math.cos(x * 0.009 - 1.3) * 0.24 +
      Math.sin(z * 0.012 + 0.4) * 0.2 +
      Math.cos((x + z) * 0.007) * 0.1,
    0,
    1
  );
  const rugged = clamp(
    0.45 +
      Math.sin(x * 0.02) * 0.2 +
      Math.cos(z * 0.022) * 0.18 +
      Math.sin((x + z) * 0.014) * 0.12,
    0,
    1
  );
  return { heat, moisture, rugged };
}

function baseTerrainHeightAt(x, z) {
  const r = Math.sqrt(x * x + z * z);
  const radial = Math.max(0, 1 - r / (WORLD.radius * 1.05));
  let h =
    Math.sin(x * 0.045) * 1.0 +
    Math.cos(z * 0.038) * 0.92 +
    Math.sin((x + z) * 0.022) * 0.8;
  h += Math.sin((x - z) * 0.018) * 0.7;
  h *= TERRAIN.elevationScale * 0.22;
  h += radial * 0.85;

  const alpineSpine = Math.exp(-Math.pow((z - 12) / 28, 2));
  h += alpineSpine * (1.25 + Math.sin(x * 0.042) * 0.52);

  const riftValley = Math.exp(-Math.pow((x + 24) / 20, 2));
  h -= riftValley * (1.4 + Math.cos(z * 0.052) * 0.38);

  return h - 0.85;
}

function biomeRegionAtXZ(x, z) {
  const r = Math.sqrt(x * x + z * z);
  if (r > WORLD.radius * 0.86) return BIOMES.beach.id;

  const climate = terrainClimateAt(x, z);
  const baseH = baseTerrainHeightAt(x, z);

  const vdx = x - VOLCANIC_CENTER.x;
  const vdz = z - VOLCANIC_CENTER.z;
  const volcanoFalloff = Math.exp(-(vdx * vdx + vdz * vdz) / (VOLCANIC_RADIUS * VOLCANIC_RADIUS));
  if (volcanoFalloff > 0.36 && climate.heat > 0.44) return BIOMES.volcanic.id;

  const ldx = x - LAGOON_CENTER.x;
  const ldz = z - LAGOON_CENTER.z;
  const lagoonFalloff = Math.exp(-(ldx * ldx + ldz * ldz) / (LAGOON_RADIUS * LAGOON_RADIUS));
  if (lagoonFalloff > 0.34 && (baseH < 0.12 || climate.moisture > 0.56)) return BIOMES.wetland.id;

  const mountainBias = baseH + climate.rugged * 1.1;
  if (mountainBias > 1.35) {
    if (climate.moisture > 0.54) return BIOMES.cloudforest.id;
    return BIOMES.highland.id;
  }

  if (climate.moisture > 0.62 && climate.heat > 0.34) return BIOMES.rainforest.id;
  if (climate.moisture > 0.52 && climate.heat < 0.3) return BIOMES.cloudforest.id;
  return BIOMES.meadow.id;
}

function biomeAtXZ(x, z) {
  const region = biomeRegionAtXZ(x, z);
  const config = BIOME_INDEX[region];
  if (!config) return BIOMES.meadow.id;
  if (WORLD.tier >= config.unlockTier) return region;
  if (region === BIOMES.beach.id || region === BIOMES.rainforest.id) return region;
  return BIOMES.meadow.id;
}

function terrainHeightAt(x, z) {
  const region = biomeRegionAtXZ(x, z);
  let h = baseTerrainHeightAt(x, z);
  const r = Math.sqrt(x * x + z * z);

  if (region === BIOMES.volcanic.id) {
    const vdx = x - VOLCANIC_CENTER.x;
    const vdz = z - VOLCANIC_CENTER.z;
    const d = Math.sqrt(vdx * vdx + vdz * vdz);
    const outer = clamp(1 - d / VOLCANIC_RADIUS, 0, 1);
    const crater = clamp(1 - d / (VOLCANIC_RADIUS * 0.44), 0, 1);
    h += Math.pow(outer, 1.55) * 3.3;
    h -= Math.pow(crater, 2.1) * 2.6;
    h += Math.sin((x + z) * 0.05) * 0.26;
  } else if (region === BIOMES.wetland.id) {
    const ldx = x - LAGOON_CENTER.x;
    const ldz = z - LAGOON_CENTER.z;
    const d = Math.sqrt(ldx * ldx + ldz * ldz);
    const basin = clamp(1 - d / LAGOON_RADIUS, 0, 1);
    h -= 1.1 + basin * 1.55;
    h += Math.cos((x - z) * 0.05) * 0.18;
  } else if (region === BIOMES.highland.id) {
    h += 1.05 + Math.sin(x * 0.03 + z * 0.02) * 0.24;
  } else if (region === BIOMES.cloudforest.id) {
    h += 0.55 + Math.cos(x * 0.026 - z * 0.02) * 0.2;
  } else if (region === BIOMES.rainforest.id) {
    h += 0.28 + Math.sin(x * 0.04 + z * 0.018) * 0.15;
  } else if (region === BIOMES.beach.id) {
    const coast = clamp((r - WORLD.radius * 0.82) / (WORLD.radius * 0.24), 0, 1);
    h -= 1.0 + coast * 0.75;
  }

  return h;
}

function buildTerrainTexture(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(size, size);
  const data = image.data;

  const half = TERRAIN.size * 0.5;
  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      const i = (py * size + px) * 4;
      const wx = (px / (size - 1)) * TERRAIN.size - half;
      const wz = (py / (size - 1)) * TERRAIN.size - half;
      const region = biomeAtXZ(wx, wz);
      const n =
        Math.sin(wx * 0.07) * 0.5 +
        Math.cos(wz * 0.09) * 0.4 +
        Math.sin((wx + wz) * 0.035) * 0.35;
      const shade = 0.92 + n * 0.11;

      let r = 134;
      let g = 178;
      let b = 102;
      if (region === BIOMES.beach.id) {
        r = 214;
        g = 189;
        b = 132;
      } else if (region === BIOMES.rainforest.id) {
        r = 88;
        g = 154;
        b = 90;
      } else if (region === BIOMES.highland.id) {
        r = 170;
        g = 178;
        b = 112;
      } else if (region === BIOMES.volcanic.id) {
        r = 176;
        g = 119;
        b = 74;
      } else if (region === BIOMES.wetland.id) {
        r = 120;
        g = 166;
        b = 115;
      } else if (region === BIOMES.cloudforest.id) {
        r = 156;
        g = 182;
        b = 128;
      }

      data[i] = clamp(Math.floor(r * shade), 0, 255);
      data[i + 1] = clamp(Math.floor(g * shade), 0, 255);
      data[i + 2] = clamp(Math.floor(b * shade), 0, 255);
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;
  return texture;
}

function buildGroundMesh() {
  const geometry = new THREE.PlaneGeometry(
    TERRAIN.size,
    TERRAIN.size,
    TERRAIN.segments,
    TERRAIN.segments
  );
  geometry.rotateX(-Math.PI / 2);

  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, terrainHeightAt(x, z));
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    map: buildTerrainTexture(512),
    roughness: 0.98,
    metalness: 0.02,
  });

  return new THREE.Mesh(geometry, material);
}

const ground = buildGroundMesh();
scene.add(ground);

function refreshGroundSurface() {
  const geometry = ground.geometry;
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, terrainHeightAt(x, z));
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();

  const oldMap = ground.material.map;
  ground.material.map = buildTerrainTexture(512);
  ground.material.needsUpdate = true;
  if (oldMap && typeof oldMap.dispose === "function") oldMap.dispose();
}

function placeAtSurface(v, offset) {
  v.y = terrainHeightAt(v.x, v.z) + offset;
}

function rebuildBiomeVisuals() {
  refreshGroundSurface();

  while (zoneVisuals.length > 0) {
    const mesh = zoneVisuals.pop();
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }

  const volcanic = new THREE.Mesh(
    new THREE.CircleGeometry(VOLCANIC_RADIUS, 36),
    new THREE.MeshBasicMaterial({ color: BIOMES.volcanic.color, transparent: true, opacity: 0.28 })
  );
  volcanic.rotation.x = -Math.PI / 2;
  volcanic.position.set(
    VOLCANIC_CENTER.x,
    terrainHeightAt(VOLCANIC_CENTER.x, VOLCANIC_CENTER.z) + 0.12,
    VOLCANIC_CENTER.z
  );
  volcanic.visible = WORLD.tier >= BIOMES.volcanic.unlockTier;
  scene.add(volcanic);
  zoneVisuals.push(volcanic);

  const wetland = new THREE.Mesh(
    new THREE.CircleGeometry(LAGOON_RADIUS, 36),
    new THREE.MeshBasicMaterial({ color: BIOMES.wetland.color, transparent: true, opacity: 0.3 })
  );
  wetland.rotation.x = -Math.PI / 2;
  wetland.position.set(
    LAGOON_CENTER.x,
    terrainHeightAt(LAGOON_CENTER.x, LAGOON_CENTER.z) + 0.12,
    LAGOON_CENTER.z
  );
  wetland.visible = WORLD.tier >= BIOMES.wetland.unlockTier;
  scene.add(wetland);
  zoneVisuals.push(wetland);
}

function biomeAt(v) {
  return biomeAtXZ(v.x, v.z);
}

function biomeLabel(id) {
  if (id === BIOMES.beach.id) return "beach";
  if (id === BIOMES.rainforest.id) return "rainforest";
  if (id === BIOMES.highland.id) return "highland";
  if (id === BIOMES.volcanic.id) return "volcanic";
  if (id === BIOMES.wetland.id) return "wetland";
  if (id === BIOMES.cloudforest.id) return "cloud-forest";
  return "meadow";
}

function biomeIsWaterLike(id) {
  return id === BIOMES.wetland.id || id === BIOMES.beach.id || id === BIOMES.cloudforest.id;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function randVec(radius) {
  const a = rand(0, Math.PI * 2);
  const r = Math.sqrt(Math.random()) * radius;
  return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
}

function unitXZ(v) {
  const out = new THREE.Vector3(v.x, 0, v.z);
  const n = out.length();
  if (n < 0.0001) return out.set(0, 0, 1);
  return out.multiplyScalar(1 / n);
}

function limitToWorld(v) {
  const d = Math.sqrt(v.x * v.x + v.z * v.z);
  const maxR = WORLD.radius - 2;
  if (d > maxR) {
    v.x = (v.x / d) * maxR;
    v.z = (v.z / d) * maxR;
  }
}

function makeSphere(color, r, seg) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(r, seg || 10, seg || 10),
    new THREE.MeshStandardMaterial({ color, roughness: 0.76, metalness: 0.06 })
  );
}

function disposeMaterial(material) {
  if (!material) return;
  if (Array.isArray(material)) {
    for (const entry of material) {
      if (entry && typeof entry.dispose === "function") entry.dispose();
    }
    return;
  }
  if (typeof material.dispose === "function") material.dispose();
}

function disposeMeshTree(root) {
  root.traverse((node) => {
    if (!node.isMesh) return;
    if (node.geometry && typeof node.geometry.dispose === "function") {
      node.geometry.dispose();
    }
    disposeMaterial(node.material);
  });
}

function seeded(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function jitter(base, spread, next) {
  return base + (next() * 2 - 1) * spread;
}

function removePhenotype(mesh) {
  const current = mesh.userData.phenotypeRig;
  if (!current) return;
  mesh.remove(current.group);
  disposeMeshTree(current.group);
  delete mesh.userData.phenotypeRig;
}

function setPhenotypeTint(mesh, hex) {
  const rig = mesh.userData.phenotypeRig;
  if (!rig) return;
  if (!rig.tintLayers) {
    for (const mat of rig.tintMaterials || []) {
      mat.color.setHex(hex);
    }
    return;
  }
  for (const layer of rig.tintLayers) {
    const color = new THREE.Color(hex);
    if (layer.h || layer.s || layer.l) {
      color.offsetHSL(layer.h || 0, layer.s || 0, layer.l || 0);
    }
    layer.material.color.copy(color);
  }
}

function clonePhenotypeDNA(source) {
  const out = {};
  for (const key of PHENOTYPE_DNA_KEYS) {
    const value = Number(source && source[key]);
    out[key] = Number.isFinite(value) ? clamp(value, 0, 1) : DEFAULT_PHENOTYPE_DNA[key];
  }
  return out;
}

function sanitizePhenotypeDNA(source) {
  const out = {};
  for (const key of PHENOTYPE_DNA_KEYS) {
    const value = Number(source && source[key]);
    out[key] = Number.isFinite(value) ? clamp(value, 0, 1) : DEFAULT_PHENOTYPE_DNA[key];
  }
  return out;
}

function wrap01(v) {
  const n = Number(v) || 0;
  return ((n % 1) + 1) % 1;
}

function phenotypeRoleHue(role) {
  if (role === "predator" || role === "rival") return 0.03;
  if (role === "aquatic") return 0.54;
  if (role === "avian") return 0.12;
  if (role === "mate") return 0.5;
  if (role === "player") return 0.29;
  return 0.24;
}

function randomPhenotypeDNA(seed, role, traits) {
  const next = seeded((seed >>> 0) ^ 0x9e3779b9);
  const t = sanitizeTraits(traits || DEFAULT_TRAITS);
  const biasByRole = {
    frame: role === "avian" ? 0.58 : role === "aquatic" ? 0.46 : role === "predator" ? 0.55 : 0.5,
    mass: role === "predator" ? 0.62 : role === "avian" ? 0.38 : 0.5,
    cranial: role === "predator" ? 0.62 : role === "mate" ? 0.48 : 0.5,
    limb: role === "aquatic" ? 0.22 : role === "avian" ? 0.68 : 0.5,
    dorsal: role === "predator" ? 0.64 : 0.5,
    tail: role === "aquatic" ? 0.72 : role === "avian" ? 0.55 : 0.5,
    pigment: role === "mate" ? 0.58 : role === "predator" ? 0.46 : 0.5,
    pattern: role === "predator" ? 0.66 : role === "avian" ? 0.6 : 0.5,
  };
  return sanitizePhenotypeDNA({
    frame: biasByRole.frame + (t.speed - 0.5) * 0.24 + (next() * 2 - 1) * 0.28,
    mass: biasByRole.mass + (t.stamina - 0.5) * 0.34 + (next() * 2 - 1) * 0.26,
    cranial: biasByRole.cranial + (t.carnivore - t.herbivore) * 0.22 + (next() * 2 - 1) * 0.24,
    limb: biasByRole.limb + (t.social - 0.5) * 0.18 + (next() * 2 - 1) * 0.3,
    dorsal: biasByRole.dorsal + (t.heat - 0.5) * 0.2 + (next() * 2 - 1) * 0.28,
    tail: biasByRole.tail + (t.swim - 0.5) * 0.3 + (next() * 2 - 1) * 0.24,
    pigment: biasByRole.pigment + (next() * 2 - 1) * 0.36,
    pattern: biasByRole.pattern + (next() * 2 - 1) * 0.34,
  });
}

function hybridizePhenotypeDNA(parentDNA, mateDNA, seed) {
  const a = sanitizePhenotypeDNA(parentDNA);
  const b = sanitizePhenotypeDNA(mateDNA);
  const next = seeded((seed >>> 0) ^ 0xa341316c);
  const out = {};
  for (const key of PHENOTYPE_DNA_KEYS) {
    const dominance = 0.58 + next() * 0.28;
    const parentDominant = next() < 0.5;
    const lhs = parentDominant ? a[key] : b[key];
    const rhs = parentDominant ? b[key] : a[key];
    const mutation = (next() * 2 - 1) * 0.06;
    out[key] = clamp(lhs * dominance + rhs * (1 - dominance) + mutation, 0, 1);
  }
  return out;
}

function phenotypeColorFromDNA(role, dnaSource, seed) {
  const dna = sanitizePhenotypeDNA(dnaSource);
  const next = seeded((seed >>> 0) ^ 0xc8013ea4);
  const h = wrap01(phenotypeRoleHue(role) + (dna.pigment - 0.5) * 0.16 + (next() * 2 - 1) * 0.035);
  const s = clamp(0.34 + dna.pattern * 0.45 + (next() * 2 - 1) * 0.07, 0.2, 0.86);
  const l = clamp(0.42 + dna.mass * 0.18 - dna.pigment * 0.08 + (next() * 2 - 1) * 0.06, 0.26, 0.78);
  return new THREE.Color().setHSL(h, s, l).getHex();
}

function phenotypeSkinCacheKey(baseColorHex, profile) {
  const color = new THREE.Color(baseColorHex);
  const hsl = {};
  color.getHSL(hsl);
  const dna = sanitizePhenotypeDNA(profile && profile.dna);
  const role = (profile && profile.role) || "neutral";
  const patternType = (profile && profile.patternType) || "stripes";
  const seedBin = ((Number(profile && profile.seed) || 1) >>> 0) % 31;
  return [
    role,
    patternType,
    Math.round(hsl.h * 24),
    Math.round(hsl.s * 14),
    Math.round(hsl.l * 14),
    Math.round(dna.pattern * 7),
    Math.round(dna.pigment * 7),
    Math.round(dna.mass * 7),
    Math.round(dna.tail * 7),
    seedBin,
  ].join(":");
}

function buildPhenotypeSkinTexture(baseColorHex, profile) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const base = new THREE.Color(baseColorHex);
  const dna = sanitizePhenotypeDNA(profile && profile.dna);
  const role = (profile && profile.role) || "neutral";
  const patternType = (profile && profile.patternType) || "stripes";
  const next = seeded((((profile && profile.seed) || 1) >>> 0) ^ 0x8f1bbcdc);

  const light = base.clone().offsetHSL(0.02, 0.06, 0.12);
  const mid = base.clone();
  const dark = base.clone().offsetHSL(-0.03, -0.06, -0.14);
  const accent = role === "predator"
    ? base.clone().offsetHSL(-0.02, 0.1, -0.2)
    : base.clone().offsetHSL(0.03 + (dna.pigment - 0.5) * 0.08, 0.1, -0.04);
  const warm = base.clone().offsetHSL(0.01, 0.04, 0.06);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, `#${light.getHexString()}`);
  gradient.addColorStop(0.46, `#${mid.getHexString()}`);
  gradient.addColorStop(1, `#${dark.getHexString()}`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const overlayCount = 5 + Math.round(dna.mass * 5 + dna.pattern * 4);
  for (let i = 0; i < overlayCount; i += 1) {
    const x = next() * canvas.width;
    const y = next() * canvas.height;
    const r = 5 + next() * 13;
    const alpha = 0.05 + next() * 0.08;
    ctx.fillStyle = `rgba(${Math.round(warm.r * 255)}, ${Math.round(warm.g * 255)}, ${Math.round(warm.b * 255)}, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  if (patternType === "spots") {
    const spotCount = 9 + Math.round(dna.pattern * 12);
    ctx.fillStyle = `rgba(${Math.round(accent.r * 255)}, ${Math.round(accent.g * 255)}, ${Math.round(accent.b * 255)}, 0.35)`;
    for (let i = 0; i < spotCount; i += 1) {
      const x = next() * canvas.width;
      const y = next() * canvas.height;
      const r = 1.5 + next() * (4 + dna.pattern * 4);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (patternType === "saddle") {
    const bandWidth = 8 + dna.pattern * 16;
    ctx.fillStyle = `rgba(${Math.round(accent.r * 255)}, ${Math.round(accent.g * 255)}, ${Math.round(accent.b * 255)}, 0.28)`;
    ctx.fillRect(0, canvas.height * 0.18, canvas.width, bandWidth);
    ctx.fillRect(0, canvas.height * 0.62, canvas.width, bandWidth * 0.75);
    ctx.strokeStyle = `rgba(${Math.round(dark.r * 255)}, ${Math.round(dark.g * 255)}, ${Math.round(dark.b * 255)}, 0.28)`;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, canvas.height * 0.18, canvas.width, bandWidth);
  } else if (patternType === "rosette") {
    const ringCount = 7 + Math.round(dna.pattern * 10);
    ctx.strokeStyle = `rgba(${Math.round(accent.r * 255)}, ${Math.round(accent.g * 255)}, ${Math.round(accent.b * 255)}, 0.34)`;
    ctx.lineWidth = 1.8;
    for (let i = 0; i < ringCount; i += 1) {
      const x = next() * canvas.width;
      const y = next() * canvas.height;
      const r = 2 + next() * 4.8;
      ctx.beginPath();
      ctx.ellipse(x, y, r * (0.86 + next() * 0.4), r * (0.86 + next() * 0.4), next() * Math.PI, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    const stripeCount = 4 + Math.round(dna.pattern * 6);
    ctx.strokeStyle = `rgba(${Math.round(accent.r * 255)}, ${Math.round(accent.g * 255)}, ${Math.round(accent.b * 255)}, 0.28)`;
    ctx.lineWidth = 2 + dna.pattern * 2.6;
    for (let i = 0; i < stripeCount; i += 1) {
      const y = (i + 0.5) * (canvas.height / stripeCount);
      const wobble = (next() * 2 - 1) * 6.5;
      ctx.beginPath();
      ctx.moveTo(0, y + wobble);
      ctx.bezierCurveTo(
        canvas.width * 0.3,
        y - wobble * 0.55,
        canvas.width * 0.68,
        y + wobble * 0.55,
        canvas.width,
        y - wobble
      );
      ctx.stroke();
    }
  }

  const noiseCount = 44 + Math.round(dna.pattern * 64);
  const noiseColor = dna.pigment > 0.52 ? dark : light;
  for (let i = 0; i < noiseCount; i += 1) {
    const x = Math.floor(next() * canvas.width);
    const y = Math.floor(next() * canvas.height);
    const alpha = 0.035 + next() * 0.07;
    ctx.fillStyle = `rgba(${Math.round(noiseColor.r * 255)}, ${Math.round(noiseColor.g * 255)}, ${Math.round(noiseColor.b * 255)}, ${alpha.toFixed(3)})`;
    ctx.fillRect(x, y, 1 + (next() > 0.86 ? 1 : 0), 1 + (next() > 0.9 ? 1 : 0));
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function getPhenotypeSkinTexture(baseColorHex, profile) {
  const key = phenotypeSkinCacheKey(baseColorHex, profile);
  if (PHENOTYPE_SKIN_CACHE.has(key)) {
    return PHENOTYPE_SKIN_CACHE.get(key);
  }
  const texture = buildPhenotypeSkinTexture(baseColorHex, profile);
  if (!texture) return null;
  PHENOTYPE_SKIN_CACHE.set(key, texture);
  if (PHENOTYPE_SKIN_CACHE.size > PHENOTYPE_SKIN_CACHE_MAX) {
    const oldest = PHENOTYPE_SKIN_CACHE.keys().next();
    if (!oldest.done) {
      const stale = PHENOTYPE_SKIN_CACHE.get(oldest.value);
      if (stale && typeof stale.dispose === "function") stale.dispose();
      PHENOTYPE_SKIN_CACHE.delete(oldest.value);
    }
  }
  return texture;
}

function speciesFromTraits(traits, dnaSource) {
  const t = sanitizeTraits(traits);
  const dna = sanitizePhenotypeDNA(dnaSource || t);
  if (t.swim > 0.62 && dna.tail > 0.58) return "swimmer";
  if (t.carnivore > t.herbivore + 0.24 && t.speed > 0.38) return "hunter";
  if (t.herbivore > t.carnivore + 0.24 && t.stamina > 0.32) return "grazer";
  if (t.speed > 0.58 && t.social > 0.45 && dna.limb > 0.55) return "glider";
  return "generalist";
}

function phenotypeDNADistance(a, b) {
  const lhs = sanitizePhenotypeDNA(a);
  const rhs = sanitizePhenotypeDNA(b);
  let sum = 0;
  for (const key of PHENOTYPE_DNA_KEYS) {
    sum += Math.abs(lhs[key] - rhs[key]);
  }
  return sum / PHENOTYPE_DNA_KEYS.length;
}

function mateCompatibilityTier(score) {
  if (score >= 0.8) return "ideal";
  if (score >= 0.62) return "viable";
  if (score >= 0.45) return "risky";
  return "fragile";
}

function mateCompatibilityColor(tier) {
  if (tier === "ideal") return 0x97f87f;
  if (tier === "viable") return 0x93d6ff;
  if (tier === "risky") return 0xffcf8f;
  return 0xff8f8f;
}

function tintAdjust(hex, h, s, l) {
  const color = new THREE.Color(hex);
  color.offsetHSL(h || 0, s || 0, l || 0);
  return color.getHex();
}

function evaluateMateCompatibility(playerTraits, playerDNA, mateTraits, mateDNA) {
  const playerSpecies = speciesFromTraits(playerTraits, playerDNA);
  const mateSpecies = speciesFromTraits(mateTraits, mateDNA);
  const speciesBase =
    (SPECIES_COMPATIBILITY[playerSpecies] && SPECIES_COMPATIBILITY[playerSpecies][mateSpecies]) || 0.66;
  const traitFit = 1 - traitDistance(playerTraits, mateTraits) * 0.7;
  const dnaFit = 1 - phenotypeDNADistance(playerDNA, mateDNA) * 0.58;
  const score = clamp(speciesBase * 0.52 + traitFit * 0.3 + dnaFit * 0.18, 0.1, 1);
  return {
    score,
    tier: mateCompatibilityTier(score),
    playerSpecies,
    mateSpecies,
    playerSpeciesLabel: SPECIES_ARCHETYPES[playerSpecies] || "Unknown",
    mateSpeciesLabel: SPECIES_ARCHETYPES[mateSpecies] || "Unknown",
  };
}

function makePhenotypeProfile(opts) {
  const next = seeded(opts.seed || 1);
  const t = sanitizeTraits(opts.traits || DEFAULT_TRAITS);
  const role = opts.role || "neutral";
  const heritage = sanitizeTraits(opts.heritage || t);
  const dna = sanitizePhenotypeDNA(opts.dna || t);
  const generation = clamp(Math.floor(Number(opts.generation) || 1), 1, 9999);
  const generationProgress = clamp((generation - 1) / 10, 0, 1);
  const tone = toneProfile();
  const cute = tone.cuteVisual;

  let bodyScale = new THREE.Vector3(
    clamp(jitter(1 + t.speed * 0.55 + t.carnivore * 0.35, 0.18, next), 0.7, 1.9),
    clamp(jitter(0.85 + t.stamina * 0.7, 0.14, next), 0.65, 1.7),
    clamp(jitter(0.9 + t.herbivore * 0.4 + t.swim * 0.35, 0.14, next), 0.65, 1.8)
  );
  const avgScale = (bodyScale.x + bodyScale.y + bodyScale.z) / 3;
  bodyScale.lerp(
    new THREE.Vector3(avgScale * 1.03, avgScale * 0.96, avgScale * 1.02),
    cute * 0.28
  );
  bodyScale.set(
    clamp(bodyScale.x * (0.82 + dna.frame * 0.42), 0.62, 2.22),
    clamp(bodyScale.y * (0.78 + dna.mass * 0.5), 0.58, 2.08),
    clamp(bodyScale.z * (0.8 + dna.frame * 0.18 + dna.tail * 0.28), 0.6, 2.2)
  );

  let appendageType = "spike";
  if (t.swim > 0.56) appendageType = "fin";
  if (t.herbivore > t.carnivore + 0.2) appendageType = "leg";
  if (role === "predator") appendageType = "spike";
  if (role === "prey" && t.swim < 0.55) appendageType = "leg";
  if (cute > 0.93 && appendageType === "spike" && role !== "predator") appendageType = "leg";
  if (dna.limb < 0.28 && t.swim > 0.26) appendageType = "fin";
  if (dna.limb > 0.72 && appendageType !== "fin") appendageType = "leg";

  const baseAppendageCount = clamp(
    Math.round(2 + t.speed * 2 + t.carnivore * 3 + t.social * 2 + next() * 3),
    2,
    9
  );
  let appendageCount = clamp(
    Math.round(baseAppendageCount * (1 - cute * 0.1) + cute * 0.8),
    2,
    9
  );
  appendageCount = clamp(Math.round(appendageCount + (dna.pattern - 0.5) * 3), 2, 10);

  let dorsalCount = clamp(
    Math.round((t.carnivore * 3 + t.heat * 2 + next() * 2) * (1 - cute * 0.15)),
    0,
    5
  );
  dorsalCount = clamp(Math.round(dorsalCount + (dna.dorsal - 0.5) * 3), 0, 6);
  let tailLength = clamp(0.3 + t.speed * 0.7 + t.swim * 0.5 + next() * 0.25, 0.2, 1.65);
  tailLength = clamp(tailLength * (0.8 + dna.tail * 0.52), 0.2, 2.2);
  const eyeScale = clamp(0.08 + t.social * 0.07 + next() * 0.06 + cute * 0.04, 0.06, 0.24);
  const eyeSpacing = clamp(0.12 + t.social * 0.1 + next() * 0.05, 0.12, 0.3);
  let bodyRadius = (0.72 + cute * 0.07) * (0.82 + dna.mass * 0.34);
  let appendageLength = clamp(
    (0.28 + t.speed * 0.45 + t.carnivore * 0.35 + next() * 0.24) * (1 - cute * 0.14),
    0.18,
    1.18
  );
  appendageLength = clamp(appendageLength * (0.8 + dna.limb * 0.44), 0.16, 1.6);
  let snoutLength = clamp(0.18 + t.carnivore * 0.42 + t.herbivore * 0.18 + next() * 0.1, 0.16, 0.7);
  snoutLength = clamp(snoutLength * (0.76 + dna.cranial * 0.56), 0.14, 0.98);
  let crestHeight = clamp((0.12 + t.carnivore * 0.28 + t.heat * 0.18) * (1 - cute * 0.12), 0.05, 0.46);
  crestHeight = clamp(crestHeight * (0.72 + dna.dorsal * 0.7), 0.03, 0.72);
  const earSize = clamp(0.1 + t.social * 0.2 + cute * 0.1 + next() * 0.06, 0.08, 0.44);
  let stripeCount = clamp(Math.round(1 + t.carnivore * 2 + t.heat * 1.5 + next() * 1.5), 1, 4);
  stripeCount = clamp(Math.round(stripeCount + (dna.pattern - 0.5) * 2), 1, 6);
  const patternRoll = dna.pattern * 0.7 + dna.pigment * 0.2 + next() * 0.45;
  let patternType = "stripes";
  if (patternRoll > 0.98) {
    patternType = "rosette";
  } else if (patternRoll > 0.78) {
    patternType = "spots";
  } else if (patternRoll < 0.34) {
    patternType = "saddle";
  }
  let headScale = new THREE.Vector3(
    clamp(bodyScale.x * (0.54 + t.social * 0.11 + cute * 0.06), 0.48, 1.15),
    clamp(bodyScale.y * (0.48 + t.stamina * 0.1 + cute * 0.05), 0.45, 1.1),
    clamp(bodyScale.z * (0.5 + t.carnivore * 0.16 + t.herbivore * 0.12), 0.45, 1.2)
  );
  headScale.set(
    clamp(headScale.x * (0.78 + dna.cranial * 0.5), 0.4, 1.45),
    clamp(headScale.y * (0.8 + dna.mass * 0.26), 0.4, 1.38),
    clamp(headScale.z * (0.8 + dna.cranial * 0.56), 0.4, 1.5)
  );
  let lobeCount = clamp(
    Math.round(2 + dna.frame * 2 + dna.pattern * 1.6 + next() * 2),
    1,
    5
  );
  const asymmetry = clamp(
    (Math.abs(dna.pigment - 0.5) * 1.6 + next() * 0.45) * (0.84 + (1 - cute) * 0.2),
    0,
    1
  );
  const stripeJitter = clamp(0.08 + dna.pattern * 0.2 + next() * 0.14, 0.06, 0.36);
  const cheekPuff = clamp(0.14 + dna.mass * 0.48 + dna.pattern * 0.16 + next() * 0.1, 0.08, 0.8);
  const tailSegments = clamp(Math.round(2 + dna.tail * 4 + next() * 2), 2, 8);
  const ornamentSpread = clamp(0.72 + dna.cranial * 0.48 + next() * 0.2, 0.72, 1.5);

  if (role === "player" && generation > 1) {
    const heritageBias = clamp((heritage.stamina + heritage.speed + heritage.carnivore) / 3, 0, 1);
    const scaleBoost = 1 + generationProgress * (0.14 + heritageBias * 0.12);
    bodyScale = bodyScale.clone().multiplyScalar(scaleBoost);
    headScale = headScale.clone().multiplyScalar(1 + generationProgress * (0.1 + heritage.social * 0.08));
    appendageCount = clamp(
      Math.round(appendageCount + generationProgress * 2.2 + heritage.speed * 1.1),
      2,
      10
    );
    dorsalCount = clamp(
      Math.round(dorsalCount + generationProgress * (1.2 + heritage.carnivore * 1.8)),
      0,
      6
    );
    tailLength = clamp(
      tailLength * (1 + generationProgress * (0.22 + heritage.speed * 0.14)),
      0.2,
      2.0
    );
    appendageLength = clamp(
      appendageLength * (1 + generationProgress * (0.18 + heritage.speed * 0.12)),
      0.18,
      1.45
    );
    crestHeight = clamp(
      crestHeight + generationProgress * 0.12 + heritage.carnivore * 0.05,
      0.05,
      0.6
    );
    snoutLength = clamp(
      snoutLength + generationProgress * 0.1 + heritage.carnivore * 0.04,
      0.16,
      0.9
    );
    stripeCount = clamp(
      Math.round(stripeCount + generationProgress * 1.6 + heritage.heat * 0.8),
      1,
      6
    );
    if (heritage.carnivore > 0.52 && patternType === "spots") patternType = "rosette";
    lobeCount = clamp(
      Math.round(lobeCount + generationProgress * (1 + heritage.social * 0.9)),
      2,
      6
    );
    bodyRadius = clamp(bodyRadius + generationProgress * 0.08, 0.7, 0.95);
  }

  return {
    seed: opts.seed || 1,
    generation,
    generationProgress,
    role,
    dna,
    appendageType,
    appendageCount,
    appendageLength,
    dorsalCount,
    tailLength,
    eyeScale,
    eyeSpacing,
    snoutLength,
    crestHeight,
    earSize,
    stripeCount,
    headScale,
    bodyScale,
    bodyRadius,
    lobeCount,
    asymmetry,
    stripeJitter,
    cheekPuff,
    tailSegments,
    ornamentSpread,
    patternType,
  };
}

function applyPhenotype(mesh, baseColor, profile) {
  removePhenotype(mesh);
  mesh.material.transparent = true;
  mesh.material.opacity = 0.035;

  const role = profile.role || "neutral";
  const bodyMat = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.62,
    metalness: 0.12,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(baseColor).offsetHSL(0.04, 0.05, 0.12),
    roughness: 0.5,
    metalness: 0.17,
  });
  const underMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(baseColor).offsetHSL(0, -0.08, 0.2),
    roughness: 0.66,
    metalness: 0.08,
  });
  const markMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(baseColor).offsetHSL(-0.03, 0.1, -0.12),
    roughness: 0.58,
    metalness: 0.14,
  });
  const ornamentMat = new THREE.MeshStandardMaterial({
    color:
      role === "predator"
        ? new THREE.Color(baseColor).offsetHSL(0.01, 0.08, -0.18)
        : new THREE.Color(baseColor).offsetHSL(0.06, 0.04, 0.02),
    roughness: 0.5,
    metalness: 0.22,
  });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xf7fbff, roughness: 0.34, metalness: 0.26 });
  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x12252d, roughness: 0.22, metalness: 0.08 });
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x15211f, transparent: true, opacity: 0.86 });
  const outlineMat = new THREE.MeshBasicMaterial({
    color: 0x0f1d18,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.35,
  });
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x06100d,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });
  const skinMap = getPhenotypeSkinTexture(baseColor, profile);
  if (skinMap) {
    bodyMat.map = skinMap;
    bodyMat.bumpMap = skinMap;
    bodyMat.bumpScale = 0.012;
    bodyMat.roughness = 0.58;

    accentMat.map = skinMap;
    accentMat.bumpMap = skinMap;
    accentMat.bumpScale = 0.016;
    accentMat.roughness = 0.48;

    underMat.map = skinMap;
    underMat.bumpMap = skinMap;
    underMat.bumpScale = 0.01;
    underMat.roughness = 0.62;

    markMat.map = skinMap;
    markMat.bumpMap = skinMap;
    markMat.bumpScale = 0.008;
  }

  const tintLayers = [
    { material: bodyMat, h: 0, s: 0, l: 0 },
    { material: accentMat, h: 0.04, s: 0.06, l: 0.1 },
    { material: underMat, h: 0, s: -0.08, l: 0.2 },
    { material: markMat, h: -0.03, s: 0.1, l: -0.12 },
    { material: ornamentMat, h: 0.02, s: 0.04, l: -0.08 },
  ];
  const tintMaterials = [bodyMat, accentMat, underMat, markMat, ornamentMat];
  const rig = new THREE.Group();
  const profileRand = seeded((profile.seed >>> 0) ^ 0x6a09e667);
  const appendages = [];
  const dorsal = [];
  const ornaments = [];
  const markings = [];
  const bodyLobes = [];

  const body = new THREE.Mesh(new THREE.SphereGeometry(profile.bodyRadius, 16, 16), bodyMat);
  body.scale.copy(profile.bodyScale);
  rig.add(body);

  const lobeCount = clamp(Math.round(profile.lobeCount || 1), 1, 6);
  for (let i = 0; i < lobeCount; i += 1) {
    const f = lobeCount === 1 ? 0.5 : i / (lobeCount - 1);
    const sideSign = i % 2 === 0 ? -1 : 1;
    const bulge = Math.sin(f * Math.PI);
    const lobeRadius = clamp(profile.bodyRadius * (0.28 + bulge * 0.34 + profileRand() * 0.12), 0.18, 0.7);
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(lobeRadius, 11, 11), i % 2 === 0 ? accentMat : underMat);
    lobe.scale.set(
      clamp(profile.bodyScale.x * (0.44 + bulge * 0.16 + profileRand() * 0.06), 0.22, 1.8),
      clamp(profile.bodyScale.y * (0.24 + bulge * 0.1 + profileRand() * 0.06), 0.18, 1.6),
      clamp(profile.bodyScale.z * (0.16 + bulge * 0.14 + profileRand() * 0.06), 0.12, 1.45)
    );
    const lobeX = sideSign * profile.bodyScale.x * (0.06 + (profile.asymmetry || 0) * (0.02 + profileRand() * 0.04));
    const lobeY = -profile.bodyScale.y * 0.13 + bulge * profile.bodyScale.y * 0.09;
    const lobeZ = -profile.bodyScale.z * 0.32 + f * profile.bodyScale.z * 0.68;
    lobe.position.set(lobeX, lobeY, lobeZ);
    lobe.userData.basePos = lobe.position.clone();
    lobe.userData.baseScale = lobe.scale.clone();
    bodyLobes.push({ mesh: lobe, phase: f * Math.PI * 2 });
    rig.add(lobe);
  }

  const bodyOutline = new THREE.Mesh(body.geometry, outlineMat);
  bodyOutline.scale.copy(profile.bodyScale).multiplyScalar(1.06);
  rig.add(bodyOutline);

  const headRadius = profile.bodyRadius * 0.64;
  const head = new THREE.Mesh(new THREE.SphereGeometry(headRadius, 14, 14), bodyMat);
  head.scale.copy(profile.headScale);
  head.position.set(0, profile.bodyScale.y * 0.04, profile.bodyScale.z * 0.84);
  rig.add(head);

  const headOutline = new THREE.Mesh(head.geometry, outlineMat);
  headOutline.scale.copy(profile.headScale).multiplyScalar(1.07);
  headOutline.position.copy(head.position);
  rig.add(headOutline);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(profile.bodyRadius * 0.72, 12, 12), underMat);
  belly.scale.set(profile.bodyScale.x * 0.84, profile.bodyScale.y * 0.52, profile.bodyScale.z * 0.74);
  belly.position.set(0, -profile.bodyScale.y * 0.2, profile.bodyScale.z * 0.12);
  rig.add(belly);

  const patchJitter = profile.stripeJitter || 0.1;
  if (profile.patternType === "spots" || profile.patternType === "rosette") {
    const spotCount = profile.stripeCount * 2 + (profile.patternType === "rosette" ? 2 : 0);
    for (let i = 0; i < spotCount; i += 1) {
      const patch = new THREE.Mesh(
        new THREE.SphereGeometry(profile.bodyRadius * (profile.patternType === "rosette" ? 0.2 : 0.18), 9, 9),
        markMat
      );
      const side = i % 2 === 0 ? -1 : 1;
      const spotScale = profile.patternType === "rosette" ? 0.34 : 0.24;
      patch.scale.set(
        profile.bodyScale.x * (spotScale + profileRand() * 0.14),
        profile.bodyScale.y * (0.12 + profileRand() * 0.08),
        profile.bodyScale.z * (0.13 + profileRand() * 0.08)
      );
      patch.position.set(
        side * profile.bodyScale.x * (0.12 + profileRand() * 0.2),
        -profile.bodyScale.y * (0.12 + profileRand() * 0.2),
        -profile.bodyScale.z * 0.28 + profileRand() * profile.bodyScale.z * 0.84
      );
      patch.rotation.y = (profileRand() * 2 - 1) * 0.4;
      markings.push(patch);
      rig.add(patch);
    }
  } else if (profile.patternType === "saddle") {
    for (let i = 0; i < 2; i += 1) {
      const patch = new THREE.Mesh(new THREE.SphereGeometry(profile.bodyRadius * (0.31 - i * 0.04), 10, 10), markMat);
      patch.scale.set(
        profile.bodyScale.x * (0.72 - i * 0.14),
        profile.bodyScale.y * (0.19 - i * 0.03),
        profile.bodyScale.z * (0.23 - i * 0.04)
      );
      patch.position.set(0, profile.bodyScale.y * (0.04 + i * 0.05), -profile.bodyScale.z * (0.14 - i * 0.2));
      patch.rotation.y = (profileRand() * 2 - 1) * 0.2;
      markings.push(patch);
      rig.add(patch);
    }
  } else {
    for (let i = 0; i < profile.stripeCount; i += 1) {
      const patch = new THREE.Mesh(new THREE.SphereGeometry(profile.bodyRadius * 0.26, 9, 9), markMat);
      patch.scale.set(
        profile.bodyScale.x * (0.54 + profileRand() * 0.2),
        profile.bodyScale.y * (0.17 + profileRand() * 0.08),
        profile.bodyScale.z * (0.14 + profileRand() * 0.06)
      );
      const stripeSide = i % 2 === 0 ? -1 : 1;
      const xOffset =
        stripeSide * profile.bodyScale.x * patchJitter * (profileRand() * 0.55 + (profile.asymmetry || 0) * 0.28);
      patch.position.set(
        xOffset,
        profile.bodyScale.y * (0.05 + i * 0.08) + (profileRand() * 2 - 1) * profile.bodyScale.y * patchJitter * 0.16,
        -profile.bodyScale.z * 0.32 + i * profile.bodyScale.z * 0.22 + (profileRand() * 2 - 1) * profile.bodyScale.z * patchJitter * 0.22
      );
      patch.rotation.y = (profileRand() * 2 - 1) * 0.35;
      patch.rotation.x = (profileRand() * 2 - 1) * 0.25;
      markings.push(patch);
      rig.add(patch);
    }
  }

  const snout = new THREE.Mesh(
    new THREE.ConeGeometry(0.09 + profile.snoutLength * 0.18, profile.snoutLength, 10),
    underMat
  );
  snout.rotation.x = Math.PI / 2;
  snout.position.set(
    0,
    head.position.y - profile.headScale.y * 0.03,
    head.position.z + profile.headScale.z * 0.44
  );
  rig.add(snout);

  const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(0.065 + profile.snoutLength * 0.09, 0.01, 6, 12, Math.PI),
    mouthMat
  );
  mouth.position.set(0, snout.position.y - 0.02, snout.position.z + profile.snoutLength * 0.26);
  mouth.rotation.x = Math.PI / 2;
  rig.add(mouth);

  const cheekScale = clamp(profile.cheekPuff || 0.2, 0.08, 0.9);
  const cheekY = head.position.y + profile.headScale.y * 0.02;
  const cheekZ = head.position.z + profile.headScale.z * 0.3;
  for (const side of [-1, 1]) {
    const cheek = new THREE.Mesh(
      new THREE.SphereGeometry(profile.bodyRadius * (0.08 + cheekScale * 0.12), 10, 10),
      accentMat
    );
    cheek.scale.set(
      0.72 + cheekScale * 0.34,
      0.62 + cheekScale * 0.26,
      0.84 + cheekScale * 0.38
    );
    cheek.position.set(
      side * (profile.eyeSpacing * (0.72 + cheekScale * 0.2)),
      cheekY - profile.eyeScale * (0.66 + profileRand() * 0.2),
      cheekZ - profile.eyeScale * (0.22 + profileRand() * 0.14)
    );
    cheek.userData.basePos = cheek.position.clone();
    markings.push(cheek);
    rig.add(cheek);
  }

  for (const side of [-1, 1]) {
    const spread = profile.ornamentSpread || 1;
    const asymBias = (profile.asymmetry || 0) * side * 0.12;
    let ornament;
    if (profile.appendageType === "fin") {
      ornament = new THREE.Mesh(
        new THREE.BoxGeometry(profile.earSize * 0.2 * spread, profile.earSize * 0.05, profile.earSize * 0.48),
        ornamentMat
      );
      ornament.position.set(
        side * profile.headScale.x * (0.48 + spread * 0.08),
        head.position.y + profile.headScale.y * (0.1 + asymBias * 0.2),
        head.position.z
      );
      ornament.rotation.z = side * Math.PI * (0.17 + spread * 0.04);
      ornament.rotation.x = Math.PI * 0.12;
    } else {
      ornament = new THREE.Mesh(
        new THREE.ConeGeometry(profile.earSize * 0.16 * spread, profile.earSize * (0.88 + spread * 0.16), 8),
        ornamentMat
      );
      ornament.position.set(
        side * profile.headScale.x * (0.4 + spread * 0.06),
        head.position.y + profile.headScale.y * (0.28 + spread * 0.08 + asymBias),
        head.position.z - profile.headScale.z * 0.06
      );
      ornament.rotation.z = side * (-Math.PI * 0.2);
      ornament.rotation.x = role === "predator" ? Math.PI * 0.24 : Math.PI * 0.08;
    }
    ornaments.push({ mesh: ornament, rest: ornament.rotation.clone(), side });
    rig.add(ornament);
  }

  if (profile.crestHeight > 0.06) {
    for (let i = 0; i < 2; i += 1) {
      const crest = new THREE.Mesh(
        new THREE.ConeGeometry(0.055 + i * 0.01, profile.crestHeight + i * 0.06, 8),
        ornamentMat
      );
      crest.position.set(0, head.position.y + profile.headScale.y * (0.32 + i * 0.07), head.position.z - i * 0.08);
      crest.rotation.z = Math.PI;
      ornaments.push({ mesh: crest, rest: crest.rotation.clone(), side: 0 });
      rig.add(crest);
    }
  }

  for (let i = 0; i < profile.appendageCount; i += 1) {
    const ang = (i / profile.appendageCount) * Math.PI * 2;
    const dir = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang));
    const localVariance = 0.78 + profileRand() * 0.44;
    const asymSign = i % 2 === 0 ? -1 : 1;
    const asymScale = 1 + (profile.asymmetry || 0) * asymSign * 0.14;
    const limbLength = clamp(profile.appendageLength * localVariance * asymScale, 0.14, 1.9);
    const y = profile.appendageType === "leg" ? -profile.bodyScale.y * (0.46 + profileRand() * 0.16) : 0;
    let limb;
    if (profile.appendageType === "fin") {
      limb = new THREE.Mesh(
        new THREE.BoxGeometry(limbLength * 0.22, limbLength * 0.07, limbLength),
        accentMat
      );
      limb.position.copy(dir.clone().multiplyScalar(profile.bodyScale.x * 0.65));
      limb.position.y = y;
      limb.lookAt(limb.position.clone().add(dir));
    } else if (profile.appendageType === "leg") {
      limb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045 + profileRand() * 0.02, 0.07 + profileRand() * 0.03, limbLength, 7),
        accentMat
      );
      limb.position.copy(dir.clone().multiplyScalar(profile.bodyScale.x * 0.58));
      limb.position.y = y - limbLength * 0.35;
      limb.rotation.z = Math.sin(ang) * 0.25;
    } else {
      limb = new THREE.Mesh(
        new THREE.ConeGeometry(0.07 + profileRand() * 0.03, limbLength, 8),
        accentMat
      );
      limb.position.copy(dir.clone().multiplyScalar(profile.bodyScale.x * 0.66));
      limb.position.y = y;
      limb.lookAt(limb.position.clone().add(dir));
      limb.rotateX(Math.PI / 2);
    }
    appendages.push({
      mesh: limb,
      rest: limb.rotation.clone(),
      phase: (i / profile.appendageCount) * Math.PI * 2,
      stride: 0.86 + profileRand() * 0.4,
    });
    rig.add(limb);
  }

  for (let i = 0; i < profile.dorsalCount; i += 1) {
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.3 + i * 0.05, 8),
      accentMat
    );
    spike.position.set(
      -0.2 + i * 0.22 - profile.dorsalCount * 0.05,
      profile.bodyScale.y * 0.62,
      0
    );
    spike.rotation.z = Math.PI;
    dorsal.push({
      mesh: spike,
      rest: spike.rotation.clone(),
      phase: i * 0.75,
    });
    rig.add(spike);
  }

  const tail = new THREE.Group();
  tail.position.set(0, 0, -profile.bodyScale.z * 0.84);
  tail.rotation.x = Math.PI / 2;
  const tailParts = [];
  const tailSegmentCount = clamp(Math.round(profile.tailSegments || 3), 2, 8);
  const segGap = profile.tailLength / tailSegmentCount;
  for (let i = 0; i < tailSegmentCount; i += 1) {
    const f = i / Math.max(1, tailSegmentCount - 1);
    const segRadius = clamp((0.09 + profile.tailLength * 0.04) * (1 - f * 0.62), 0.025, 0.16);
    const seg = new THREE.Mesh(
      new THREE.SphereGeometry(segRadius, 9, 9),
      i % 2 === 0 ? accentMat : underMat
    );
    seg.scale.set(1 - f * 0.24, 1 - f * 0.28, 1 + f * 0.08);
    seg.position.set((profile.asymmetry || 0) * (f - 0.5) * 0.08, 0, -segGap * (i + 0.4));
    seg.userData.basePos = seg.position.clone();
    tailParts.push({ mesh: seg, phase: f * 1.8 });
    tail.add(seg);
  }
  const tailTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.055 + profile.tailLength * 0.015, 0.16 + profile.tailLength * 0.3, 9),
    accentMat
  );
  tailTip.position.set(0, 0, -profile.tailLength - segGap * 0.4);
  tailTip.rotation.x = Math.PI / 2;
  tail.add(tailTip);
  rig.add(tail);

  const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(profile.eyeScale, 10, 10), eyeMat);
  const eyeRight = eyeLeft.clone();
  const eyeY = head.position.y + profile.headScale.y * 0.1;
  const eyeZ = head.position.z + profile.headScale.z * 0.42;
  eyeLeft.position.set(-profile.eyeSpacing, eyeY, eyeZ);
  eyeRight.position.set(profile.eyeSpacing, eyeY, eyeZ);
  rig.add(eyeLeft);
  rig.add(eyeRight);

  const pupilLeft = new THREE.Mesh(new THREE.SphereGeometry(profile.eyeScale * 0.45, 8, 8), pupilMat);
  const pupilRight = pupilLeft.clone();
  pupilLeft.position.set(-profile.eyeSpacing, eyeY, eyeZ + profile.eyeScale * 0.72);
  pupilRight.position.set(profile.eyeSpacing, eyeY, eyeZ + profile.eyeScale * 0.72);
  pupilLeft.userData.basePos = pupilLeft.position.clone();
  pupilRight.userData.basePos = pupilRight.position.clone();
  rig.add(pupilLeft);
  rig.add(pupilRight);

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.86, 18), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -profile.bodyScale.y * 0.62 + 0.02;
  shadow.scale.set(profile.bodyScale.x * 0.95, profile.bodyScale.z * 0.95, 1);
  rig.add(shadow);

  mesh.add(rig);
  mesh.userData.phenotypeRig = {
    group: rig,
    body,
    bodyLobes,
    head,
    snout: { mesh: snout, rest: snout.rotation.clone() },
    mouth: { mesh: mouth, rest: mouth.rotation.clone() },
    tail: { mesh: tail, rest: tail.rotation.clone(), segments: tailParts, tip: tailTip },
    shadow,
    eyes: [eyeLeft, eyeRight],
    pupils: [pupilLeft, pupilRight],
    ornaments,
    markings,
    appendages,
    dorsal,
    tintMaterials,
    tintLayers,
    profile,
    idleSeed: ((profile.seed >>> 0) % 997) / 997,
  };
}

function animatePhenotype(mesh, speedNorm, t, dt) {
  const rig = mesh.userData.phenotypeRig;
  if (!rig) return;

  const tone = toneProfile();
  const profile = rig.profile;
  const speed = clamp(speedNorm, 0, 1);
  const locomotion = 2.1 + speed * 6.6;
  const phase = t * locomotion + rig.idleSeed * Math.PI * 2;
  const cuteMotion = tone.cuteMotion;
  const idle = (0.12 + speed * 0.88) * (0.92 + cuteMotion * 0.14);

  rig.group.position.y = Math.sin(phase * 0.85) * (0.018 + idle * (0.055 + cuteMotion * 0.015));

  if (rig.body) {
    rig.body.rotation.z = Math.sin(phase * 0.4) * (0.02 + speed * (0.08 + cuteMotion * 0.03));
    rig.body.rotation.x = Math.cos(phase * 0.35) * (0.01 + speed * (0.04 + cuteMotion * 0.02));
  }

  if (rig.bodyLobes) {
    for (const lobe of rig.bodyLobes) {
      const basePos = lobe.mesh.userData.basePos;
      const baseScale = lobe.mesh.userData.baseScale;
      const pulse = Math.sin(phase * 0.52 + lobe.phase) * (0.04 + speed * 0.07);
      if (basePos) {
        lobe.mesh.position.x = basePos.x + Math.sin(phase * 0.36 + lobe.phase) * 0.02;
        lobe.mesh.position.y = basePos.y + pulse * 0.04;
      }
      if (baseScale) {
        lobe.mesh.scale.y = baseScale.y * (1 + pulse * 0.16);
        lobe.mesh.scale.z = baseScale.z * (1 - pulse * 0.1);
      }
    }
  }

  if (rig.head) {
    rig.head.rotation.y = Math.sin(phase * 0.44) * (0.06 + speed * 0.08);
    rig.head.rotation.x = Math.cos(phase * 0.36) * (0.03 + speed * 0.05);
    rig.head.position.y = profile.bodyScale.y * 0.04 + Math.sin(phase * 0.74) * 0.03;
  }

  if (rig.snout) {
    rig.snout.mesh.rotation.x = rig.snout.rest.x + Math.cos(phase * 0.52) * (0.02 + speed * 0.04);
  }

  if (rig.mouth) {
    rig.mouth.mesh.rotation.z = rig.mouth.rest.z + Math.sin(phase * 0.38) * 0.08;
  }

  if (rig.tail) {
    const tailWag = (profile.appendageType === "fin" ? 0.45 : 0.28) + cuteMotion * 0.04;
    rig.tail.mesh.rotation.y = rig.tail.rest.y + Math.sin(phase * 0.9) * (tailWag * idle);
    rig.tail.mesh.rotation.x = rig.tail.rest.x + Math.cos(phase * 0.6) * 0.08 * idle;
    if (rig.tail.segments) {
      for (const segment of rig.tail.segments) {
        const basePos = segment.mesh.userData.basePos;
        if (!basePos) continue;
        const sway = Math.sin(phase * 1.1 + segment.phase * 2.4) * 0.08 * idle;
        segment.mesh.position.x = basePos.x + sway;
        segment.mesh.position.y = basePos.y + Math.cos(phase * 0.8 + segment.phase) * 0.018 * idle;
      }
    }
    if (rig.tail.tip) {
      rig.tail.tip.rotation.z = Math.sin(phase * 1.2) * 0.22 * idle;
    }
  }

  for (const limb of rig.appendages) {
    if (profile.appendageType === "leg") {
      const stride = limb.stride || 1;
      limb.mesh.rotation.x =
        limb.rest.x + Math.sin(phase + limb.phase) * (0.22 + speed * (0.72 + cuteMotion * 0.07)) * stride;
      limb.mesh.rotation.z = limb.rest.z + Math.cos(phase * 0.6 + limb.phase) * 0.12 * stride;
      continue;
    }
    if (profile.appendageType === "fin") {
      const stride = limb.stride || 1;
      limb.mesh.rotation.z =
        limb.rest.z + Math.sin(phase * 0.8 + limb.phase) * (0.14 + speed * (0.28 + cuteMotion * 0.06)) * stride;
      limb.mesh.rotation.y = limb.rest.y + Math.cos(phase * 0.7 + limb.phase) * 0.12 * stride;
      continue;
    }
    limb.mesh.rotation.x =
      limb.rest.x + Math.sin(phase * 0.45 + limb.phase) * (0.04 + speed * 0.08) * (limb.stride || 1);
  }

  for (const spine of rig.dorsal) {
    spine.mesh.rotation.x = spine.rest.x + Math.sin(phase * 0.5 + spine.phase) * (0.04 + speed * 0.06);
    spine.mesh.rotation.z = spine.rest.z + Math.cos(phase * 0.6 + spine.phase) * 0.04;
  }

  const blinkPulse = Math.sin(t * 0.87 + rig.idleSeed * 23);
  const blink = blinkPulse > 0.93 ? clamp((blinkPulse - 0.93) / 0.07, 0, 1) : 0;
  const eyeOpen = 1 - blink * 0.88;
  if (rig.eyes) {
    for (const eye of rig.eyes) {
      eye.scale.y = eyeOpen;
      eye.scale.x = 1 + blink * 0.05;
    }
  }

  if (rig.pupils) {
    const gaze = Math.sin(phase * 0.22) * 0.03;
    for (const pupil of rig.pupils) {
      const basePos = pupil.userData.basePos;
      pupil.scale.y = eyeOpen;
      if (basePos) {
        pupil.position.x = basePos.x + gaze * 0.42;
        pupil.position.y = basePos.y + Math.cos(phase * 0.3) * 0.012;
        pupil.position.z = basePos.z + gaze * 0.28;
      }
    }
  }

  if (rig.ornaments) {
    for (const ornament of rig.ornaments) {
      ornament.mesh.rotation.x =
        ornament.rest.x + Math.cos(phase * 0.6 + ornament.side) * (0.03 + speed * 0.05);
      ornament.mesh.rotation.z =
        ornament.rest.z + Math.sin(phase * 0.55 + ornament.side) * 0.04;
    }
  }

  if (rig.markings) {
    for (let i = 0; i < rig.markings.length; i += 1) {
      const mark = rig.markings[i];
      mark.scale.y = 1 + Math.sin(phase * 0.42 + i * 0.8) * 0.06;
    }
  }

  if (rig.shadow) {
    const squash = 1 + speed * 0.12;
    const stretch = 1 - speed * 0.08;
    rig.shadow.scale.x = profile.bodyScale.x * 0.95 * squash;
    rig.shadow.scale.y = profile.bodyScale.z * 0.95 * stretch;
    rig.shadow.material.opacity = 0.21 + speed * 0.06;
  }
}

function orientMeshToVelocity(mesh, velocity, dt, turnRate) {
  const v2 = velocity.x * velocity.x + velocity.z * velocity.z;
  if (v2 < 0.01) return;
  const targetYaw = Math.atan2(velocity.x, velocity.z);
  const blend = 1 - Math.exp(-dt * (turnRate || 8));
  mesh.rotation.y += (targetYaw - mesh.rotation.y) * blend;
}

const player = {
  mesh: makeSphere(0xe7f4c6, 1.3, 14),
  pos: new THREE.Vector3(0, 0, 0),
  forward: new THREE.Vector3(0, 0, 1),
  vel: new THREE.Vector3(),
  energy: 78,
  health: 100,
  age: 0,
  generation: 1,
  lineage: [],
  reproductionCooldown: 0,
  fertilityQuality: 1,
  traits: { ...DEFAULT_TRAITS },
  phenotypeHeritage: { ...DEFAULT_TRAITS },
  phenotypeDNA: { ...DEFAULT_PHENOTYPE_DNA },
  morphTraits: { ...DEFAULT_TRAITS },
  renderedMorphTraits: { ...DEFAULT_TRAITS },
  morphSeed: 911,
  morphLabel: "balanced legged grazer",
  morphRefreshTimer: 0,
  burstCooldown: 0,
  burstTimer: 0,
  marker: null,
  metrics: resetMetrics(),
};
const PLAYER_HEIGHT_OFFSET = 1.3;
placeAtSurface(player.pos, PLAYER_HEIGHT_OFFSET);
player.mesh.position.copy(player.pos);
scene.add(player.mesh);

function ensurePlayerMarker() {
  if (player.marker) return;
  const group = new THREE.Group();

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.18, 0.055, 10, 36),
    new THREE.MeshBasicMaterial({ color: 0xb9ffe3, transparent: true, opacity: 0.85 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.04;
  group.add(ring);

  const beacon = new THREE.Mesh(
    new THREE.ConeGeometry(0.13, 0.34, 10),
    new THREE.MeshBasicMaterial({ color: 0xd9fff3, transparent: true, opacity: 0.9 })
  );
  beacon.position.y = 1.86;
  group.add(beacon);

  player.mesh.add(group);
  player.marker = { group, ring, beacon };
}

function createLabelSprite(text, fg, bg, options) {
  const width = clamp(Math.floor((options && options.width) || 128), 64, 512);
  const height = clamp(Math.floor((options && options.height) || 64), 32, 256);
  const inset = clamp(Math.floor((options && options.inset) || 4), 1, Math.floor(Math.min(width, height) * 0.25));
  const radius = clamp(Math.floor((options && options.radius) || 14), 0, Math.floor(Math.min(width, height) * 0.45));
  const strokeWidth = clamp(Number((options && options.strokeWidth) || 3), 0, 10);
  const fontSize = clamp(
    Math.floor(
      (options && options.fontSize) ||
        (text && text.length > 7 ? height * 0.36 : text && text.length > 4 ? height * 0.42 : height * 0.5)
    ),
    10,
    56
  );
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = bg || "rgba(8, 26, 22, 0.78)";
  ctx.strokeStyle = (options && options.strokeColor) || "rgba(199, 236, 222, 0.75)";
  ctx.lineWidth = strokeWidth;
  const bodyX = inset;
  const bodyY = inset + 2;
  const bodyW = width - inset * 2;
  const bodyH = height - (inset + 2) * 2;
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(bodyX, bodyY, bodyW, bodyH, radius);
    ctx.fill();
    if (strokeWidth > 0) ctx.stroke();
  } else {
    ctx.fillRect(bodyX, bodyY, bodyW, bodyH);
    if (strokeWidth > 0) ctx.strokeRect(bodyX, bodyY, bodyW, bodyH);
  }

  ctx.fillStyle = fg || "#eafff3";
  ctx.font = `700 ${fontSize}px 'Avenir Next', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width * 0.5, height * 0.52);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  const scaleX = Number((options && options.scaleX) || 1.55);
  const scaleY = Number((options && options.scaleY) || 0.78);
  sprite.scale.set(scaleX, scaleY, 1);
  return sprite;
}

function createMateMarker(mesh, label, keyHint) {
  const group = new THREE.Group();

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x93ddff,
    transparent: true,
    opacity: 0.9,
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.05, 10, 32), ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.92;
  group.add(ring);

  const beamMaterial = new THREE.MeshBasicMaterial({
    color: 0x8acfff,
    transparent: true,
    opacity: 0.55,
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.05, 8), beamMaterial);
  beam.position.y = 1.5;
  group.add(beam);

  const tipMaterial = new THREE.MeshBasicMaterial({
    color: 0xd2f3ff,
    transparent: true,
    opacity: 0.95,
  });
  const tip = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), tipMaterial);
  tip.position.y = 2.08;
  group.add(tip);

  const tag = createLabelSprite(label || "M", "#e8fff5", "rgba(14, 40, 34, 0.86)");
  tag.position.y = 2.65;
  group.add(tag);

  const keyTag = createLabelSprite(
    `Press ${keyHint || "1"}`,
    "#fff8db",
    "rgba(67, 96, 43, 0.9)",
    { width: 188, height: 56, fontSize: 22, scaleX: 2.15, scaleY: 0.72, radius: 12, strokeColor: "rgba(236, 242, 171, 0.85)" }
  );
  keyTag.position.y = 3.37;
  group.add(keyTag);

  const actionTag = createLabelSprite(
    "Press E",
    "#fefdd5",
    "rgba(132, 122, 48, 0.92)",
    { width: 168, height: 56, fontSize: 22, scaleX: 1.95, scaleY: 0.7, radius: 12, strokeColor: "rgba(248, 234, 150, 0.84)" }
  );
  actionTag.position.y = 4.02;
  actionTag.visible = false;
  group.add(actionTag);

  mesh.add(group);
  return { group, ring, beam, tip, tag, keyTag, actionTag, ringMaterial, beamMaterial, tipMaterial };
}

function createRivalMarker(mesh, label) {
  const group = new THREE.Group();
  const warnMaterial = new THREE.MeshBasicMaterial({
    color: 0xffb56e,
    transparent: true,
    opacity: 0.92,
  });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.35, 10), warnMaterial);
  cone.position.y = 1.72;
  group.add(cone);

  const tag = createLabelSprite(label || "R", "#ffe8d6", "rgba(52, 22, 10, 0.84)");
  tag.position.y = 2.25;
  tag.scale.set(1.4, 0.72, 1);
  group.add(tag);
  mesh.add(group);
  return { group, cone, tag, warnMaterial };
}

function createMateLockVisual() {
  const positions = new Float32Array(6);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x95dcff,
    transparent: true,
    opacity: 0.84,
  });
  const line = new THREE.Line(geometry, lineMaterial);
  line.frustumCulled = false;

  const tipMaterial = new THREE.MeshBasicMaterial({
    color: 0xdff5ff,
    transparent: true,
    opacity: 0.94,
  });
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.36, 10), tipMaterial);
  tip.rotation.x = Math.PI;

  const group = new THREE.Group();
  group.visible = false;
  group.add(line);
  group.add(tip);
  scene.add(group);

  return { group, line, tip, positions, lineMaterial, tipMaterial };
}

const mateLockVisual = createMateLockVisual();
const mateLockStart = new THREE.Vector3();
const mateLockEnd = new THREE.Vector3();
const mateLockDir = new THREE.Vector3();
const mateLockTipPos = new THREE.Vector3();

function phenotypeLabel(traits, profile) {
  const diet =
    traits.carnivore > traits.herbivore + 0.16
      ? "hunter"
      : traits.herbivore > traits.carnivore + 0.16
        ? "grazer"
        : "omnivore";
  const locomotion =
    profile.appendageType === "fin"
      ? "finned"
      : profile.appendageType === "leg"
        ? "legged"
        : "spined";
  const frame =
    profile.bodyScale.y > 1.22
      ? "towering"
      : profile.bodyScale.y < 0.92
        ? "compact"
        : "balanced";
  const coat =
    profile.patternType === "spots"
      ? "spotted"
      : profile.patternType === "saddle"
        ? "banded"
        : profile.patternType === "rosette"
          ? "rosette"
          : "striped";
  return `${frame} ${coat} ${locomotion} ${diet}`;
}

function refreshPlayerPhenotype(force) {
  const source = player.morphTraits || player.traits;
  if (!force && traitDistance(source, player.renderedMorphTraits) < BALANCE.phenotype.refreshThreshold) {
    return false;
  }
  const dna = sanitizePhenotypeDNA(
    player.phenotypeDNA || randomPhenotypeDNA(player.morphSeed + player.generation * 19, "player", source)
  );
  player.phenotypeDNA = dna;
  const profile = makePhenotypeProfile({
    seed: player.morphSeed,
    role: "player",
    traits: source,
    dna,
    generation: player.generation,
    heritage: player.phenotypeHeritage,
  });
  const baseColor = phenotypeColorFromDNA("player", dna, player.morphSeed + player.generation * 37);
  applyPhenotype(player.mesh, baseColor, profile);
  ensurePlayerMarker();
  const tint = new THREE.Color(baseColor).offsetHSL(0.02, 0.03, 0.1).getHex();
  setPhenotypeTint(player.mesh, tint);
  player.mesh.material.opacity = 0.1;
  player.mesh.material.emissive.setHex(0x174f3f);
  player.mesh.material.emissiveIntensity = 0.16;
  player.renderedMorphTraits = cloneTraits(source);
  player.morphLabel = phenotypeLabel(source, profile);
  return true;
}

function setActionMessage(message, seconds) {
  actionMessage = message;
  actionMessageTimer = seconds || 2.6;
}

function focusPlayerCamera(silent) {
  camPan.set(0, 0, 0);
  camDist = clamp(camDist, 12, 24);
  camPitch = clamp(camPitch, 0.2, 1.0);
  if (!silent) setActionMessage("Camera focused on organism.", 1.6);
}

function resetPlayerMorphology(seed) {
  const baseTraits = sanitizeTraits(player.traits);
  const heritage = sanitizeTraits(player.phenotypeHeritage || baseTraits);
  const heritageWeight = clamp((player.generation - 1) * 0.045, 0, 0.35);
  const nextMorphTraits = {};
  for (const key of TRAIT_KEYS) {
    nextMorphTraits[key] = clamp(
      baseTraits[key] * (1 - heritageWeight) + heritage[key] * heritageWeight,
      0,
      1
    );
  }
  player.morphSeed = seed;
  player.morphTraits = nextMorphTraits;
  player.renderedMorphTraits = cloneTraits(nextMorphTraits);
  player.morphRefreshTimer = 0;
  refreshPlayerPhenotype(true);
}

function buildLiveMorphTarget() {
  const m = player.metrics;
  const age = Math.max(player.age, 1);
  const totalFood = m.plants + m.prey;
  const plantRatio = totalFood > 0 ? m.plants / totalFood : player.traits.herbivore;
  const preyRatio = totalFood > 0 ? m.prey / totalFood : player.traits.carnivore;
  const chaseRate = m.chaseAttempts > 0 ? m.chaseSuccess / m.chaseAttempts : 0;
  const activeRatio = clamp(m.activeTime / age, 0, 1);
  const heatRatio = clamp(m.heatExposure / age, 0, 1);
  const waterRatio = clamp(m.waterExposure / age, 0, 1);
  const socialRatio = clamp(m.socialExposure / age, 0, 1);
  const energyRatio = clamp(player.energy / Math.max(1, maxEnergy()), 0, 1);

  const target = {
    speed: clamp(player.traits.speed * 0.72 + chaseRate * 0.2 + activeRatio * 0.08, 0, 1),
    stamina: clamp(player.traits.stamina * 0.72 + activeRatio * 0.18 + energyRatio * 0.1, 0, 1),
    herbivore: clamp(player.traits.herbivore * 0.7 + plantRatio * 0.3, 0, 1),
    carnivore: clamp(player.traits.carnivore * 0.7 + preyRatio * 0.3, 0, 1),
    swim: clamp(player.traits.swim * 0.75 + waterRatio * 0.25, 0, 1),
    heat: clamp(player.traits.heat * 0.75 + heatRatio * 0.25, 0, 1),
    social: clamp(player.traits.social * 0.68 + socialRatio * 0.32, 0, 1),
  };

  const dietSum = target.herbivore + target.carnivore;
  if (dietSum > BALANCE.phenotype.maxDietSum) {
    target.herbivore /= dietSum / BALANCE.phenotype.maxDietSum;
    target.carnivore /= dietSum / BALANCE.phenotype.maxDietSum;
  }
  return target;
}

function updatePlayerMorphology(dt) {
  const target = buildLiveMorphTarget();
  const blend = 1 - Math.exp(-dt * BALANCE.phenotype.liveBlendRate);
  for (const key of TRAIT_KEYS) {
    player.morphTraits[key] = clamp(
      player.morphTraits[key] + (target[key] - player.morphTraits[key]) * blend,
      0,
      1
    );
  }

  player.morphRefreshTimer += dt;
  if (player.morphRefreshTimer >= BALANCE.phenotype.refreshMinSeconds) {
    const refreshed = refreshPlayerPhenotype(false);
    if (refreshed) player.morphRefreshTimer = 0;
  }
}

function resetMetrics() {
  return {
    plants: 0,
    prey: 0,
    chaseAttempts: 0,
    chaseSuccess: 0,
    threatEvents: 0,
    threatEscapes: 0,
    heatExposure: 0,
    waterExposure: 0,
    socialExposure: 0,
    activeTime: 0,
    distance: 0,
  };
}

function cloneTraits(source) {
  const out = {};
  for (const key of TRAIT_KEYS) out[key] = source[key];
  return out;
}

function traitDistance(a, b) {
  let sum = 0;
  for (const key of TRAIT_KEYS) {
    sum += Math.abs((a[key] || 0) - (b[key] || 0));
  }
  return sum / TRAIT_KEYS.length;
}

function sanitizeTraits(source) {
  const out = {};
  for (const key of TRAIT_KEYS) {
    const v = Number(source && source[key]);
    out[key] = Number.isFinite(v) ? clamp(v, 0, 1) : DEFAULT_TRAITS[key];
  }
  return out;
}

function evolvePhenotypeHeritage(options) {
  const previousHeritage = sanitizeTraits(options && options.previousHeritage);
  const parentTraits = sanitizeTraits(options && options.parentTraits);
  const parentMorphTraits = sanitizeTraits((options && options.parentMorphTraits) || parentTraits);
  const mateTraits = sanitizeTraits((options && options.mateTraits) || parentTraits);
  const offspringTraits = sanitizeTraits((options && options.offspringTraits) || parentTraits);
  const generation = clamp(Math.floor(Number(options && options.generation) || 1), 1, 9999);
  const lineageWeight = clamp(0.48 + (generation - 1) * 0.02, 0.48, 0.72);
  const parentMorphWeight = 0.17;
  const mateWeight = 0.11;
  const parentWeight = 0.08;
  const offspringWeight = 1 - lineageWeight - parentMorphWeight - mateWeight - parentWeight;

  const out = {};
  for (const key of TRAIT_KEYS) {
    out[key] = clamp(
      previousHeritage[key] * lineageWeight +
        parentMorphTraits[key] * parentMorphWeight +
        mateTraits[key] * mateWeight +
        parentTraits[key] * parentWeight +
        offspringTraits[key] * offspringWeight,
      0,
      1
    );
  }

  const dietSum = out.herbivore + out.carnivore;
  if (dietSum > BALANCE.phenotype.maxDietSum) {
    out.herbivore /= dietSum / BALANCE.phenotype.maxDietSum;
    out.carnivore /= dietSum / BALANCE.phenotype.maxDietSum;
  }
  return out;
}

function sanitizeLineage(source) {
  if (!Array.isArray(source)) return [];
  const trimmed = source.slice(-BALANCE.save.maxLineageEntries);
  return trimmed
    .filter((entry) => entry && typeof entry === "object")
    .map((entry, idx) => ({
      generation: clamp(Number(entry.generation) || idx + 1, 1, 9999),
      age: clamp(Number(entry.age) || 0, 0, 99999),
      food: {
        plants: clamp(Number(entry.food && entry.food.plants) || 0, 0, 99999),
        prey: clamp(Number(entry.food && entry.food.prey) || 0, 0, 99999),
      },
      traits: sanitizeTraits(entry.traits),
    }));
}

function setWorldFromGeneration(generation) {
  const tier = clamp(
    1 + Math.floor(generation / BALANCE.world.generationsPerTier),
    1,
    BALANCE.world.maxTier
  );
  WORLD.tier = tier;
  WORLD.radius = WORLD.baseRadius + (tier - 1) * BALANCE.world.radiusPerTier;
  WORLD.hazardScale = 1 + (tier - 1) * BALANCE.world.hazardScalePerTier;
}

function initPlayerLifecycle(startEnergyRatio) {
  player.pos.set(0, 0, 0);
  placeAtSurface(player.pos, PLAYER_HEIGHT_OFFSET);
  player.vel.set(0, 0, 0);
  player.forward.set(0, 0, 1);
  player.age = 0;
  player.health = 100;
  player.energy = maxEnergy() * startEnergyRatio;
  player.reproductionCooldown = 0;
  player.morphRefreshTimer = 0;
  player.burstCooldown = 0;
  player.burstTimer = 0;
  player.metrics = resetMetrics();
  player.mesh.position.copy(player.pos);
  matingPhase.active = false;
  matingPhase.timer = 0;
  clearFunLoopState(false);
}

function storageSupported() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function saveSnapshot(reason) {
  if (!storageSupported()) return false;
  const payload = {
    schema: BALANCE.save.schema,
    savedAt: Date.now(),
    reason,
    gameplay: {
      predatorsEnabled: BALANCE.gameplay.predatorsEnabled,
    },
    toneIndex: toneState.index,
    telemetry: {
      births: telemetry.births,
      deaths: telemetry.deaths,
    },
    fun: {
      objectiveChain: funState.objectiveChain,
    },
    player: {
      generation: player.generation,
      age: Number(player.age.toFixed(3)),
      energy: Number(player.energy.toFixed(3)),
      health: Number(player.health.toFixed(3)),
      fertilityQuality: Number(player.fertilityQuality.toFixed(3)),
      reproductionCooldown: Number(player.reproductionCooldown.toFixed(3)),
      traits: { ...player.traits },
      phenotypeHeritage: cloneTraits(player.phenotypeHeritage),
      phenotypeDNA: clonePhenotypeDNA(player.phenotypeDNA),
      morphTraits: cloneTraits(player.morphTraits),
      morphSeed: player.morphSeed,
      lineage: player.lineage.slice(-BALANCE.save.maxLineageEntries),
      pos: {
        x: Number(player.pos.x.toFixed(3)),
        z: Number(player.pos.z.toFixed(3)),
      },
      cam: {
        yaw: Number(camYaw.toFixed(4)),
        pitch: Number(camPitch.toFixed(4)),
        dist: Number(camDist.toFixed(4)),
        panX: Number(camPan.x.toFixed(4)),
        panZ: Number(camPan.z.toFixed(4)),
      },
    },
  };

  try {
    window.localStorage.setItem(BALANCE.save.key, JSON.stringify(payload));
    saveState.lastSavedAt = payload.savedAt;
    saveState.lastReason = reason;
    saveState.error = "";
    return true;
  } catch {
    saveState.error = "save failed";
    return false;
  }
}

function loadSnapshot() {
  if (!storageSupported()) return false;
  let raw;
  try {
    raw = window.localStorage.getItem(BALANCE.save.key);
  } catch {
    saveState.error = "load failed";
    return false;
  }
  if (!raw) return false;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    saveState.error = "save corrupted";
    return false;
  }
  if (!parsed || parsed.schema !== BALANCE.save.schema || !parsed.player) {
    saveState.error = "save schema mismatch";
    return false;
  }

  const nextToneIndex = Number(parsed.toneIndex);
  if (Number.isFinite(nextToneIndex)) setToneIndex(nextToneIndex);
  if (parsed.gameplay && typeof parsed.gameplay.predatorsEnabled === "boolean") {
    BALANCE.gameplay.predatorsEnabled = parsed.gameplay.predatorsEnabled;
  }
  if (parsed.telemetry) {
    telemetry.births = clamp(Number(parsed.telemetry.births) || 0, 0, 999999);
    telemetry.deaths = clamp(Number(parsed.telemetry.deaths) || 0, 0, 999999);
  }
  if (parsed.fun) {
    funState.objectiveChain = clamp(Math.floor(Number(parsed.fun.objectiveChain) || 0), 0, 9999);
  } else {
    const parsedGeneration = clamp(Math.floor(Number(parsed.player && parsed.player.generation) || 1), 1, 9999);
    funState.objectiveChain = Math.max(0, parsedGeneration - 1);
  }

  const state = parsed.player;
  player.generation = clamp(Math.floor(Number(state.generation) || 1), 1, 9999);
  player.traits = sanitizeTraits(state.traits);
  player.phenotypeHeritage = sanitizeTraits(state.phenotypeHeritage || state.morphTraits || state.traits);
  player.phenotypeDNA = sanitizePhenotypeDNA(
    state.phenotypeDNA || randomPhenotypeDNA((Number(state.morphSeed) || player.generation * 911) + 23, "player", state.traits)
  );
  player.morphTraits = sanitizeTraits(state.morphTraits || state.traits);
  player.renderedMorphTraits = cloneTraits(player.morphTraits);
  player.morphSeed = clamp(Math.floor(Number(state.morphSeed) || player.generation * 911), 1, 2147483646);
  player.morphRefreshTimer = 0;
  refreshPlayerPhenotype(true);
  player.lineage = sanitizeLineage(state.lineage);
  setWorldFromGeneration(player.generation);
  rebuildBiomeVisuals();
  syncPopulation();

  player.age = clamp(Number(state.age) || 0, 0, 99999);
  player.health = clamp(Number(state.health) || 100, 0, 100);
  player.fertilityQuality = clamp(Number(state.fertilityQuality) || 1, 0.5, 1.3);
  player.reproductionCooldown = clamp(Number(state.reproductionCooldown) || 0, 0, 9999);
  player.pos.set(Number(state.pos && state.pos.x) || 0, 0, Number(state.pos && state.pos.z) || 0);
  limitToWorld(player.pos);
  placeAtSurface(player.pos, PLAYER_HEIGHT_OFFSET);
  player.vel.set(0, 0, 0);
  player.forward.set(0, 0, 1);
  player.energy = clamp(Number(state.energy) || maxEnergy() * BALANCE.player.offspringStartEnergyRatio, 0, maxEnergy());
  player.metrics = resetMetrics();
  player.burstCooldown = 0;
  player.burstTimer = 0;
  player.mesh.position.copy(player.pos);

  if (state.cam) {
    const nextYaw = Number(state.cam.yaw);
    const nextPitch = Number(state.cam.pitch);
    const nextDist = Number(state.cam.dist);
    const nextPanX = Number(state.cam.panX);
    const nextPanZ = Number(state.cam.panZ);
    if (Number.isFinite(nextYaw)) camYaw = nextYaw;
    if (Number.isFinite(nextPitch)) camPitch = clamp(nextPitch, 0.12, 1.16);
    if (Number.isFinite(nextDist)) camDist = clamp(nextDist, 10, 34);
    if (Number.isFinite(nextPanX)) camPan.x = nextPanX;
    if (Number.isFinite(nextPanZ)) camPan.z = nextPanZ;
  }

  ACTIVE_CHASE.clear();
  ACTIVE_THREATS.clear();
  clearGroup(populations.mates);
  clearGroup(populations.rivals);
  matingPhase.active = false;
  matingPhase.timer = 0;
  clearFunLoopState(false);

  saveState.loadedFromDisk = true;
  saveState.lastSavedAt = Number(parsed.savedAt) || 0;
  saveState.lastReason = "loaded";
  saveState.error = "";
  return true;
}

function clearSnapshot() {
  if (!storageSupported()) return;
  try {
    window.localStorage.removeItem(BALANCE.save.key);
    saveState.lastReason = "cleared";
    saveState.lastSavedAt = 0;
    saveState.error = "";
  } catch {
    saveState.error = "clear failed";
  }
}

function newLineage(clearSave) {
  if (clearSave) clearSnapshot();
  telemetry.births = 0;
  telemetry.deaths = 0;
  clearFunLoopState(true);
  player.generation = 1;
  player.traits = { ...DEFAULT_TRAITS };
  player.phenotypeHeritage = { ...DEFAULT_TRAITS };
  player.phenotypeDNA = randomPhenotypeDNA(player.generation * 911 + 41, "player", player.traits);
  player.fertilityQuality = 1;
  resetPlayerMorphology(player.generation * 911 + 17);
  player.lineage = [];
  setWorldFromGeneration(player.generation);
  rebuildBiomeVisuals();
  syncPopulation();
  initPlayerLifecycle(BALANCE.player.offspringStartEnergyRatio);
  clearGroup(populations.mates);
  clearGroup(populations.rivals);
  saveState.loadedFromDisk = false;
}

const populations = {
  flora: [],
  trees: [],
  prey: [],
  predators: [],
  aquatic: [],
  avian: [],
  mates: [],
  rivals: [],
};

let idCounter = 1;
function nextId() {
  const id = idCounter;
  idCounter += 1;
  return id;
}

const FLORA_VARIANTS = Object.freeze([
  Object.freeze({
    id: "clover",
    label: "Clover Patch",
    shape: "sphere",
    edible: true,
    toxic: false,
    harm: 0,
    weight: 2.1,
    energyMult: 1.0,
    respawnMult: 1.0,
    color: 0x6cbf5f,
  }),
  Object.freeze({
    id: "berry",
    label: "Berry Cluster",
    shape: "dodeca",
    edible: true,
    toxic: false,
    harm: 0,
    weight: 1.25,
    energyMult: 1.32,
    respawnMult: 0.9,
    color: 0x7fce52,
  }),
  Object.freeze({
    id: "reed",
    label: "Reed Frond",
    shape: "cone",
    edible: true,
    toxic: false,
    harm: 0,
    weight: 1.05,
    energyMult: 0.84,
    respawnMult: 1.12,
    color: 0x96c96a,
  }),
  Object.freeze({
    id: "thorn",
    label: "Thorn Brush",
    shape: "octa",
    edible: false,
    toxic: false,
    harm: 5.5,
    weight: 0.78,
    energyMult: 0.25,
    respawnMult: 1.08,
    color: 0x9a8d53,
  }),
  Object.freeze({
    id: "spore",
    label: "Spore Cap",
    shape: "tetra",
    edible: false,
    toxic: true,
    harm: 8.5,
    weight: 0.62,
    energyMult: 0.2,
    respawnMult: 0.95,
    color: 0xc5874a,
  }),
]);

function floraVariantWeight(variant, biome) {
  let weight = variant.weight;
  if (biome === BIOMES.wetland.id || biome === BIOMES.cloudforest.id) {
    if (variant.id === "reed") weight *= 1.7;
    if (variant.id === "spore") weight *= 1.25;
  }
  if (biome === BIOMES.beach.id) {
    if (variant.id === "reed") weight *= 1.35;
    if (variant.id === "thorn") weight *= 1.25;
  }
  if (biome === BIOMES.volcanic.id) {
    if (variant.id === "thorn") weight *= 1.45;
    if (variant.id === "spore") weight *= 1.2;
    if (variant.id === "berry") weight *= 0.75;
  }
  if (biome === BIOMES.rainforest.id) {
    if (variant.id === "berry") weight *= 1.4;
    if (variant.id === "spore") weight *= 1.2;
  }
  return Math.max(0.05, weight);
}

function pickFloraVariant(biome) {
  const options = FLORA_VARIANTS.map((variant) => ({
    variant,
    weight: floraVariantWeight(variant, biome),
  }));
  const picked = weightedPick(options);
  return (picked && picked.variant) || FLORA_VARIANTS[0];
}

function createFloraMesh(variant, size) {
  let geometry;
  if (variant.shape === "cone") {
    geometry = new THREE.ConeGeometry(size * 0.56, size * 1.55, 8);
  } else if (variant.shape === "dodeca") {
    geometry = new THREE.DodecahedronGeometry(size * 0.95, 0);
  } else if (variant.shape === "octa") {
    geometry = new THREE.OctahedronGeometry(size * 0.9, 0);
  } else if (variant.shape === "tetra") {
    geometry = new THREE.TetrahedronGeometry(size * 0.94, 0);
  } else {
    geometry = new THREE.SphereGeometry(size, 9, 8);
  }
  const material = new THREE.MeshStandardMaterial({
    color: variant.color,
    roughness: 0.72,
    metalness: variant.toxic ? 0.12 : 0.05,
  });
  return new THREE.Mesh(geometry, material);
}

function floraHeightOffset(variant, size) {
  if (variant.shape === "cone" || variant.shape === "tetra") return size * 0.72;
  if (variant.shape === "dodeca" || variant.shape === "octa") return size * 0.66;
  return size * 0.6;
}

function floraBiomeProfile(position) {
  const biome = biomeAt(position);
  if (biome === BIOMES.beach.id) {
    return { energyMin: 6, energyMax: 11, color: 0xc7c176, respawnMult: 1.16 };
  }
  if (biome === BIOMES.rainforest.id) {
    return { energyMin: 11, energyMax: 19, color: 0x5faf5d, respawnMult: 0.9 };
  }
  if (biome === BIOMES.highland.id) {
    return { energyMin: 8, energyMax: 14, color: 0xa9bb74, respawnMult: 1.1 };
  }
  if (biome === BIOMES.volcanic.id) {
    return { energyMin: 12, energyMax: 22, color: 0xc8834f, respawnMult: 1.18 };
  }
  if (biome === BIOMES.wetland.id) {
    return { energyMin: 9, energyMax: 16, color: 0x7bb06a, respawnMult: 0.94 };
  }
  if (biome === BIOMES.cloudforest.id) {
    return { energyMin: 10, energyMax: 17, color: 0x97ba78, respawnMult: 0.98 };
  }
  return { energyMin: 9, energyMax: 16, color: 0x75bc67, respawnMult: 1.0 };
}

function applyFloraBiome(node) {
  const profile = floraBiomeProfile(node.mesh.position);
  const variant = node.variant || FLORA_VARIANTS[0];
  node.energy = rand(profile.energyMin, profile.energyMax) * (variant.energyMult || 1);
  node.respawnMult = profile.respawnMult * (variant.respawnMult || 1);
  node.edible = !!variant.edible;
  node.toxic = !!variant.toxic;
  node.harm = Number(variant.harm) || 0;
  const biomeColor = new THREE.Color(profile.color);
  const variantColor = new THREE.Color(variant.color || profile.color);
  const blend = variant.edible ? 0.26 : 0.12;
  const finalColor = variantColor.clone().lerp(biomeColor, blend);
  node.mesh.material.color.copy(finalColor);
  if (variant.toxic) {
    node.mesh.material.emissive.setHex(0x6e2f12);
    node.mesh.material.emissiveIntensity = 0.18;
  } else if (!variant.edible) {
    node.mesh.material.emissive.setHex(0x4f421a);
    node.mesh.material.emissiveIntensity = 0.1;
  } else {
    node.mesh.material.emissive.setHex(0x000000);
    node.mesh.material.emissiveIntensity = 0;
  }
}

function spawnFlora() {
  const p = randVec(WORLD.radius - 6);
  const biome = biomeAtXZ(p.x, p.z);
  const variant = pickFloraVariant(biome);
  const size = rand(0.52, 0.98);
  const mesh = createFloraMesh(variant, size);
  const heightOffset = floraHeightOffset(variant, size);
  placeAtSurface(p, heightOffset);
  mesh.position.copy(p);
  scene.add(mesh);
  populations.flora.push({
    id: nextId(),
    mesh,
    variant,
    size,
    heightOffset,
    edible: !!variant.edible,
    toxic: !!variant.toxic,
    harm: Number(variant.harm) || 0,
    alive: true,
    respawn: 0,
    energy: 10,
    respawnMult: 1.0,
  });
  applyFloraBiome(populations.flora[populations.flora.length - 1]);
}

function treeBiomeEligible(id) {
  if (id === BIOMES.volcanic.id) return Math.random() < 0.35;
  return id !== BIOMES.beach.id && !biomeIsWaterLike(id);
}

function randomTreeSpawnPoint() {
  const p = new THREE.Vector3();
  for (let attempt = 0; attempt < 18; attempt += 1) {
    const candidate = randVec(WORLD.radius - 9);
    p.copy(candidate);
    limitToWorld(p);
    const biome = biomeAtXZ(p.x, p.z);
    if (treeBiomeEligible(biome)) return p;
  }
  p.copy(randVec(WORLD.radius * 0.7));
  limitToWorld(p);
  return p;
}

function spawnTree() {
  const id = nextId();
  const root = new THREE.Group();
  const scale = rand(0.9, 1.45);
  const trunkHeight = rand(2.2, 3.8) * scale;
  const trunkRadius = rand(0.24, 0.42) * scale;
  const canopyRadius = rand(1.05, 1.75) * scale;
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x7a5b35, roughness: 0.84, metalness: 0.02 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x5a9f47, roughness: 0.78, metalness: 0.03 });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(trunkRadius * 0.72, trunkRadius, trunkHeight, 8), trunkMat);
  trunk.position.y = trunkHeight * 0.5;
  root.add(trunk);

  const canopyLow = new THREE.Mesh(
    new THREE.ConeGeometry(canopyRadius, canopyRadius * 1.28, 9),
    leafMat
  );
  canopyLow.position.y = trunkHeight + canopyRadius * 0.42;
  root.add(canopyLow);

  const canopyTop = new THREE.Mesh(
    new THREE.SphereGeometry(canopyRadius * 0.68, 10, 9),
    leafMat.clone()
  );
  canopyTop.material.color.offsetHSL(0.02, 0.02, 0.05);
  canopyTop.position.y = trunkHeight + canopyRadius * 1.05;
  root.add(canopyTop);

  const p = randomTreeSpawnPoint();
  p.y = terrainHeightAt(p.x, p.z);
  root.position.copy(p);
  root.rotation.y = rand(0, Math.PI * 2);
  scene.add(root);

  populations.trees.push({
    id,
    mesh: root,
    swayPhase: rand(0, Math.PI * 2),
    canopyLow,
    canopyTop,
    blockRadius: trunkRadius + canopyRadius * 0.28,
  });
}

function spawnPrey() {
  const id = nextId();
  const mesh = makeSphere(0xc5db78, rand(0.64, 0.95), 10);
  const p = randVec(WORLD.radius - 7);
  placeAtSurface(p, 0.68);
  mesh.position.copy(p);
  const traits = {
    speed: rand(0.25, 0.9),
    stamina: rand(0.2, 0.8),
    herbivore: rand(0.55, 0.98),
    carnivore: rand(0.05, 0.35),
    swim: rand(0.05, 0.55),
    heat: rand(0.1, 0.65),
    social: rand(0.2, 0.9),
  };
  const phenotypeDNA = randomPhenotypeDNA(id * 33 + 7, "prey", traits);
  const phenotypeColor = phenotypeColorFromDNA("prey", phenotypeDNA, id * 71 + 11);
  applyPhenotype(
    mesh,
    phenotypeColor,
    makePhenotypeProfile({
      seed: id * 33 + 7,
      role: "prey",
      traits,
      dna: phenotypeDNA,
    })
  );
  const edible = Math.random() > 0.13;
  if (!edible) setPhenotypeTint(mesh, 0x8d9c90);
  scene.add(mesh);
  populations.prey.push({
    id,
    mesh,
    vel: new THREE.Vector3(),
    wander: randVec(1),
    alive: true,
    respawn: 0,
    edible,
    harm: edible ? 0 : rand(4.5, 8.5),
    noEatCooldown: 0,
    speed: rand(4.2, 6.6),
    heightOffset: 0.68,
    social: rand(0.28, 0.92),
  });
}

function spawnPredator() {
  const id = nextId();
  const mesh = makeSphere(0xce735e, rand(0.9, 1.25), 12);
  const p = randVec(WORLD.radius - 10);
  placeAtSurface(p, 1.1);
  mesh.position.copy(p);
  const traits = {
    speed: rand(0.45, 0.95),
    stamina: rand(0.3, 0.95),
    herbivore: rand(0.0, 0.2),
    carnivore: rand(0.65, 1.0),
    swim: rand(0.0, 0.45),
    heat: rand(0.2, 0.9),
    social: rand(0.0, 0.5),
  };
  const phenotypeDNA = randomPhenotypeDNA(id * 61 + 13, "predator", traits);
  const phenotypeColor = phenotypeColorFromDNA("predator", phenotypeDNA, id * 83 + 17);
  applyPhenotype(
    mesh,
    phenotypeColor,
    makePhenotypeProfile({
      seed: id * 61 + 13,
      role: "predator",
      traits,
      dna: phenotypeDNA,
    })
  );
  scene.add(mesh);
  populations.predators.push({
    id,
    mesh,
    vel: new THREE.Vector3(),
    wander: randVec(1),
    speed: rand(5.2, 7.8),
    heightOffset: 1.1,
    pack: rand(0.22, 0.78),
  });
}

function randomAquaticSpawnPoint() {
  const p = new THREE.Vector3();
  for (let attempt = 0; attempt < 14; attempt += 1) {
    if (Math.random() < 0.72) {
      const a = rand(0, Math.PI * 2);
      const r = Math.sqrt(Math.random()) * LAGOON_RADIUS * 0.9;
      p.set(LAGOON_CENTER.x + Math.cos(a) * r, 0, LAGOON_CENTER.z + Math.sin(a) * r);
    } else {
      const a = rand(0, Math.PI * 2);
      const coastR = rand(WORLD.radius * 0.8, WORLD.radius * 0.95);
      p.set(Math.cos(a) * coastR, 0, Math.sin(a) * coastR);
    }
    limitToWorld(p);
    if (biomeIsWaterLike(biomeAtXZ(p.x, p.z))) return p;
  }
  p.set(LAGOON_CENTER.x, 0, LAGOON_CENTER.z);
  limitToWorld(p);
  return p;
}

function spawnAquatic() {
  const id = nextId();
  const mesh = makeSphere(0x74c9e9, rand(0.5, 0.82), 10);
  const p = randomAquaticSpawnPoint();
  placeAtSurface(p, 0.34);
  mesh.position.copy(p);
  const traits = {
    speed: rand(0.32, 0.86),
    stamina: rand(0.22, 0.72),
    herbivore: rand(0.12, 0.58),
    carnivore: rand(0.22, 0.82),
    swim: rand(0.7, 1.0),
    heat: rand(0.08, 0.58),
    social: rand(0.35, 0.95),
  };
  const phenotypeDNA = randomPhenotypeDNA(id * 41 + 23, "aquatic", traits);
  const phenotypeColor = phenotypeColorFromDNA("aquatic", phenotypeDNA, id * 59 + 5);
  applyPhenotype(
    mesh,
    phenotypeColor,
    makePhenotypeProfile({
      seed: id * 41 + 23,
      role: "aquatic",
      traits,
      dna: phenotypeDNA,
    })
  );
  const edible = Math.random() > 0.17;
  if (!edible) setPhenotypeTint(mesh, 0x7f95a4);
  scene.add(mesh);
  populations.aquatic.push({
    id,
    mesh,
    vel: new THREE.Vector3(),
    wander: randVec(1),
    alive: true,
    respawn: 0,
    edible,
    harm: edible ? 0 : rand(4, 7.2),
    noEatCooldown: 0,
    speed: rand(3.6, 5.7),
    heightOffset: 0.34,
    school: rand(0.3, 0.96),
    floatPhase: rand(0, Math.PI * 2),
  });
}

function spawnAvian() {
  const id = nextId();
  const mesh = makeSphere(0xf1d889, rand(0.44, 0.72), 10);
  const p = randVec(WORLD.radius - 8);
  placeAtSurface(p, rand(4.6, 7.8));
  mesh.position.copy(p);
  const traits = {
    speed: rand(0.45, 0.97),
    stamina: rand(0.3, 0.85),
    herbivore: rand(0.15, 0.62),
    carnivore: rand(0.25, 0.78),
    swim: rand(0.0, 0.3),
    heat: rand(0.2, 0.9),
    social: rand(0.4, 0.98),
  };
  const phenotypeDNA = randomPhenotypeDNA(id * 47 + 29, "avian", traits);
  const phenotypeColor = phenotypeColorFromDNA("avian", phenotypeDNA, id * 97 + 7);
  applyPhenotype(
    mesh,
    phenotypeColor,
    makePhenotypeProfile({
      seed: id * 47 + 29,
      role: "avian",
      traits,
      dna: phenotypeDNA,
    })
  );
  const edible = Math.random() > 0.22;
  if (!edible) setPhenotypeTint(mesh, 0x9f8f7a);
  scene.add(mesh);
  populations.avian.push({
    id,
    mesh,
    vel: new THREE.Vector3(),
    wander: randVec(1),
    alive: true,
    respawn: 0,
    edible,
    harm: edible ? 0 : rand(3.4, 6.4),
    noEatCooldown: 0,
    speed: rand(5.3, 8.5),
    altitude: rand(4.8, 8.6),
    flapPhase: rand(0, Math.PI * 2),
    flock: rand(0.3, 0.92),
  });
}

function clearGroup(group) {
  for (const e of group) {
    scene.remove(e.mesh);
    disposeMeshTree(e.mesh);
  }
  group.length = 0;
  if (group === populations.mates && mateLockVisual) {
    selectedMateId = null;
    mateLockVisual.group.visible = false;
    mateCardsRenderKey = "";
  }
}

function trimGroupToTarget(group, targetCount) {
  while (group.length > targetCount) {
    const entity = group.pop();
    if (!entity || !entity.mesh) continue;
    scene.remove(entity.mesh);
    disposeMeshTree(entity.mesh);
  }
}

function spawnMateCluster() {
  clearGroup(populations.mates);
  clearGroup(populations.rivals);
  const tone = toneProfile();
  const reqScale = tone.mateRequirementScale;
  const simpleMode = isSimpleReproductionMode();
  const playerTraitsNow = sanitizeTraits(player.traits);
  const playerDNANow = sanitizePhenotypeDNA(player.phenotypeDNA || randomPhenotypeDNA(player.morphSeed, "player", playerTraitsNow));

  const root = player.pos.clone();
  const angle = rand(0, Math.PI * 2);
  const dist = simpleMode ? rand(2.8, 4.2) : rand(8, 18);
  root.x += Math.cos(angle) * dist;
  root.z += Math.sin(angle) * dist;
  limitToWorld(root);
  const mateCount = simpleMode ? 3 : 2;
  for (let i = 0; i < mateCount; i += 1) {
    const id = nextId();
    const mesh = makeSphere(0x9cd8ff, 1.12, 14);
    const p = root.clone().add(randVec(simpleMode ? 1.6 : 6));
    placeAtSurface(p, 1.2);
    mesh.position.copy(p);
    scene.add(mesh);

    const mods = {
      speed: rand(simpleMode ? -0.03 : -0.07, simpleMode ? 0.08 : 0.07),
      stamina: rand(simpleMode ? -0.03 : -0.07, simpleMode ? 0.08 : 0.07),
      herbivore: rand(simpleMode ? -0.03 : -0.07, simpleMode ? 0.08 : 0.07),
      carnivore: rand(simpleMode ? -0.03 : -0.07, simpleMode ? 0.08 : 0.07),
      swim: rand(simpleMode ? -0.03 : -0.07, simpleMode ? 0.08 : 0.07),
      heat: rand(simpleMode ? -0.03 : -0.07, simpleMode ? 0.08 : 0.07),
      social: rand(simpleMode ? -0.03 : -0.07, simpleMode ? 0.08 : 0.07),
    };

    const traitKeys = Object.keys(mods);
    const bonus = traitKeys[(Math.random() * traitKeys.length) | 0];
    mods[bonus] += rand(simpleMode ? 0.06 : 0.08, simpleMode ? 0.12 : 0.14);
    if (!simpleMode) {
      const cost = traitKeys[(Math.random() * traitKeys.length) | 0];
      mods[cost] -= rand(0.03, 0.08);
    }

    const requirement = simpleMode
      ? { type: "none", min: 0 }
      : i === 0
        ? {
            type: "energy",
            min: clamp(BALANCE.player.reproductionEnergyRatio * reqScale, 0.5, 0.92),
          }
        : Math.random() < 0.5
          ? { type: "chase", min: Math.max(1, Math.round(2 * reqScale)) }
          : { type: "forage", min: Math.max(2, Math.round(6 * reqScale)) };

    const mateTraits = {
      speed: clamp(0.45 + mods.speed, 0, 1),
      stamina: clamp(0.45 + mods.stamina, 0, 1),
      herbivore: clamp(0.45 + mods.herbivore, 0, 1),
      carnivore: clamp(0.45 + mods.carnivore, 0, 1),
      swim: clamp(0.35 + mods.swim, 0, 1),
      heat: clamp(0.35 + mods.heat, 0, 1),
      social: clamp(0.6 + mods.social, 0, 1),
    };
    if (i === 0) {
      for (const key of TRAIT_KEYS) {
        mateTraits[key] = clamp(mateTraits[key] * 0.58 + playerTraitsNow[key] * 0.42, 0, 1);
      }
    } else if (mateCount > 2 && i === mateCount - 1) {
      for (const key of TRAIT_KEYS) {
        mateTraits[key] = clamp(mateTraits[key] * 0.72 + (1 - playerTraitsNow[key]) * 0.28, 0, 1);
      }
    }
    const mateDNA = randomPhenotypeDNA(id * 23 + i * 11 + 5, "mate", mateTraits);
    const mateColor = phenotypeColorFromDNA("mate", mateDNA, id * 67 + i * 13 + 17);
    const compatibility = evaluateMateCompatibility(playerTraitsNow, playerDNANow, mateTraits, mateDNA);
    const phenotypeProfile = makePhenotypeProfile({
      seed: id * 19 + i,
      role: "mate",
      traits: mateTraits,
      dna: mateDNA,
    });
    const offspringPreviewTraits = previewOffspringTraits(mods);
    const offspringPreviewDNA = hybridizePhenotypeDNA(
      player.phenotypeDNA,
      mateDNA,
      id * 89 + player.generation * 31
    );
    const offspringPreviewHeritage = evolvePhenotypeHeritage({
      previousHeritage: player.phenotypeHeritage,
      parentTraits: player.traits,
      parentMorphTraits: player.morphTraits,
      mateTraits,
      offspringTraits: offspringPreviewTraits,
      generation: player.generation + 1,
    });
    const offspringPreviewProfile = makePhenotypeProfile({
      seed: id * 31 + player.generation * 97,
      role: "player",
      traits: offspringPreviewTraits,
      dna: offspringPreviewDNA,
      generation: player.generation + 1,
      heritage: offspringPreviewHeritage,
    });

    populations.mates.push({
      id,
      slot: i + 1,
      mesh,
      mods,
      traits: mateTraits,
      phenotypeDNA: mateDNA,
      compatibility,
      phenotypeProfile,
      offspringPreviewTraits,
      offspringPreviewDNA,
      offspringPreviewProfile,
      pulse: rand(0, Math.PI * 2),
      requirement,
      captured: false,
      heightOffset: 1.2,
      marker: createMateMarker(mesh, `M${i + 1}`, `${i + 1}`),
    });
    applyPhenotype(mesh, mateColor, phenotypeProfile);
  }

  if (!simpleMode) {
    for (let i = 0; i < populations.mates.length; i += 1) {
      const id = nextId();
      const mesh = makeSphere(0xf2b876, 1.0, 10);
      const p = root.clone().add(randVec(14));
      placeAtSurface(p, 1.0);
      mesh.position.copy(p);
      const rivalTraits = {
        speed: rand(0.35, 0.85),
        stamina: rand(0.25, 0.7),
        herbivore: rand(0.2, 0.6),
        carnivore: rand(0.2, 0.8),
        swim: rand(0.0, 0.5),
        heat: rand(0.2, 0.8),
        social: rand(0.3, 0.75),
      };
      const rivalDNA = randomPhenotypeDNA(id * 17 + i * 19 + 9, "rival", rivalTraits);
      const rivalColor = phenotypeColorFromDNA("rival", rivalDNA, id * 97 + 41);
      applyPhenotype(
        mesh,
        rivalColor,
        makePhenotypeProfile({
          seed: id * 17 + i,
          role: "rival",
          traits: rivalTraits,
          dna: rivalDNA,
        })
      );
      scene.add(mesh);
      populations.rivals.push({
        id,
        slot: i + 1,
        mesh,
        targetIndex: i,
        claimTimer: 0,
        speed: rand(4.2, 6.1) * tone.rivalSpeedMult,
        heightOffset: 1.0,
        marker: createRivalMarker(mesh, `R${i + 1}`),
      });
    }
  }

  ensureSelectedMate();
}

function desiredPopulation() {
  return {
    flora: BALANCE.populations.floraBase + WORLD.tier * BALANCE.populations.floraPerTier,
    trees: BALANCE.populations.treeBase + WORLD.tier * BALANCE.populations.treePerTier,
    prey: BALANCE.populations.preyBase + WORLD.tier * BALANCE.populations.preyPerTier,
    predators: BALANCE.gameplay.predatorsEnabled
      ? BALANCE.populations.predatorBase + WORLD.tier * BALANCE.populations.predatorPerTier
      : 0,
    aquatic: BALANCE.populations.aquaticBase + WORLD.tier * BALANCE.populations.aquaticPerTier,
    avian: BALANCE.populations.avianBase + WORLD.tier * BALANCE.populations.avianPerTier,
  };
}

function syncPopulation() {
  const target = desiredPopulation();
  trimGroupToTarget(populations.flora, target.flora);
  trimGroupToTarget(populations.trees, target.trees);
  trimGroupToTarget(populations.prey, target.prey);
  trimGroupToTarget(populations.predators, target.predators);
  trimGroupToTarget(populations.aquatic, target.aquatic);
  trimGroupToTarget(populations.avian, target.avian);
  while (populations.flora.length < target.flora) spawnFlora();
  while (populations.trees.length < target.trees) spawnTree();
  while (populations.prey.length < target.prey) spawnPrey();
  while (populations.predators.length < target.predators) spawnPredator();
  while (populations.aquatic.length < target.aquatic) spawnAquatic();
  while (populations.avian.length < target.avian) spawnAvian();
}

const chaseProbe = new THREE.Vector3();
const threatProbe = new THREE.Vector3();
const worldUp = new THREE.Vector3(0, 1, 0);
const moveForward = new THREE.Vector3();
const moveRight = new THREE.Vector3();
const socialAlign = new THREE.Vector3();
const socialCohesion = new THREE.Vector3();
const socialSeparation = new THREE.Vector3();
const socialTemp = new THREE.Vector3();

function maxEnergy() {
  return BALANCE.player.maxEnergyBase + player.traits.stamina * BALANCE.player.maxEnergyFromStamina;
}

function movementSpeed() {
  return BALANCE.player.moveSpeedBase + player.traits.speed * BALANCE.player.moveSpeedFromTrait;
}

function clearFunLoopState(fullReset) {
  funState.comboCount = 0;
  funState.comboTimer = 0;
  funState.comboMultiplier = 1;
  funState.lastFeedAt = -999;
  funState.lastComboFlash = -999;
  funState.objective = null;
  funState.rescueTimer = 0;
  if (fullReset) {
    funState.objectiveChain = 0;
    funState.objectiveCounter = 0;
  }
}

function applyTraitDelta(delta) {
  let changed = false;
  for (const key of TRAIT_KEYS) {
    const next = Number(delta && delta[key]);
    if (!Number.isFinite(next) || next === 0) continue;
    player.traits[key] = clamp(player.traits[key] + next, 0, 1);
    changed = true;
  }

  const dietSum = player.traits.herbivore + player.traits.carnivore;
  if (dietSum > BALANCE.evolution.dietCap) {
    player.traits.herbivore /= dietSum / BALANCE.evolution.dietCap;
    player.traits.carnivore /= dietSum / BALANCE.evolution.dietCap;
    changed = true;
  }

  if (changed) {
    player.morphRefreshTimer = Math.max(
      player.morphRefreshTimer,
      BALANCE.phenotype.refreshMinSeconds
    );
  }
}

function registerConsumption(kind, energyGain, healthGain) {
  const now = simTime;
  const withinWindow = now - funState.lastFeedAt <= BALANCE.fun.comboWindowSeconds;
  funState.comboCount = withinWindow ? funState.comboCount + 1 : 1;
  funState.lastFeedAt = now;
  funState.comboTimer = BALANCE.fun.comboWindowSeconds;

  const bonus = clamp(
    (funState.comboCount - 1) * BALANCE.fun.comboStep,
    0,
    BALANCE.fun.comboMaxBonus
  );
  funState.comboMultiplier = 1 + bonus;

  if (funState.comboCount >= 3 && now - funState.lastComboFlash > 1.2) {
    const label = kind === "flora" ? "Forage" : kind === "aquatic" ? "Aquatic" : kind === "avian" ? "Sky" : "Hunt";
    setActionMessage(`${label} combo x${funState.comboCount} (${funState.comboMultiplier.toFixed(2)}x)`, 1.25);
    funState.lastComboFlash = now;
  }

  return {
    energy: energyGain * funState.comboMultiplier,
    health: healthGain * (1 + bonus * BALANCE.fun.comboHealthScale),
  };
}

function weightedPick(options) {
  let total = 0;
  for (const option of options) total += Math.max(0, Number(option.weight) || 0);
  if (total <= 0) return options[0] || null;
  let r = Math.random() * total;
  for (const option of options) {
    r -= Math.max(0, Number(option.weight) || 0);
    if (r <= 0) return option;
  }
  return options[options.length - 1] || null;
}

function objectiveBiomeCandidates() {
  const unlocked = [];
  for (const config of Object.values(BIOMES)) {
    if (config.id === BIOMES.meadow.id) continue;
    if (WORLD.tier < config.unlockTier) continue;
    unlocked.push(config.id);
  }
  return unlocked;
}

function createObjective() {
  const previousType = funState.objective ? funState.objective.type : "";
  const options = [
    { type: "forage", weight: 2.2 },
    { type: "travel", weight: 1.9 },
    { type: "hunt", weight: 1.8 + WORLD.tier * 0.15 },
  ];
  if (WORLD.tier >= 2) options.push({ type: "biome", weight: 1.25 + WORLD.tier * 0.1 });
  for (const entry of options) {
    if (entry.type === previousType) entry.weight *= 0.45;
  }
  const picked = weightedPick(options) || { type: "forage" };
  const chain = funState.objectiveChain;
  const rewardEnergy =
    BALANCE.fun.objectiveEnergyRewardBase +
    WORLD.tier * 1.6 +
    Math.min(28, chain * BALANCE.fun.objectiveEnergyRewardScale);
  const rewardHealth =
    BALANCE.fun.objectiveHealthRewardBase +
    Math.min(9, chain * BALANCE.fun.objectiveHealthRewardScale);
  const rewardTraitAmount = clamp(
    BALANCE.fun.objectiveTraitRewardBase + chain * BALANCE.fun.objectiveTraitRewardScale,
    0.012,
    0.055
  );
  const objective = {
    id: ++funState.objectiveCounter,
    type: picked.type,
    progress: 0,
    rewardEnergy,
    rewardHealth,
    rewardTraitAmount,
    rewardTrait: "stamina",
    title: "",
    target: 1,
    startPlants: player.metrics.plants,
    startPrey: player.metrics.prey,
    startDistance: player.metrics.distance,
    biomeId: BIOMES.meadow.id,
  };

  if (picked.type === "forage") {
    objective.title = "Forage Sprint";
    objective.target = clamp(3 + WORLD.tier + Math.floor(chain * 0.35), 3, 12);
    objective.rewardTrait = "herbivore";
    return objective;
  }
  if (picked.type === "hunt") {
    objective.title = "Predation Trial";
    objective.target = clamp(2 + Math.floor(WORLD.tier * 0.8) + Math.floor(chain * 0.3), 2, 10);
    objective.rewardTrait = "carnivore";
    return objective;
  }
  if (picked.type === "travel") {
    objective.title = "Migration Run";
    objective.target = clamp(52 + WORLD.tier * 14 + chain * 7, 52, 220);
    objective.rewardTrait = "speed";
    return objective;
  }

  const biomes = objectiveBiomeCandidates();
  const biomeId = biomes.length > 0 ? biomes[(Math.random() * biomes.length) | 0] : BIOMES.rainforest.id;
  objective.type = "biome";
  objective.biomeId = biomeId;
  objective.title = `Habitat Study (${biomeLabel(biomeId)})`;
  objective.target = clamp(11 + WORLD.tier * 2 + chain * 1.2, 11, 34);
  objective.rewardTrait =
    biomeId === BIOMES.volcanic.id
      ? "heat"
      : biomeIsWaterLike(biomeId)
        ? "swim"
        : biomeId === BIOMES.rainforest.id
          ? "social"
          : "stamina";
  return objective;
}

function objectiveProgressLabel(objective) {
  if (!objective) return "Objective: initializing...";
  const target = objective.target;
  const progress = clamp(objective.progress, 0, target);
  if (objective.type === "travel") {
    return `${progress.toFixed(0)}/${target.toFixed(0)}m`;
  }
  if (objective.type === "biome") {
    return `${progress.toFixed(1)}/${target.toFixed(1)}s`;
  }
  return `${Math.floor(progress)}/${Math.floor(target)}`;
}

function objectiveSummaryText(objective) {
  if (!objective) return "Objective: calibrating ecosystem challenge...";
  const reward = `+${objective.rewardEnergy.toFixed(0)}E +${objective.rewardHealth.toFixed(0)}H +${TRAIT_SHORT[objective.rewardTrait]} ${objective.rewardTraitAmount.toFixed(3)}`;
  const progress = objectiveProgressLabel(objective);
  return `Objective ${funState.objectiveChain + 1}: ${objective.title} ${progress} | Reward ${reward}`;
}

function completeObjective(objective) {
  player.energy = clamp(player.energy + objective.rewardEnergy, 0, maxEnergy());
  player.health = clamp(player.health + objective.rewardHealth, 0, 100);
  const traitDelta = {};
  traitDelta[objective.rewardTrait] = objective.rewardTraitAmount;
  if (objective.type === "forage") traitDelta.stamina = (traitDelta.stamina || 0) + 0.007;
  if (objective.type === "hunt") traitDelta.speed = (traitDelta.speed || 0) + 0.007;
  if (objective.type === "travel") traitDelta.stamina = (traitDelta.stamina || 0) + 0.009;
  if (objective.type === "biome" && objective.biomeId === BIOMES.rainforest.id) {
    traitDelta.social = (traitDelta.social || 0) + 0.009;
  }
  applyTraitDelta(traitDelta);
  player.reproductionCooldown = Math.max(0, player.reproductionCooldown - 2.5);
  funState.objectiveChain += 1;
  setActionMessage(
    `Objective complete: ${objective.title}. +${objective.rewardEnergy.toFixed(0)} energy, +${objective.rewardHealth.toFixed(0)} health.`,
    3.1
  );
  funState.objective = null;
}

function ensureObjective() {
  if (funState.objective) return;
  funState.objective = createObjective();
  if (actionMessageTimer <= 0.25) {
    setActionMessage(`New objective: ${funState.objective.title}.`, 2.4);
  }
}

function progressObjective(dt) {
  const objective = funState.objective;
  if (!objective) return;
  if (objective.type === "forage") {
    objective.progress = Math.max(0, player.metrics.plants - objective.startPlants);
  } else if (objective.type === "hunt") {
    objective.progress = Math.max(0, player.metrics.prey - objective.startPrey);
  } else if (objective.type === "travel") {
    objective.progress = Math.max(0, player.metrics.distance - objective.startDistance);
  } else if (objective.type === "biome") {
    if (biomeAt(player.pos) === objective.biomeId) {
      objective.progress += dt;
    }
  }
  if (objective.progress >= objective.target) completeObjective(objective);
}

function pulseNearbyForage() {
  let seeded = 0;
  for (const node of populations.flora) {
    if (seeded >= BALANCE.fun.rescueFloraCount) break;
    if (!node.alive || node.edible === false) continue;
    const p = player.pos.clone().add(randVec(rand(3.5, 8.5)));
    limitToWorld(p);
    placeAtSurface(p, node.heightOffset || 0.52);
    node.mesh.position.copy(p);
    applyFloraBiome(node);
    node.energy *= 1.18;
    node.mesh.material.emissive.setHex(0x2c5a1f);
    node.mesh.material.emissiveIntensity = 0.18;
    seeded += 1;
  }
}

function updateFunLoop(dt) {
  if (funState.comboTimer > 0) {
    funState.comboTimer = Math.max(0, funState.comboTimer - dt);
    if (funState.comboTimer <= 0) {
      funState.comboCount = 0;
      funState.comboMultiplier = 1;
    }
  }

  funState.rescueTimer = Math.max(0, funState.rescueTimer - dt);
  ensureObjective();
  progressObjective(dt);

  if (
    funState.rescueTimer <= 0 &&
    player.energy < maxEnergy() * BALANCE.fun.rescueEnergyRatio &&
    player.health > 0
  ) {
    funState.rescueTimer = BALANCE.fun.rescueCooldownSeconds;
    pulseNearbyForage();
    player.energy = clamp(player.energy + BALANCE.fun.rescueEnergyBoost, 0, maxEnergy());
    player.health = clamp(player.health + BALANCE.fun.rescueHealthBoost, 0, 100);
    setActionMessage("Nature surge: forage clustered nearby and recovery boosted.", 2.4);
  }
}

function burstDirectionFromInput() {
  const forward = moveForward.copy(player.pos).sub(camera.position);
  forward.y = 0;
  if (forward.lengthSq() < 0.0001) {
    forward.set(-Math.sin(camYaw), 0, -Math.cos(camYaw));
  } else {
    forward.normalize();
  }

  const right = moveRight.crossVectors(forward, worldUp);
  if (right.lengthSq() < 0.0001) {
    right.set(1, 0, 0);
  } else {
    right.normalize();
  }

  const dir = new THREE.Vector3();
  if (KEY.KeyW) dir.add(forward);
  if (KEY.KeyS) dir.sub(forward);
  if (KEY.KeyA) dir.sub(right);
  if (KEY.KeyD) dir.add(right);
  const throttle = (KEY.ArrowUp ? 1 : 0) - (KEY.ArrowDown ? 1 : 0);
  if (throttle !== 0) {
    const scale = throttle > 0 ? 1 : BALANCE.player.steerReverseScale;
    dir.addScaledVector(player.forward, throttle * scale);
  }
  if (dir.lengthSq() < 0.0001) return player.forward.clone();
  return dir.normalize();
}

function tryBurstMove() {
  if (player.burstCooldown > 0) {
    setActionMessage(`Burst cooldown ${player.burstCooldown.toFixed(1)}s`, 1.05);
    return;
  }
  if (player.energy < BALANCE.fun.burstEnergyCost) {
    setActionMessage("Need more energy for burst movement.", 1.3);
    return;
  }

  const dir = burstDirectionFromInput();
  player.forward.lerp(dir, 0.75).normalize();
  const impulse = movementSpeed() * (0.9 + BALANCE.fun.burstSpeedMult * 0.8);
  player.vel.addScaledVector(dir, impulse);
  player.burstTimer = BALANCE.fun.burstDurationSeconds;
  player.burstCooldown = BALANCE.fun.burstCooldownSeconds;
  player.energy = clamp(player.energy - BALANCE.fun.burstEnergyCost, 0, maxEnergy());
  setActionMessage("Burst engaged.", 1.1);
}

function canReproduce() {
  const req = reproductionThresholds();
  return req.readyAge && req.readyEnergy && req.readyHealth && req.readyCooldown;
}

function isSimpleReproductionMode() {
  return !!BALANCE.gameplay.simpleReproduction;
}

function reproductionThresholds() {
  const tone = toneProfile();
  const fertility = clamp(player.fertilityQuality || 1, 0.5, 1.3);
  const fertilityLoad = clamp(1 + (1 - fertility) * 0.5, 0.78, 1.26);
  const ageMin = BALANCE.player.reproductionAgeMin * tone.reproductionAgeMult * fertilityLoad;
  const energyMin =
    maxEnergy() * BALANCE.player.reproductionEnergyRatio * tone.reproductionEnergyMult * fertilityLoad;
  const healthMin = clamp(
    BALANCE.player.reproductionHealthMin + tone.reproductionHealthAdd + (1 - fertility) * 10,
    5,
    95
  );
  const readyAge = player.age >= ageMin;
  const readyEnergy = player.energy >= energyMin;
  const readyHealth = player.health > healthMin;
  const readyCooldown = player.reproductionCooldown <= 0;
  return {
    ageMin,
    energyMin,
    healthMin,
    fertility,
    readyAge,
    readyEnergy,
    readyHealth,
    readyCooldown,
  };
}

function requirementMet(req) {
  if (req.type === "energy") return player.energy >= maxEnergy() * req.min;
  if (req.type === "chase") return player.metrics.chaseSuccess >= req.min;
  if (req.type === "forage") return player.metrics.plants >= req.min;
  return true;
}

function requirementText(req) {
  if (!req) return "unknown";
  if (req.type === "none") return "none";
  if (req.type === "energy") return `energy >= ${Math.round(req.min * 100)}%`;
  if (req.type === "chase") return `chase successes >= ${req.min}`;
  if (req.type === "forage") return `plants eaten >= ${req.min}`;
  return `${req.type}:${req.min}`;
}

function reproductionActionState() {
  const simpleMode = isSimpleReproductionMode();
  const req = reproductionThresholds();
  const phaseOn = matingPhase.active && matingPhase.timer > 0;
  const phaseText = phaseOn ? ` | mating window ${Math.ceil(matingPhase.timer)}s` : "";
  const missing = [];
  if (!req.readyAge) missing.push(`age ${player.age.toFixed(0)}/${req.ageMin.toFixed(0)}`);
  if (!req.readyEnergy) missing.push(`energy ${player.energy.toFixed(0)}/${req.energyMin.toFixed(0)}`);
  if (!req.readyHealth) missing.push(`health ${player.health.toFixed(0)}/${req.healthMin.toFixed(0)}`);
  if (!req.readyCooldown) missing.push(`cooldown ${Math.max(0, player.reproductionCooldown).toFixed(1)}s`);
  if (missing.length > 0) {
    return {
      step: "0/3",
      text: `Build readiness: ${missing.join(" | ")}${phaseText}`,
    };
  }

  if (populations.mates.length === 0) {
    return {
      step: simpleMode ? "1/2" : "1/3",
      text: simpleMode
        ? "Press Mating Call (button or E) to summon candidates."
        : "Press Mating Call (button or E) to signal mates.",
    };
  }

  const selectedMate = ensureSelectedMate();
  if (!selectedMate) {
    return {
      step: simpleMode ? "1/2" : "1/3",
      text: simpleMode
        ? "No mate selected. Press the number shown above a mate (1/2/3) or click a mate card."
        : "No mate selected. Press the number shown above a mate or use Q/R.",
    };
  }

  const dist = selectedMate.mesh.position.distanceTo(player.mesh.position);
  const eligible = requirementMet(selectedMate.requirement);
  if (!eligible) {
    return {
      step: simpleMode ? "2/2" : "2/3",
      text: simpleMode
        ? `Mate locked (${requirementText(selectedMate.requirement)}). Use Mating Call to refresh candidates.`
        : `M${selectedMate.slot} locked (${requirementText(selectedMate.requirement)}). Choose another mate or satisfy requirement.`,
    };
  }

  if (dist > BALANCE.player.reproductionInteractDistance) {
    return {
      step: simpleMode ? "2/2" : "2/3",
      text: simpleMode
        ? `Mate nearby. Move closer (${dist.toFixed(1)}m / ${BALANCE.player.reproductionInteractDistance.toFixed(1)}m), then press E.`
        : `M${selectedMate.slot} eligible. Move closer (${dist.toFixed(1)}m / ${BALANCE.player.reproductionInteractDistance.toFixed(1)}m).`,
    };
  }

  return {
    step: simpleMode ? "2/2" : "3/3",
    text: simpleMode
      ? "Mate in range. Press E now to start the next generation."
      : `M${selectedMate.slot} in range. Press E now to reproduce.`,
  };
}

function requirementShort(req) {
  if (!req) return "req?";
  if (req.type === "none") return "free";
  if (req.type === "energy") return `E>=${Math.round(req.min * 100)}%`;
  if (req.type === "chase") return `C>=${req.min}`;
  if (req.type === "forage") return `F>=${req.min}`;
  return `${req.type}:${req.min}`;
}

function signedPercent(value) {
  const pct = Math.round((Number(value) || 0) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

function dietBiasLabel(traits) {
  const herb = Number(traits && traits.herbivore) || 0;
  const carn = Number(traits && traits.carnivore) || 0;
  if (herb > carn + 0.14) return "grazer-lean";
  if (carn > herb + 0.14) return "hunter-lean";
  return "omnivore-lean";
}

function matePhenotypeDescriptor(profile, traits) {
  if (!profile) return "unknown body";
  const avgScale = (profile.bodyScale.x + profile.bodyScale.y + profile.bodyScale.z) / 3;
  const build = avgScale > 1.2 ? "bulky" : avgScale < 0.92 ? "slender" : "balanced";
  const appendage =
    profile.appendageType === "leg" ? "legged" : profile.appendageType === "fin" ? "finned" : "spined";
  const tail = profile.tailLength > 1.15 ? "long tail" : profile.tailLength < 0.58 ? "short tail" : "medium tail";
  const coat =
    profile.patternType === "spots"
      ? "spots"
      : profile.patternType === "saddle"
        ? "bands"
        : profile.patternType === "rosette"
          ? "rosette"
          : "stripes";
  return `${build} ${appendage} (${profile.appendageCount}) ${tail} ${coat} ${dietBiasLabel(traits)}`;
}

function mateGenePullSummary(mate, count) {
  const top = TRAIT_KEYS.map((key) => ({ key, value: Number(mate.mods[key]) || 0 }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, count || 3);
  return top.map((entry) => `${TRAIT_SHORT[entry.key]} ${signedPercent(entry.value)}`).join(" | ");
}

function strongestMateMod(mate, dir) {
  let bestKey = TRAIT_KEYS[0];
  let bestVal = mate.mods[bestKey] || 0;
  for (const key of TRAIT_KEYS) {
    const value = mate.mods[key] || 0;
    if ((dir > 0 && value > bestVal) || (dir < 0 && value < bestVal)) {
      bestVal = value;
      bestKey = key;
    }
  }
  return { key: bestKey, value: bestVal };
}

function mateModSummary(mate) {
  const up = strongestMateMod(mate, 1);
  const down = strongestMateMod(mate, -1);
  const upSign = up.value >= 0 ? "+" : "-";
  const downSign = down.value >= 0 ? "+" : "-";
  const upAmt = Math.round(Math.abs(up.value) * 100);
  const downAmt = Math.round(Math.abs(down.value) * 100);
  return `${TRAIT_SHORT[up.key]}${upSign}${upAmt}/${TRAIT_SHORT[down.key]}${downSign}${downAmt}`;
}

function getSelectedMate() {
  if (selectedMateId == null) return null;
  for (const mate of populations.mates) {
    if (mate.id === selectedMateId && !mate.captured) return mate;
  }
  return null;
}

function ensureSelectedMate() {
  if (populations.mates.length === 0) {
    selectedMateId = null;
    return null;
  }
  const current = getSelectedMate();
  if (current) return current;
  const ordered = populations.mates
    .filter((mate) => !mate.captured)
    .sort((a, b) => a.slot - b.slot);
  if (ordered.length === 0) {
    selectedMateId = null;
    return null;
  }
  selectedMateId = ordered[0].id;
  return ordered[0];
}

function selectMateById(id, silent) {
  for (const mate of populations.mates) {
    if (!mate.captured && mate.id === id) {
      selectedMateId = mate.id;
      if (!silent) {
        const summary = matePhenotypeDescriptor(mate.phenotypeProfile, mate.traits);
        const match =
          mate.compatibility ||
          evaluateMateCompatibility(player.traits, player.phenotypeDNA, mate.traits, mate.phenotypeDNA);
        setActionMessage(
          `Mate M${mate.slot} selected: ${summary} (${Math.round(match.score * 100)}% ${match.tier}). Move close, then press E.`,
          2.2
        );
      }
      return true;
    }
  }
  if (!silent) setActionMessage("Selected mate is unavailable.", 1.6);
  return false;
}

function selectMateBySlot(slot, silent) {
  for (const mate of populations.mates) {
    if (!mate.captured && mate.slot === slot) {
      return selectMateById(mate.id, silent);
    }
  }
  if (!silent) setActionMessage(`Mate M${slot} unavailable.`, 1.4);
  return false;
}

function cycleMateSelection(dir) {
  const ordered = populations.mates
    .filter((mate) => !mate.captured)
    .sort((a, b) => a.slot - b.slot);
  if (ordered.length === 0) return;
  let idx = ordered.findIndex((mate) => mate.id === selectedMateId);
  if (idx < 0) idx = 0;
  else idx = (idx + dir + ordered.length) % ordered.length;
  selectMateById(ordered[idx].id, false);
}

function matingButtonText() {
  const phaseOn = matingPhase.active && matingPhase.timer > 0;
  const secondsLeft = Math.max(0, Math.ceil(matingPhase.timer));
  const req = reproductionThresholds();
  if (phaseOn) {
    if (req.readyAge && req.readyEnergy && req.readyHealth && req.readyCooldown) {
      return `Refresh Mating Call (${secondsLeft}s left)`;
    }
    return `Mating Phase Active (${secondsLeft}s)`;
  }
  if (!(req.readyAge && req.readyEnergy && req.readyHealth && req.readyCooldown)) {
    return "Mating Call (not ready)";
  }
  if (populations.mates.length === 0) return "Mating Call (E)";
  return "Refresh Mating Call";
}

function updateMatingCallButton() {
  if (!ui.matingCallBtn) return;
  ui.matingCallBtn.textContent = matingButtonText();
  ui.matingCallBtn.disabled = !canReproduce();
}

function renderMateCards() {
  if (!ui.mateCards) return;
  const phaseOn = matingPhase.active && matingPhase.timer > 0;
  const ordered = populations.mates
    .filter((mate) => !mate.captured)
    .sort((a, b) => a.slot - b.slot);
  if (ordered.length === 0) {
    const emptyKey = `empty:${phaseOn ? 1 : 0}:${canReproduce() ? 1 : 0}`;
    if (mateCardsRenderKey === emptyKey) return;
    mateCardsRenderKey = emptyKey;
    const message = phaseOn
      ? "Mating phase is active. Press <strong>Mating Call</strong> to refresh candidates."
      : canReproduce()
        ? "No candidates yet. Press <strong>Mating Call</strong> to summon mates."
        : "Mating is locked until readiness is complete.";
    ui.mateCards.innerHTML = `<div class="mate-card"><div class="mate-line">${message}</div></div>`;
    return;
  }

  const selected = ensureSelectedMate();
  const renderKey = ordered
    .map((mate) => {
      const selectedFlag = selected && mate.id === selected.id ? "1" : "0";
      const eligibleFlag = requirementMet(mate.requirement) ? "1" : "0";
      const dist = mate.mesh.position.distanceTo(player.mesh.position).toFixed(1);
      const compat =
        mate.compatibility ||
        evaluateMateCompatibility(player.traits, player.phenotypeDNA, mate.traits, mate.phenotypeDNA);
      return `${mate.id}:${selectedFlag}:${eligibleFlag}:${dist}:${compat.score.toFixed(2)}:${mate.captured ? 1 : 0}`;
    })
    .join("|");
  if (mateCardsRenderKey === renderKey) return;
  mateCardsRenderKey = renderKey;

  ui.mateCards.innerHTML = ordered
    .map((mate) => {
      const isSelected = !!selected && selected.id === mate.id;
      const eligible = requirementMet(mate.requirement);
      const dist = mate.mesh.position.distanceTo(player.mesh.position);
      const candidateTraits = mate.traits || sanitizeTraits(DEFAULT_TRAITS);
      const candidateProfile = mate.phenotypeProfile;
      const previewTraits = mate.offspringPreviewTraits || previewOffspringTraits(mate.mods);
      const previewDNA =
        mate.offspringPreviewDNA ||
        hybridizePhenotypeDNA(
          player.phenotypeDNA,
          mate.phenotypeDNA || randomPhenotypeDNA(mate.id * 43 + 7, "mate", candidateTraits),
          mate.id * 31 + player.generation * 101
        );
      const previewHeritage = evolvePhenotypeHeritage({
        previousHeritage: player.phenotypeHeritage,
        parentTraits: player.traits,
        parentMorphTraits: player.morphTraits,
        mateTraits: candidateTraits,
        offspringTraits: previewTraits,
        generation: player.generation + 1,
      });
      const previewProfile =
        mate.offspringPreviewProfile ||
        makePhenotypeProfile({
          seed: mate.id * 31 + player.generation * 97,
          role: "player",
          traits: previewTraits,
          dna: previewDNA,
          generation: player.generation + 1,
          heritage: previewHeritage,
        });
      const compatibility =
        mate.compatibility ||
        evaluateMateCompatibility(player.traits, player.phenotypeDNA, candidateTraits, mate.phenotypeDNA);
      const compatibilityPct = Math.round(compatibility.score * 100);
      const candidateSummary = matePhenotypeDescriptor(candidateProfile, candidateTraits);
      const previewSummary = matePhenotypeDescriptor(previewProfile, previewTraits);
      const cardClass = `mate-card compat-${compatibility.tier}${isSelected ? " selected" : ""}${eligible ? "" : " locked"}`;
      const badgeClass = `mate-badge${eligible ? "" : " locked"}`;
      const badgeText = eligible ? "eligible" : "locked";
      const buttonText = isSelected ? "Selected" : "Choose";
      return `<div class="${cardClass}">
        <div class="mate-top">
          <div class="mate-title">Mate M${mate.slot}</div>
          <div class="${badgeClass}">${badgeText}</div>
          <button class="mate-select" data-mate-select="${mate.id}" type="button">${buttonText}</button>
        </div>
        <div class="mate-line">Phenotype: ${candidateSummary}</div>
        <div class="mate-line">Species: ${compatibility.mateSpeciesLabel} | Match: ${compatibilityPct}% (${compatibility.tier})</div>
        <div class="mate-line">Select key: press ${mate.slot}</div>
        <div class="mate-line">Genotype pull: ${mateGenePullSummary(mate, 3)}</div>
        <div class="mate-line">Offspring forecast: ${previewSummary}</div>
        <div class="mate-line">Distance ${dist.toFixed(1)}m | Requirement: ${requirementText(mate.requirement)}</div>
      </div>`;
    })
    .join("");
}

function beginMatingPhase(durationSeconds) {
  const duration = Math.max(20, Number(durationSeconds) || BALANCE.player.matingPhaseDurationSeconds);
  matingPhase.active = true;
  matingPhase.timer = Math.max(matingPhase.timer, duration);
}

function endMatingPhase(message, silent) {
  matingPhase.active = false;
  matingPhase.timer = 0;
  clearGroup(populations.mates);
  clearGroup(populations.rivals);
  updateMateLockVisual(null, null);
  if (!silent && message) setActionMessage(message, 2.6);
}

function updateMatingPhase(dt) {
  if (!matingPhase.active) return;
  matingPhase.timer = Math.max(0, matingPhase.timer - dt);
  if (matingPhase.timer <= 0) {
    endMatingPhase("Mating phase ended. Press Mating Call to start another window.", false);
  }
}

function triggerMatingCall() {
  const req = reproductionThresholds();
  if (!(req.readyAge && req.readyEnergy && req.readyHealth && req.readyCooldown)) {
    setActionMessage("Mating call unavailable until reproduction readiness is complete.", 2.4);
    return false;
  }
  beginMatingPhase(BALANCE.player.matingPhaseDurationSeconds);
  spawnMateCluster();
  const count = populations.mates.length;
  const secondsLeft = Math.max(0, Math.ceil(matingPhase.timer));
  setActionMessage(
    `Mating call sent. ${count} candidate${count === 1 ? "" : "s"} arrived (${secondsLeft}s window). Press the number shown above a mate, move close, then press E.`,
    3.6
  );
  mateCardsRenderKey = "";
  return true;
}

function nearestMateState() {
  let nearestAny = null;
  let nearestAnyDist = 9999;
  let nearestEligible = null;
  let nearestEligibleDist = 9999;

  for (const mate of populations.mates) {
    const d = mate.mesh.position.distanceTo(player.mesh.position);
    if (d < nearestAnyDist) {
      nearestAny = mate;
      nearestAnyDist = d;
    }
    if (requirementMet(mate.requirement) && d < nearestEligibleDist) {
      nearestEligible = mate;
      nearestEligibleDist = d;
    }
  }

  return {
    nearestAny,
    nearestAnyDist,
    nearestEligible,
    nearestEligibleDist,
  };
}

function updateMateLockVisual(state, selectedMate) {
  if (!mateLockVisual) return;
  if (!(matingPhase.active && matingPhase.timer > 0) || !state) {
    mateLockVisual.group.visible = false;
    return;
  }

  const target = selectedMate || state.nearestEligible || state.nearestAny;
  if (!target || !target.mesh) {
    mateLockVisual.group.visible = false;
    return;
  }

  mateLockStart.copy(player.mesh.position);
  mateLockEnd.copy(target.mesh.position);
  mateLockStart.y += 0.58;
  mateLockEnd.y += 0.58;

  mateLockDir.copy(mateLockEnd).sub(mateLockStart);
  const distance = mateLockDir.length();
  if (distance < 0.01) {
    mateLockVisual.group.visible = false;
    return;
  }

  const position = mateLockVisual.positions;
  position[0] = mateLockStart.x;
  position[1] = mateLockStart.y;
  position[2] = mateLockStart.z;
  position[3] = mateLockEnd.x;
  position[4] = mateLockEnd.y;
  position[5] = mateLockEnd.z;
  mateLockVisual.line.geometry.attributes.position.needsUpdate = true;
  mateLockVisual.line.geometry.computeBoundingSphere();

  const eligible = requirementMet(target.requirement);
  const targetDist = target.mesh.position.distanceTo(player.mesh.position);
  const inRange = eligible && targetDist <= BALANCE.player.reproductionInteractDistance;
  const lineColor = inRange ? 0xb8ff77 : eligible ? 0x8edcff : 0x748392;
  mateLockVisual.lineMaterial.color.setHex(lineColor);
  mateLockVisual.tipMaterial.color.setHex(inRange ? 0xeeffdb : eligible ? 0xd6f4ff : 0xcfd7df);
  mateLockVisual.lineMaterial.opacity = inRange ? 0.96 : 0.84;

  mateLockDir.normalize();
  mateLockTipPos.copy(mateLockEnd).addScaledVector(mateLockDir, -0.34);
  mateLockVisual.tip.position.copy(mateLockTipPos);
  mateLockVisual.tip.quaternion.setFromUnitVectors(worldUp, mateLockDir);
  mateLockVisual.tip.scale.setScalar(inRange ? 1.18 : 1);

  mateLockVisual.group.visible = true;
}

function consumeFlora(node) {
  node.alive = false;
  const edible = node.edible !== false;
  const toxic = !!node.toxic;
  node.respawn =
    rand(BALANCE.feeding.floraRespawnMin, BALANCE.feeding.floraRespawnMax) /
    (1 + WORLD.tier * BALANCE.feeding.floraTierRespawnScale);
  if (!edible) node.respawn *= 0.7;
  node.respawn *= node.respawnMult || 1;
  node.mesh.visible = false;
  if (!edible) {
    const harm = (node.harm || 4.5) * (toxic ? 1.15 : 1.0);
    player.energy = clamp(player.energy - (toxic ? 6.5 : 3.5), 0, maxEnergy());
    damagePlayer(harm);
    setActionMessage(
      toxic
        ? `Avoid ${node.variant ? node.variant.label : "spore flora"}: toxic and inedible.`
        : `Avoid ${node.variant ? node.variant.label : "thorn flora"}: inedible.`,
      1.9
    );
    return;
  }
  const baseEnergy = node.energy * (BALANCE.feeding.floraGainBase + player.traits.herbivore);
  const baseHealth = BALANCE.player.floraHealthGain * (0.65 + player.traits.herbivore * 0.35);
  const reward = registerConsumption("flora", baseEnergy, baseHealth);
  player.energy = clamp(player.energy + reward.energy, 0, maxEnergy());
  player.health = clamp(player.health + reward.health, 0, 100);
  applyTraitDelta({ herbivore: 0.0016, stamina: 0.0008 });
  player.metrics.plants += 1;
}

function consumePrey(prey) {
  if (prey.edible === false) {
    prey.noEatCooldown = 2.2;
    damagePlayer(prey.harm || 5.5);
    player.energy = clamp(player.energy - 2.8, 0, maxEnergy());
    const escape = prey.mesh.position.clone().sub(player.mesh.position).setY(0);
    if (escape.lengthSq() > 0.0001) {
      escape.normalize().multiplyScalar(2.1);
      prey.mesh.position.add(escape);
      limitToWorld(prey.mesh.position);
      prey.mesh.position.y = terrainHeightAt(prey.mesh.position.x, prey.mesh.position.z) + prey.heightOffset;
    }
    setActionMessage("This prey species is not digestible.", 1.5);
    return;
  }
  prey.alive = false;
  prey.respawn =
    rand(BALANCE.feeding.preyRespawnMin, BALANCE.feeding.preyRespawnMax) /
    (1 + WORLD.tier * BALANCE.feeding.preyTierRespawnScale);
  prey.mesh.visible = false;
  const baseEnergy =
    rand(BALANCE.feeding.preyEnergyMin, BALANCE.feeding.preyEnergyMax) *
    (BALANCE.feeding.preyGainBase + player.traits.carnivore);
  const baseHealth = BALANCE.player.preyHealthGain * (0.65 + player.traits.carnivore * 0.35);
  const reward = registerConsumption("prey", baseEnergy, baseHealth);
  player.energy = clamp(player.energy + reward.energy, 0, maxEnergy());
  player.health = clamp(player.health + reward.health, 0, 100);
  applyTraitDelta({ carnivore: 0.0017, speed: 0.001, stamina: 0.0004 });
  player.metrics.prey += 1;
  const stamp = ACTIVE_CHASE.get(prey.id);
  if (stamp !== undefined && stamp > simTime - BALANCE.feeding.chaseSuccessWindow) {
    player.metrics.chaseSuccess += 1;
  }
  ACTIVE_CHASE.delete(prey.id);
}

function consumeAquatic(entity) {
  if (entity.edible === false) {
    entity.noEatCooldown = 2.2;
    damagePlayer(entity.harm || 4.8);
    player.energy = clamp(player.energy - 2.1, 0, maxEnergy());
    const escape = entity.mesh.position.clone().sub(player.mesh.position).setY(0);
    if (escape.lengthSq() > 0.0001) {
      escape.normalize().multiplyScalar(2.3);
      entity.mesh.position.add(escape);
      limitToWorld(entity.mesh.position);
      entity.mesh.position.y = terrainHeightAt(entity.mesh.position.x, entity.mesh.position.z) + entity.heightOffset;
    }
    setActionMessage("This aquatic species is inedible.", 1.4);
    return;
  }
  entity.alive = false;
  entity.respawn = rand(BALANCE.feeding.aquaticRespawnMin, BALANCE.feeding.aquaticRespawnMax);
  entity.mesh.visible = false;
  const baseEnergy =
    rand(BALANCE.feeding.aquaticEnergyMin, BALANCE.feeding.aquaticEnergyMax) *
    (BALANCE.feeding.aquaticGainBase + player.traits.swim * 0.58 + player.traits.carnivore * 0.24);
  const baseHealth = BALANCE.player.aquaticHealthGain * (0.64 + player.traits.swim * 0.36);
  const reward = registerConsumption("aquatic", baseEnergy, baseHealth);
  player.energy = clamp(player.energy + reward.energy, 0, maxEnergy());
  player.health = clamp(player.health + reward.health, 0, 100);
  applyTraitDelta({ swim: 0.0018, carnivore: 0.0009, stamina: 0.0005 });
  player.metrics.prey += 1;
}

function consumeAvian(entity) {
  if (entity.edible === false) {
    entity.noEatCooldown = 2.4;
    damagePlayer(entity.harm || 4.2);
    player.energy = clamp(player.energy - 1.8, 0, maxEnergy());
    const escape = entity.mesh.position.clone().sub(player.mesh.position).setY(0);
    if (escape.lengthSq() > 0.0001) {
      escape.normalize().multiplyScalar(2.5);
      entity.mesh.position.add(escape);
      limitToWorld(entity.mesh.position);
      const groundY = terrainHeightAt(entity.mesh.position.x, entity.mesh.position.z);
      entity.mesh.position.y = groundY + (entity.altitude || 5.5);
    }
    setActionMessage("This avian species is inedible.", 1.4);
    return;
  }
  entity.alive = false;
  entity.respawn = rand(BALANCE.feeding.avianRespawnMin, BALANCE.feeding.avianRespawnMax);
  entity.mesh.visible = false;
  const baseEnergy =
    rand(BALANCE.feeding.avianEnergyMin, BALANCE.feeding.avianEnergyMax) *
    (BALANCE.feeding.avianGainBase + player.traits.speed * 0.44 + player.traits.carnivore * 0.24);
  const baseHealth = BALANCE.player.avianHealthGain * (0.62 + player.traits.speed * 0.38);
  const reward = registerConsumption("avian", baseEnergy, baseHealth);
  player.energy = clamp(player.energy + reward.energy, 0, maxEnergy());
  player.health = clamp(player.health + reward.health, 0, 100);
  applyTraitDelta({ speed: 0.0018, social: 0.0007, carnivore: 0.0007 });
  player.metrics.prey += 1;
}

function damagePlayer(amount) {
  player.health = clamp(player.health - amount, 0, 100);
}

function respawnEntity(entity, radiusMin, radiusMax, y) {
  const p = randVec(rand(radiusMin, radiusMax));
  placeAtSurface(p, y);
  entity.mesh.position.copy(p);
  entity.mesh.visible = true;
}

function updateFlora(dt) {
  for (const node of populations.flora) {
    if (!node.alive) {
      node.respawn -= dt;
      if (node.respawn <= 0) {
        node.alive = true;
        respawnEntity(node, WORLD.radius * 0.1, WORLD.radius - 6, node.heightOffset || 0.52);
        applyFloraBiome(node);
      }
      continue;
    }
    const dist = node.mesh.position.distanceTo(player.mesh.position);
    if (dist < 2.15) consumeFlora(node);
  }
}

function updateTrees(dt) {
  for (const tree of populations.trees) {
    tree.swayPhase += dt * 0.55;
    const sway = Math.sin(tree.swayPhase) * 0.06;
    if (tree.canopyLow) tree.canopyLow.rotation.z = sway;
    if (tree.canopyTop) tree.canopyTop.rotation.x = sway * 0.6;

    const base = tree.mesh.position;
    const dx = player.pos.x - base.x;
    const dz = player.pos.z - base.z;
    const dist2 = dx * dx + dz * dz;
    const minDist = (tree.blockRadius || 0.8) + 0.55;
    if (dist2 < minDist * minDist) {
      const dist = Math.sqrt(dist2 + 0.0001);
      const push = (minDist - dist) * 0.85;
      player.pos.x += (dx / dist) * push;
      player.pos.z += (dz / dist) * push;
      limitToWorld(player.pos);
      placeAtSurface(player.pos, PLAYER_HEIGHT_OFFSET);
      player.mesh.position.copy(player.pos);
    }
  }
}

function updatePrey(dt) {
  for (const prey of populations.prey) {
    if (!prey.alive) {
      prey.respawn -= dt;
      if (prey.respawn <= 0) {
        prey.alive = true;
        prey.wander = randVec(1);
        prey.noEatCooldown = 0;
        respawnEntity(prey, WORLD.radius * 0.14, WORLD.radius - 8, prey.heightOffset);
      }
      continue;
    }

    const pos = prey.mesh.position;
    prey.noEatCooldown = Math.max(0, (prey.noEatCooldown || 0) - dt);
    let desired = prey.wander.clone();

    const toPlayer = chaseProbe.copy(player.mesh.position).sub(pos);
    const playerDist = toPlayer.length();
    if (playerDist < 9) {
      desired.addScaledVector(toPlayer.normalize(), -2.4);
    }

    let nearestPred = null;
    let nearestPredDist = 9999;
    for (const pred of populations.predators) {
      const d = pred.mesh.position.distanceTo(pos);
      if (d < nearestPredDist) {
        nearestPredDist = d;
        nearestPred = pred;
      }
    }

    if (nearestPred && nearestPredDist < 11) {
      desired.add(
        pos.clone().sub(nearestPred.mesh.position).normalize().multiplyScalar(2.7)
      );
    }

    socialAlign.set(0, 0, 0);
    socialCohesion.set(0, 0, 0);
    socialSeparation.set(0, 0, 0);
    let neighbors = 0;
    const flockRadiusSq = BALANCE.social.preyFlockRadius * BALANCE.social.preyFlockRadius;
    const separationSq =
      BALANCE.social.preySeparationRadius * BALANCE.social.preySeparationRadius;

    for (const other of populations.prey) {
      if (other === prey || !other.alive) continue;
      const d2 = socialTemp.copy(other.mesh.position).sub(pos).lengthSq();
      if (d2 > flockRadiusSq || d2 < 0.0001) continue;

      neighbors += 1;
      socialAlign.add(other.vel);
      socialCohesion.add(other.mesh.position);

      if (d2 < separationSq) {
        const invDist = 1 / Math.sqrt(d2 + 0.0001);
        socialSeparation.addScaledVector(socialTemp, -invDist);
      }
    }

    if (neighbors > 0) {
      const socialWeight = prey.social;

      socialAlign.divideScalar(neighbors);
      if (socialAlign.lengthSq() > 0.0001) {
        socialAlign
          .normalize()
          .multiplyScalar(BALANCE.social.preyAlignmentWeight * socialWeight);
        desired.add(socialAlign);
      }

      socialCohesion.divideScalar(neighbors).sub(pos);
      if (socialCohesion.lengthSq() > 0.0001) {
        socialCohesion
          .normalize()
          .multiplyScalar(BALANCE.social.preyCohesionWeight * socialWeight);
        desired.add(socialCohesion);
      }

      if (socialSeparation.lengthSq() > 0.0001) {
        socialSeparation
          .normalize()
          .multiplyScalar(BALANCE.social.preySeparationWeight * (0.7 + socialWeight * 0.5));
        desired.add(socialSeparation);
      }
    }

    if (Math.random() < 0.013) prey.wander = randVec(1);
    desired.normalize();
    prey.vel.lerp(desired.multiplyScalar(prey.speed), dt * 2.3);
    pos.addScaledVector(prey.vel, dt);
    limitToWorld(pos);
    pos.y = terrainHeightAt(pos.x, pos.z) + prey.heightOffset;

    if (playerDist < 11) {
      const toPrey = pos.clone().sub(player.mesh.position);
      const toward = toPrey.normalize().dot(player.forward);
      if (toward > 0.28 && player.vel.lengthSq() > 1.2) {
        const previous = ACTIVE_CHASE.get(prey.id) || -9999;
        if (simTime - previous > 2.5) {
          ACTIVE_CHASE.set(prey.id, simTime);
          player.metrics.chaseAttempts += 1;
        }
      }
    }

    const catchDist = pos.distanceTo(player.mesh.position);
    if (prey.noEatCooldown <= 0 && catchDist < 1.78 && player.vel.length() > prey.speed * 0.32) {
      consumePrey(prey);
    }

    orientMeshToVelocity(prey.mesh, prey.vel, dt, 9);
    animatePhenotype(prey.mesh, prey.vel.length() / Math.max(0.01, prey.speed), simTime, dt);
  }
}

function respawnAquatic(entity) {
  const p = randomAquaticSpawnPoint();
  placeAtSurface(p, entity.heightOffset);
  entity.mesh.position.copy(p);
  entity.mesh.visible = true;
  entity.wander = randVec(1);
  entity.vel.set(0, 0, 0);
  entity.noEatCooldown = 0;
}

function updateAquatic(dt) {
  for (const entity of populations.aquatic) {
    if (!entity.alive) {
      entity.respawn -= dt;
      if (entity.respawn <= 0) respawnAquatic(entity);
      continue;
    }

    const pos = entity.mesh.position;
    entity.noEatCooldown = Math.max(0, (entity.noEatCooldown || 0) - dt);
    let desired = entity.wander.clone();
    const hereBiome = biomeAtXZ(pos.x, pos.z);
    if (!biomeIsWaterLike(hereBiome)) {
      desired.add(LAGOON_CENTER.clone().sub(pos).setY(0).normalize().multiplyScalar(2.3));
    }

    const toPlayer = chaseProbe.copy(player.mesh.position).sub(pos);
    const playerDist = toPlayer.length();
    if (playerDist < 8.5) {
      desired.addScaledVector(toPlayer.normalize(), -1.7);
      player.metrics.socialExposure += dt * 0.08;
    }

    socialAlign.set(0, 0, 0);
    socialCohesion.set(0, 0, 0);
    socialSeparation.set(0, 0, 0);
    let neighbors = 0;
    for (const other of populations.aquatic) {
      if (other === entity || !other.alive) continue;
      const d2 = socialTemp.copy(other.mesh.position).sub(pos).lengthSq();
      if (d2 > 64 || d2 < 0.0001) continue;
      neighbors += 1;
      socialAlign.add(other.vel);
      socialCohesion.add(other.mesh.position);
      if (d2 < 4.2) {
        const invDist = 1 / Math.sqrt(d2 + 0.0001);
        socialSeparation.addScaledVector(socialTemp, -invDist);
      }
    }
    if (neighbors > 0) {
      const school = entity.school;
      socialAlign.divideScalar(neighbors);
      if (socialAlign.lengthSq() > 0.0001) {
        desired.add(socialAlign.normalize().multiplyScalar(0.68 * school));
      }
      socialCohesion.divideScalar(neighbors).sub(pos);
      if (socialCohesion.lengthSq() > 0.0001) {
        desired.add(socialCohesion.normalize().multiplyScalar(0.45 * school));
      }
      if (socialSeparation.lengthSq() > 0.0001) {
        desired.add(socialSeparation.normalize().multiplyScalar(0.92 * (0.6 + school * 0.4)));
      }
    }

    if (Math.random() < 0.016) entity.wander = randVec(1);
    if (desired.lengthSq() > 0.0001) desired.normalize();
    entity.vel.lerp(desired.multiplyScalar(entity.speed), dt * 2.25);
    pos.addScaledVector(entity.vel, dt);
    limitToWorld(pos);
    entity.floatPhase += dt * 2.2;
    pos.y = terrainHeightAt(pos.x, pos.z) + entity.heightOffset + Math.sin(entity.floatPhase) * 0.12;

    const catchDist = pos.distanceTo(player.mesh.position);
    if (
      entity.noEatCooldown <= 0 &&
      catchDist < 1.62 &&
      (player.traits.swim > 0.2 || biomeIsWaterLike(biomeAt(player.pos)))
    ) {
      consumeAquatic(entity);
      continue;
    }

    orientMeshToVelocity(entity.mesh, entity.vel, dt, 7.5);
    animatePhenotype(entity.mesh, entity.vel.length() / Math.max(0.01, entity.speed), simTime, dt);
  }
}

function respawnAvian(entity) {
  const p = randVec(rand(WORLD.radius * 0.22, WORLD.radius - 8));
  limitToWorld(p);
  p.y = terrainHeightAt(p.x, p.z) + entity.altitude + rand(-1.2, 1.2);
  entity.mesh.position.copy(p);
  entity.mesh.visible = true;
  entity.wander = randVec(1);
  entity.vel.set(0, 0, 0);
  entity.noEatCooldown = 0;
}

function updateAvian(dt) {
  for (const entity of populations.avian) {
    if (!entity.alive) {
      entity.respawn -= dt;
      if (entity.respawn <= 0) respawnAvian(entity);
      continue;
    }

    const pos = entity.mesh.position;
    entity.noEatCooldown = Math.max(0, (entity.noEatCooldown || 0) - dt);
    let desired = entity.wander.clone();
    const toPlayer = chaseProbe.copy(player.mesh.position).sub(pos);
    const playerDist = toPlayer.length();
    if (playerDist < 10.5) {
      desired.addScaledVector(toPlayer.normalize(), -2.0);
      player.metrics.socialExposure += dt * 0.05;
    }

    socialAlign.set(0, 0, 0);
    socialCohesion.set(0, 0, 0);
    socialSeparation.set(0, 0, 0);
    let neighbors = 0;
    for (const other of populations.avian) {
      if (other === entity || !other.alive) continue;
      const d2 = socialTemp.copy(other.mesh.position).sub(pos).lengthSq();
      if (d2 > 120 || d2 < 0.0001) continue;
      neighbors += 1;
      socialAlign.add(other.vel);
      socialCohesion.add(other.mesh.position);
      if (d2 < 8) {
        const invDist = 1 / Math.sqrt(d2 + 0.0001);
        socialSeparation.addScaledVector(socialTemp, -invDist);
      }
    }
    if (neighbors > 0) {
      const flock = entity.flock;
      socialAlign.divideScalar(neighbors);
      if (socialAlign.lengthSq() > 0.0001) desired.add(socialAlign.normalize().multiplyScalar(0.62 * flock));
      socialCohesion.divideScalar(neighbors).sub(pos);
      if (socialCohesion.lengthSq() > 0.0001) desired.add(socialCohesion.normalize().multiplyScalar(0.42 * flock));
      if (socialSeparation.lengthSq() > 0.0001) {
        desired.add(socialSeparation.normalize().multiplyScalar(0.88 * (0.62 + flock * 0.36)));
      }
    }

    if (Math.random() < 0.014) entity.wander = randVec(1);
    if (desired.lengthSq() > 0.0001) desired.normalize();
    entity.vel.lerp(desired.multiplyScalar(entity.speed), dt * 2.05);
    pos.addScaledVector(entity.vel, dt);
    limitToWorld(pos);

    entity.flapPhase += dt * 4.4;
    const groundY = terrainHeightAt(pos.x, pos.z);
    pos.y = groundY + entity.altitude + Math.sin(entity.flapPhase) * 0.5;

    const verticalDelta = Math.abs(pos.y - player.mesh.position.y);
    if (
      entity.noEatCooldown <= 0 &&
      playerDist < 1.95 &&
      verticalDelta < 2.7 &&
      player.vel.length() > movementSpeed() * 0.34
    ) {
      consumeAvian(entity);
      continue;
    }

    orientMeshToVelocity(entity.mesh, entity.vel, dt, 8.6);
    animatePhenotype(entity.mesh, entity.vel.length() / Math.max(0.01, entity.speed), simTime, dt);
  }
}

function updatePredators(dt) {
  if (!BALANCE.gameplay.predatorsEnabled) {
    if (populations.predators.length > 0) clearGroup(populations.predators);
    ACTIVE_THREATS.clear();
    return;
  }

  for (const pred of populations.predators) {
    const pos = pred.mesh.position;
    let target = null;
    let targetDist = 9999;

    for (const prey of populations.prey) {
      if (!prey.alive) continue;
      const d = prey.mesh.position.distanceTo(pos);
      if (d < targetDist) {
        targetDist = d;
        target = prey.mesh.position;
      }
    }

    const playerDist = player.mesh.position.distanceTo(pos);
    if (playerDist < 14 && (targetDist > 12 || Math.random() < 0.5)) {
      target = player.mesh.position;
      targetDist = playerDist;
    }

    let desired;
    if (target && targetDist < 36) {
      desired = target.clone().sub(pos).normalize();
    } else {
      if (Math.random() < 0.012) pred.wander = randVec(1);
      desired = pred.wander.clone().normalize();
    }

    socialAlign.set(0, 0, 0);
    socialCohesion.set(0, 0, 0);
    socialSeparation.set(0, 0, 0);
    let packNeighbors = 0;
    const packRadiusSq = BALANCE.social.predatorPackRadius * BALANCE.social.predatorPackRadius;
    const predatorSeparationSq =
      BALANCE.social.predatorSeparationRadius * BALANCE.social.predatorSeparationRadius;

    for (const other of populations.predators) {
      if (other === pred) continue;
      const d2 = socialTemp.copy(other.mesh.position).sub(pos).lengthSq();
      if (d2 > packRadiusSq || d2 < 0.0001) continue;

      packNeighbors += 1;
      socialAlign.add(other.vel);
      socialCohesion.add(other.mesh.position);

      if (d2 < predatorSeparationSq) {
        const invDist = 1 / Math.sqrt(d2 + 0.0001);
        socialSeparation.addScaledVector(socialTemp, -invDist);
      }
    }

    if (packNeighbors > 0) {
      const chaseBoost = target && targetDist < 36 ? BALANCE.social.predatorPackChaseBoost : 0;
      const packWeight = pred.pack + chaseBoost;

      socialAlign.divideScalar(packNeighbors);
      if (socialAlign.lengthSq() > 0.0001) {
        socialAlign
          .normalize()
          .multiplyScalar(BALANCE.social.predatorAlignmentWeight * packWeight);
        desired.add(socialAlign);
      }

      socialCohesion.divideScalar(packNeighbors).sub(pos);
      if (socialCohesion.lengthSq() > 0.0001) {
        socialCohesion
          .normalize()
          .multiplyScalar(BALANCE.social.predatorCohesionWeight * packWeight);
        desired.add(socialCohesion);
      }

      if (socialSeparation.lengthSq() > 0.0001) {
        socialSeparation
          .normalize()
          .multiplyScalar(BALANCE.social.predatorSeparationWeight * (0.8 + packWeight * 0.4));
        desired.add(socialSeparation);
      }
    }

    if (desired.lengthSq() > 0.0001) desired.normalize();

    pred.vel.lerp(desired.multiplyScalar(pred.speed), dt * 2.2);
    pos.addScaledVector(pred.vel, dt);
    limitToWorld(pos);
    pos.y = terrainHeightAt(pos.x, pos.z) + pred.heightOffset;

    for (const prey of populations.prey) {
      if (!prey.alive) continue;
      if (prey.mesh.position.distanceTo(pos) < 1.5) {
        prey.alive = false;
        prey.respawn = rand(8, 14);
        prey.mesh.visible = false;
      }
    }

    const dPlayer = player.mesh.position.distanceTo(pos);
    if (dPlayer < 11) {
      const previous = ACTIVE_THREATS.get(pred.id);
      if (previous === undefined) {
        ACTIVE_THREATS.set(pred.id, simTime);
        player.metrics.threatEvents += 1;
      }
    } else {
      const started = ACTIVE_THREATS.get(pred.id);
      if (started !== undefined && simTime - started > 2.0) {
        ACTIVE_THREATS.delete(pred.id);
        player.metrics.threatEscapes += 1;
      }
    }

    if (dPlayer < 2.15) {
      damagePlayer(BALANCE.player.predatorContactDamage * dt);
      const push = threatProbe.copy(player.mesh.position).sub(pos).normalize();
      player.pos.addScaledVector(push, dt * BALANCE.player.predatorKnockback);
      limitToWorld(player.pos);
    }

    orientMeshToVelocity(pred.mesh, pred.vel, dt, 8.4);
    animatePhenotype(pred.mesh, pred.vel.length() / Math.max(0.01, pred.speed), simTime, dt);
  }
}

function updateMatesAndRivals(dt) {
  const tone = toneProfile();
  const phaseOn = matingPhase.active && matingPhase.timer > 0;
  if (!phaseOn) {
    if (populations.mates.length > 0) clearGroup(populations.mates);
    if (populations.rivals.length > 0) clearGroup(populations.rivals);
    updateMateLockVisual(null, null);
    return;
  }

  if (populations.mates.length === 0) {
    updateMateLockVisual(null, null);
    return;
  }

  const selectedMate = ensureSelectedMate();
  const state = nearestMateState();

  for (const mate of populations.mates) {
    if (mate.captured) continue;
    mate.pulse += dt * 2.4;
    const eligible = requirementMet(mate.requirement);
    const compatibility =
      mate.compatibility ||
      evaluateMateCompatibility(player.traits, player.phenotypeDNA, mate.traits, mate.phenotypeDNA);
    const isNearestEligible = !!state.nearestEligible && state.nearestEligible.id === mate.id;
    const isNearestAny = !!state.nearestAny && state.nearestAny.id === mate.id;
    const isSelected = !!selectedMate && selectedMate.id === mate.id;

    mate.mesh.scale.setScalar(1 + Math.sin(mate.pulse) * (isSelected ? 0.13 : isNearestAny ? 0.11 : 0.07));
    const compatColor = mateCompatibilityColor(compatibility.tier);
    let tint = eligible ? compatColor : 0x5f6f80;
    if (isSelected) tint = eligible ? tintAdjust(compatColor, 0, 0.05, 0.12) : 0x8993a1;
    if (isNearestEligible) tint = 0xb3ff78;
    mate.mesh.material.color.setHex(tint);
    setPhenotypeTint(mate.mesh, tint);

    if (player.mesh.position.distanceTo(mate.mesh.position) < 7.2) {
      player.metrics.socialExposure += dt * tone.socialExposureMult;
    }

    if (mate.marker) {
      const ringColor = eligible
        ? isNearestEligible
          ? 0xc6ff87
          : isSelected
            ? tintAdjust(compatColor, 0, 0.04, 0.14)
            : compatColor
        : isSelected
          ? 0xa0acbb
          : 0x728496;
      mate.marker.ringMaterial.color.setHex(ringColor);
      mate.marker.beamMaterial.color.setHex(ringColor);
      mate.marker.tipMaterial.color.setHex(eligible ? 0xf0ffe6 : 0xc5cfd8);
      mate.marker.beam.scale.y = isSelected ? 1.34 : isNearestAny ? 1.25 : 1;
      mate.marker.tip.position.y = 2.08 + Math.sin(mate.pulse * 1.8) * 0.08;
      mate.marker.tag.position.y = 2.65 + Math.sin(mate.pulse * 1.7) * 0.05;
      mate.marker.tag.material.opacity = isSelected || isNearestAny ? 1 : 0.9;
      const tagScale = isSelected ? 1.2 : isNearestAny ? 1.12 : 1;
      mate.marker.tag.scale.set(1.55 * tagScale, 0.78 * tagScale, 1);
      if (mate.marker.keyTag) {
        const keyPulse = 1 + Math.sin(mate.pulse * 1.9 + mate.id * 0.17) * 0.03;
        const keyScale = (isSelected ? 1.07 : isNearestAny ? 1.02 : 1) * keyPulse;
        mate.marker.keyTag.position.y = 3.37 + Math.sin(mate.pulse * 1.3) * 0.04;
        mate.marker.keyTag.scale.set(2.15 * keyScale, 0.72 * keyScale, 1);
        mate.marker.keyTag.material.opacity = isSelected ? 1 : isNearestAny ? 0.96 : 0.9;
      }
      if (mate.marker.actionTag) {
        const dist = mate.mesh.position.distanceTo(player.mesh.position);
        const showAction = isSelected && eligible && dist <= BALANCE.player.reproductionInteractDistance;
        mate.marker.actionTag.visible = showAction;
        if (showAction) {
          mate.marker.actionTag.position.y = 4.02 + Math.sin(mate.pulse * 2.1) * 0.06;
          mate.marker.actionTag.material.opacity = 0.96;
        }
      }
      mate.marker.group.rotation.y += dt * 0.7;
    }

    animatePhenotype(mate.mesh, 0.12, simTime, dt);
  }

  for (const rival of populations.rivals) {
    const mate = populations.mates[rival.targetIndex];
    if (!mate || mate.captured) continue;
    const toMate = mate.mesh.position.clone().sub(rival.mesh.position);
    const d = toMate.length();
    if (d > 0.2) {
      rival.mesh.position.addScaledVector(toMate.normalize(), rival.speed * dt);
      limitToWorld(rival.mesh.position);
      rival.mesh.position.y =
        terrainHeightAt(rival.mesh.position.x, rival.mesh.position.z) + rival.heightOffset;
    }
    if (d < 2.0) {
      rival.claimTimer += dt;
      if (rival.claimTimer > 3.4 * tone.rivalClaimScale) {
        mate.captured = true;
        scene.remove(mate.mesh);
        disposeMeshTree(mate.mesh);
      }
    } else {
      rival.claimTimer = 0;
    }

    orientMeshToVelocity(rival.mesh, toMate, dt, 10);
    const rivalSpeedNorm = d > 0.2 ? 0.68 : 0.16;
    if (rival.marker) {
      rival.marker.cone.rotation.y += dt * 2.8;
      rival.marker.warnMaterial.color.setHex(d < 3.2 ? 0xff6d55 : 0xffb56e);
      rival.marker.tag.position.y = 2.25 + Math.sin(simTime * 2.4 + rival.id) * 0.04;
    }
    animatePhenotype(rival.mesh, rivalSpeedNorm, simTime, dt);
  }

  populations.mates = populations.mates.filter((m) => !m.captured);

  if (populations.mates.length === 0) {
    const hadRivals = populations.rivals.length > 0;
    clearGroup(populations.rivals);
    if (hadRivals) {
      player.reproductionCooldown = BALANCE.player.reproductionCooldownAfterFail;
      setActionMessage("Rivals disrupted mating. Recover before the next mating call.", 2.2);
    }
    updateMateLockVisual(null, null);
    return;
  }

  const selectedAfter = ensureSelectedMate();
  updateMateLockVisual(nearestMateState(), selectedAfter);
}

function updatePlayer(dt) {
  const tone = toneProfile();
  player.age += dt;
  player.reproductionCooldown = Math.max(0, player.reproductionCooldown - dt);
  player.burstCooldown = Math.max(0, player.burstCooldown - dt);
  player.burstTimer = Math.max(0, player.burstTimer - dt);

  const forward = moveForward.copy(player.pos).sub(camera.position);
  forward.y = 0;
  if (forward.lengthSq() < 0.0001) {
    forward.set(-Math.sin(camYaw), 0, -Math.cos(camYaw));
  } else {
    forward.normalize();
  }

  const right = moveRight.crossVectors(forward, worldUp);
  if (right.lengthSq() < 0.0001) {
    right.set(1, 0, 0);
  } else {
    right.normalize();
  }

  const steerTurn =
    (KEY.ArrowRight ? 1 : 0) - (KEY.ArrowLeft ? 1 : 0);
  if (steerTurn !== 0) {
    const yaw = steerTurn * BALANCE.player.steerTurnRate * dt;
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const fx = player.forward.x;
    const fz = player.forward.z;
    player.forward.x = fx * cosYaw + fz * sinYaw;
    player.forward.z = fz * cosYaw - fx * sinYaw;
    player.forward.normalize();
  }

  const input = new THREE.Vector3();
  const cameraInput = new THREE.Vector3();

  if (KEY.KeyW) cameraInput.add(forward);
  if (KEY.KeyS) cameraInput.sub(forward);
  if (KEY.KeyA) cameraInput.sub(right);
  if (KEY.KeyD) cameraInput.add(right);
  if (cameraInput.lengthSq() > 0.001) input.add(cameraInput.normalize());

  const steerThrottle = (KEY.ArrowUp ? 1 : 0) - (KEY.ArrowDown ? 1 : 0);
  if (steerThrottle !== 0) {
    const throttleScale = steerThrottle > 0 ? 1 : BALANCE.player.steerReverseScale;
    input.addScaledVector(player.forward, steerThrottle * throttleScale);
  }

  if (input.lengthSq() > 0.001) {
    input.normalize();
    player.forward.lerp(input, dt * 8);
    player.metrics.activeTime += dt;
  }

  const isSprinting =
    (KEY.ShiftLeft || KEY.ShiftRight) &&
    input.lengthSq() > 0.001 &&
    player.energy > maxEnergy() * 0.08;
  const baseMoveSpd = movementSpeed();
  let moveSpd = baseMoveSpd;
  if (isSprinting) moveSpd *= BALANCE.fun.sprintSpeedMult;
  if (player.burstTimer > 0) moveSpd *= BALANCE.fun.burstSpeedMult;
  const targetVel = input.multiplyScalar(moveSpd);
  player.vel.lerp(targetVel, dt * 7.5);
  const moveDelta = player.vel.clone().multiplyScalar(dt);
  player.pos.add(moveDelta);
  limitToWorld(player.pos);
  player.pos.y = terrainHeightAt(player.pos.x, player.pos.z) + PLAYER_HEIGHT_OFFSET;
  player.metrics.distance += moveDelta.length();

  const biome = biomeAt(player.pos);
  let energyDrain =
    (BALANCE.player.energyDrainBase + moveDelta.length() * BALANCE.player.energyDrainMoveScale) *
    dt;
  const moveSpdSafe = Math.max(0.01, moveSpd);
  const speedRatio = clamp(player.vel.length() / moveSpdSafe, 0, 1);
  const idleThreshold = clamp(BALANCE.player.idleThresholdRatio, 0.02, 1);
  const idleBlend = speedRatio >= idleThreshold ? 1 : speedRatio / idleThreshold;
  const idleDrainScale = BALANCE.player.idleDrainScale + (1 - BALANCE.player.idleDrainScale) * idleBlend;
  energyDrain *= idleDrainScale;
  if (isSprinting) energyDrain *= BALANCE.fun.sprintDrainMult;
  if (player.burstTimer > 0) energyDrain += BALANCE.fun.burstDrainPerSecond * dt;

  if (biome === BIOMES.volcanic.id) {
    player.metrics.heatExposure += dt;
    energyDrain += (1 - player.traits.heat) * WORLD.hazardScale * BALANCE.player.scorchDrainScale * dt;
  } else if (biome === BIOMES.wetland.id || biome === BIOMES.cloudforest.id) {
    player.metrics.waterExposure += dt;
    energyDrain += (1 - player.traits.swim) * WORLD.hazardScale * BALANCE.player.wetlandDrainScale * dt;
  } else if (biome === BIOMES.beach.id) {
    player.metrics.waterExposure += dt * 0.5;
    energyDrain += (1 - player.traits.swim) * WORLD.hazardScale * BALANCE.player.wetlandDrainScale * dt * 0.28;
  }
  energyDrain *= tone.energyDrainMult;
  if (player.age < BALANCE.player.earlyLifeGraceSeconds) {
    energyDrain *= BALANCE.player.earlyLifeDrainMult;
  }

  const canIdleRecover =
    speedRatio < idleThreshold * 0.95 &&
    biome !== BIOMES.volcanic.id &&
    (!BALANCE.gameplay.predatorsEnabled || ACTIVE_THREATS.size === 0);
  const idleRecovery = canIdleRecover
    ? BALANCE.player.idleEnergyRecovery * (0.7 + player.traits.stamina * 0.6) * dt
    : 0;
  player.energy = clamp(player.energy - energyDrain + idleRecovery, 0, maxEnergy());

  const lowEnergyDamageEnabled = player.age >= BALANCE.player.lowEnergyDamageGraceSeconds;
  if (lowEnergyDamageEnabled && player.energy < maxEnergy() * BALANCE.player.lowEnergyRatio) {
    damagePlayer(
      (BALANCE.player.lowEnergyDamageBase +
        WORLD.hazardScale * BALANCE.player.lowEnergyDamageHazardScale) *
        dt *
        tone.damageMult
    );
  } else {
    player.health = clamp(player.health + BALANCE.player.passiveHealthRegen * tone.regenMult * dt, 0, 100);
  }

  player.mesh.position.copy(player.pos);
  player.mesh.rotation.y = Math.atan2(player.forward.x, player.forward.z);
  if (player.marker) {
    player.marker.ring.rotation.z += dt * 0.65;
    player.marker.beacon.position.y = 1.86 + Math.sin(simTime * 2.2) * 0.08;
  }
  animatePhenotype(player.mesh, player.vel.length() / Math.max(0.01, moveSpd), simTime, dt);
}

function buildEvolutionTargetTraits() {
  const m = player.metrics;
  const age = Math.max(player.age, 1);
  const totalFood = m.plants + m.prey;
  const plantRatio = totalFood > 0 ? m.plants / totalFood : player.traits.herbivore;
  const preyRatio = totalFood > 0 ? m.prey / totalFood : player.traits.carnivore;
  const chaseRate = m.chaseAttempts > 0 ? m.chaseSuccess / m.chaseAttempts : 0;
  const evadeRate = m.threatEvents > 0 ? m.threatEscapes / m.threatEvents : 0.45;
  const activeRatio = clamp(m.activeTime / age, 0, 1);
  const heatRatio = clamp(m.heatExposure / age, 0, 1);
  const waterRatio = clamp(m.waterExposure / age, 0, 1);
  const socialRatio = clamp(m.socialExposure / age, 0, 1);

  return {
    speed: clamp(0.2 + chaseRate * 0.5 + evadeRate * 0.18, 0, 1),
    stamina: clamp(0.2 + activeRatio * 0.62, 0, 1),
    herbivore: clamp(plantRatio, 0, 1),
    carnivore: clamp(preyRatio, 0, 1),
    swim: clamp(waterRatio, 0, 1),
    heat: clamp(heatRatio, 0, 1),
    social: clamp(socialRatio, 0, 1),
  };
}

function blendOffspringTraits(target, mateMods, includeMutation) {
  const tone = toneProfile();
  const next = {};
  const targetWeight = clamp(
    BALANCE.evolution.targetWeight * tone.targetWeightScale,
    0.18,
    0.45
  );
  for (const key of TRAIT_KEYS) {
    const mutation = includeMutation
      ? rand(BALANCE.evolution.mutationMin, BALANCE.evolution.mutationMax) * tone.mutationScale
      : 0;
    const v =
      player.traits[key] * BALANCE.evolution.parentWeight +
      target[key] * targetWeight +
      (mateMods[key] || 0) +
      mutation;
    next[key] = clamp(v, 0, 1);
  }

  const dietSum = next.herbivore + next.carnivore;
  if (dietSum > BALANCE.evolution.dietCap) {
    next.herbivore /= dietSum / BALANCE.evolution.dietCap;
    next.carnivore /= dietSum / BALANCE.evolution.dietCap;
  }
  return next;
}

function previewOffspringTraits(mateMods) {
  return blendOffspringTraits(buildEvolutionTargetTraits(), mateMods, false);
}

function evolveTraits(mateMods) {
  return blendOffspringTraits(buildEvolutionTargetTraits(), mateMods, true);
}

function nextGeneration(mate) {
  telemetry.births += 1;
  const parentTraits = sanitizeTraits(player.traits);
  const parentMorphTraits = sanitizeTraits(player.morphTraits || player.traits);
  const previousHeritage = sanitizeTraits(player.phenotypeHeritage || parentTraits);
  const mateTraits = sanitizeTraits(mate.traits || parentTraits);
  const parentDNA = sanitizePhenotypeDNA(
    player.phenotypeDNA || randomPhenotypeDNA(player.morphSeed + player.generation * 53, "player", parentTraits)
  );
  const mateDNA = sanitizePhenotypeDNA(
    mate.phenotypeDNA || randomPhenotypeDNA(mate.id * 17 + player.generation * 13, "mate", mateTraits)
  );
  const compatibility =
    mate.compatibility || evaluateMateCompatibility(parentTraits, parentDNA, mateTraits, mateDNA);
  const entry = {
    generation: player.generation,
    age: Number(player.age.toFixed(1)),
    food: { plants: player.metrics.plants, prey: player.metrics.prey },
    traits: { ...player.traits },
    mateChoice: {
      slot: mate.slot,
      phenotype: matePhenotypeDescriptor(mate.phenotypeProfile, mate.traits),
      genotypePull: TRAIT_KEYS.reduce((out, key) => {
        out[key] = Number((mate.mods[key] || 0).toFixed(4));
        return out;
      }, {}),
    },
  };
  player.lineage.push(entry);

  const offspringTraits = evolveTraits(mate.mods);
  const offspringDNA = hybridizePhenotypeDNA(
    parentDNA,
    mateDNA,
    player.generation * 4099 + mate.id * 131
  );
  player.traits = offspringTraits;
  player.phenotypeDNA = offspringDNA;
  player.generation += 1;
  player.phenotypeHeritage = evolvePhenotypeHeritage({
    previousHeritage,
    parentTraits,
    parentMorphTraits,
    mateTraits,
    offspringTraits,
    generation: player.generation,
  });
  resetPlayerMorphology(
    player.generation * 911 + Math.floor(Math.random() * 9000) + 29
  );
  setWorldFromGeneration(player.generation);
  rebuildBiomeVisuals();

  const compatibilityScore = clamp(compatibility.score || 0.5, 0.1, 1);
  player.fertilityQuality = clamp(
    player.fertilityQuality * 0.42 + (0.58 + compatibilityScore * 0.66) * 0.58,
    0.5,
    1.28
  );
  initPlayerLifecycle(
    clamp(BALANCE.player.offspringStartEnergyRatio * (0.86 + compatibilityScore * 0.24), 0.58, 0.94)
  );
  player.reproductionCooldown = clamp(
    BALANCE.player.reproductionCooldownAfterBirth * (1.18 - compatibilityScore * 0.32),
    4,
    22
  );

  clearGroup(populations.mates);
  clearGroup(populations.rivals);
  syncPopulation();
  saveSnapshot("generation");
}

function tryReproduce() {
  const simpleMode = isSimpleReproductionMode();
  const req = reproductionThresholds();
  if (!(req.readyAge && req.readyEnergy && req.readyHealth && req.readyCooldown)) {
    setActionMessage("Not ready yet. Follow the Repro action line.", 2.3);
    return;
  }

  if (populations.mates.length === 0) {
    triggerMatingCall();
    return;
  }

  const selectedMate = ensureSelectedMate();
  if (!selectedMate) {
    setActionMessage(
      simpleMode
        ? "No mate selected. Press the number shown above a mate (1/2/3), then move close and press E."
        : "No mate selected. Choose one from mate cards or use 1/2/Q/R.",
      2.0
    );
    return;
  }

  const selectedDist = selectedMate.mesh.position.distanceTo(player.mesh.position);
  const selectedEligible = requirementMet(selectedMate.requirement);
  if (!selectedEligible) {
    setActionMessage(
      simpleMode
        ? `Mate is locked (${requirementText(selectedMate.requirement)}). Refresh with Mating Call.`
        : `M${selectedMate.slot} is locked (${requirementText(selectedMate.requirement)}).`,
      2.6
    );
    return;
  }

  if (selectedDist > BALANCE.player.reproductionInteractDistance) {
    setActionMessage(
      simpleMode
        ? `Move closer to mate: ${selectedDist.toFixed(1)}m / ${BALANCE.player.reproductionInteractDistance.toFixed(1)}m`
        : `Move closer to M${selectedMate.slot}: ${selectedDist.toFixed(1)}m / ${BALANCE.player.reproductionInteractDistance.toFixed(
            1
          )}m`,
      2.4
    );
    return;
  }

  const compatibility =
    selectedMate.compatibility ||
    evaluateMateCompatibility(player.traits, player.phenotypeDNA, selectedMate.traits, selectedMate.phenotypeDNA);
  nextGeneration(selectedMate);
  setActionMessage(
    `Reproduction success with M${selectedMate.slot} (${compatibility.tier} match). Offspring bias: ${mateGenePullSummary(selectedMate, 2)}.`,
    3.3
  );
}

function tryDeathReset() {
  if (player.health > 0) return;
  telemetry.deaths += 1;
  player.generation = Math.max(1, player.generation - 1);
  setWorldFromGeneration(player.generation);
  resetPlayerMorphology(
    player.generation * 911 + Math.floor(Math.random() * 8000) + 53
  );
  initPlayerLifecycle(BALANCE.player.deathResetEnergyRatio);
  clearGroup(populations.mates);
  clearGroup(populations.rivals);
  rebuildBiomeVisuals();
  saveSnapshot("death-reset");
}

function hudText() {
  const tone = toneProfile();
  const energy = player.energy.toFixed(1);
  const energyMax = maxEnergy().toFixed(0);
  const ready = canReproduce() ? "ready" : "not ready";
  const biome = biomeAt(player.pos);
  const biomeName = biomeLabel(biome);
  const lineageLen = player.lineage.length;
  const req = reproductionThresholds();
  const reproAction = reproductionActionState();
  const phaseOn = matingPhase.active && matingPhase.timer > 0;
  const phaseSeconds = Math.max(0, Math.ceil(matingPhase.timer));
  const comboText = funState.comboCount > 1 ? ` | Combo x${funState.comboCount}` : "";
  const fertilityPct = Math.round(req.fertility * 100);

  ui.lineage.textContent =
    `Generation ${player.generation} | Lineage entries ${lineageLen} | World tier ${WORLD.tier}`;
  const predatorMode = BALANCE.gameplay.predatorsEnabled ? "Predators on" : "Predators off";
  const matingState = phaseOn ? `Mating phase ${phaseSeconds}s` : "Mating phase off";
  ui.status.textContent =
    `Energy ${energy}/${energyMax} | Health ${player.health.toFixed(0)} | Age ${player.age.toFixed(
      0
    )} | Biome ${biomeName} | Fertility ${fertilityPct}% | Reproduction ${ready}${comboText} | ${matingState} | Tone ${tone.label} | ${predatorMode}`;
  if (ui.repro) {
    const ageState = req.readyAge ? "OK" : "WAIT";
    const energyState = req.readyEnergy ? "OK" : "WAIT";
    const healthState = req.readyHealth ? "OK" : "WAIT";
    const cooldownState = req.readyCooldown ? "OK" : "WAIT";
    ui.repro.textContent =
      `Repro readiness: age ${player.age.toFixed(0)}/${req.ageMin.toFixed(0)} ${ageState} | energy ${player.energy.toFixed(
        0
      )}/${req.energyMin.toFixed(0)} ${energyState} | health ${player.health.toFixed(
        0
      )}/${req.healthMin.toFixed(0)} ${healthState} | cooldown ${Math.max(
        0,
        player.reproductionCooldown
      ).toFixed(1)}s ${cooldownState}`;
  }

  if (ui.target) {
    const actionLine = `Repro action ${reproAction.step}: ${reproAction.text}`;
    ui.target.textContent =
      actionMessageTimer > 0 && actionMessage
        ? `${actionLine} | ${actionMessage}`
        : actionLine;
  }

  if (ui.objective) {
    ui.objective.textContent = objectiveSummaryText(funState.objective);
  }

  if (ui.mateInfo) {
    let mateInfoLine = "Mating unavailable: complete readiness requirements first.";
    if (phaseOn) {
      if (populations.mates.length === 0) {
        mateInfoLine = `Mating phase active (${phaseSeconds}s left). Press Mating Call to refresh candidates.`;
      } else {
        const selectedMate = ensureSelectedMate();
        const selectedText = selectedMate
          ? (() => {
              const match =
                selectedMate.compatibility ||
                evaluateMateCompatibility(
                  player.traits,
                  player.phenotypeDNA,
                  selectedMate.traits,
                  selectedMate.phenotypeDNA
                );
              return `M${selectedMate.slot} ${matePhenotypeDescriptor(
                selectedMate.phenotypeProfile,
                selectedMate.traits
              )} ${Math.round(match.score * 100)}% ${match.tier}`;
            })()
          : "none";
        mateInfoLine = `Mating phase active (${phaseSeconds}s) | Selected: ${selectedText} | Use keys above mates (1/2/3), then press E in range.`;
      }
    } else if (canReproduce()) {
      mateInfoLine = "Press Mating Call (button or E), then choose a mate by phenotype/genotype.";
    }
    ui.mateInfo.textContent = mateInfoLine;
  }

  updateMatingCallButton();
  renderMateCards();

  ui.traits.textContent =
    `Traits  speed ${player.traits.speed.toFixed(2)}  stamina ${player.traits.stamina.toFixed(
      2
    )}  herb ${player.traits.herbivore.toFixed(2)}  carn ${player.traits.carnivore.toFixed(
      2
    )}  swim ${player.traits.swim.toFixed(2)}  heat ${player.traits.heat.toFixed(
      2
    )}  body ${player.morphLabel}`;

  if (!ui.save) return;
  if (!storageSupported()) {
    ui.save.textContent = "Save unavailable in this browser context";
    return;
  }
  if (saveState.error) {
    ui.save.textContent = `Save status: ${saveState.error}`;
    return;
  }
  if (saveState.lastSavedAt > 0) {
    const secondsAgo = Math.max(0, Math.floor((Date.now() - saveState.lastSavedAt) / 1000));
    ui.save.textContent = `Save status: ${saveState.lastReason} (${secondsAgo}s ago)`;
    return;
  }
  ui.save.textContent = saveState.loadedFromDisk
    ? "Save status: loaded snapshot"
    : "Save status: fresh lineage";

  if (ui.telemetry) {
    if (!telemetry.enabled) {
      ui.telemetry.textContent = "Telemetry: hidden (press T)";
    } else {
      ui.telemetry.textContent =
        `Telemetry fps ${telemetry.fps.toFixed(0)} | pop f:${populations.flora.length} tr:${populations.trees.length} p:${populations.prey.length} aq:${populations.aquatic.length} av:${populations.avian.length} c:${populations.predators.length}` +
        ` | lineage +${telemetry.births} / -${telemetry.deaths} | tone ${tone.label} | biome ${biomeName}`;
    }
  }

  if (ui.hint) {
    ui.hint.textContent =
      "Move: WASD + Arrow steer (Up/Down throttle, Left/Right turn) | Sprint: Shift | Burst: Space | Focus: F | Map: G | Mating Call: button/E (150s window) | Select mate: press number shown above each mate (or click card) | Reproduce: press E when close | Flora/fauna vary: some species are inedible/toxic | Trees block movement | Aquatic prey: wetlands/coasts | Avian prey: skies/clearings | Tone: M | Predators: P | Telemetry: T | Save: K | Load: L | New: N | Debug: Tab | Pan: Shift+Drag";
  }
}

let debugShown = false;
function debugText() {
  if (!debugShown) return;
  const tone = toneProfile();
  const m = player.metrics;
  const matesInfo = populations.mates
    .map((mate, idx) => {
      const met = requirementMet(mate.requirement) ? "ok" : "locked";
      return `Mate ${idx + 1}: ${met} req=${mate.requirement.type}:${mate.requirement.min}`;
    })
    .join("\n");

  ui.debug.textContent = [
    `tone=${tone.id}(${tone.label})`,
    `flora=${populations.flora.length} trees=${populations.trees.length} prey=${populations.prey.length} aquatic=${populations.aquatic.length} avian=${populations.avian.length} predators=${populations.predators.length}`,
    `plants=${m.plants} prey=${m.prey} chase=${m.chaseSuccess}/${m.chaseAttempts}`,
    `combo=${funState.comboCount}x(${funState.comboMultiplier.toFixed(2)}) objectiveChain=${funState.objectiveChain}`,
    `objective=${funState.objective ? `${funState.objective.type}:${objectiveProgressLabel(funState.objective)}` : "none"}`,
    `threatEscapes=${m.threatEscapes}/${m.threatEvents}`,
    `body="${player.morphLabel}" morphDelta=${traitDistance(player.morphTraits, player.renderedMorphTraits).toFixed(3)}`,
    `heat=${m.heatExposure.toFixed(1)} water=${m.waterExposure.toFixed(1)} social=${m.socialExposure.toFixed(1)}`,
    matesInfo,
  ]
    .filter(Boolean)
    .join("\n");
}

let camYaw = 0.2;
let camPitch = 0.42;
let camDist = 18;
const camPan = new THREE.Vector3(0, 0, 0);
let drag = false;
let dragPan = false;
let lastMouseX = 0;
let lastMouseY = 0;

const panRight = new THREE.Vector3();
const panForward = new THREE.Vector3();

function clampCamPan() {
  const maxPan = WORLD.radius * 0.72;
  camPan.x = clamp(camPan.x, -maxPan, maxPan);
  camPan.z = clamp(camPan.z, -maxPan, maxPan);
}

function applyPanDelta(dx, dy, scale) {
  const panScale = (scale || 0.0026) * camDist;

  panRight.setFromMatrixColumn(camera.matrixWorld, 0);
  panRight.y = 0;
  if (panRight.lengthSq() < 0.0001) {
    panRight.set(1, 0, 0);
  } else {
    panRight.normalize();
  }

  panForward.copy(player.mesh.position).sub(camera.position);
  panForward.y = 0;
  if (panForward.lengthSq() < 0.0001) {
    panForward.set(-Math.sin(camYaw), 0, -Math.cos(camYaw));
  } else {
    panForward.normalize();
  }

  camPan.addScaledVector(panRight, -dx * panScale);
  camPan.addScaledVector(panForward, dy * panScale);
  clampCamPan();
}

renderer.domElement.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

renderer.domElement.addEventListener("mousedown", (e) => {
  if (e.button !== 0 && e.button !== 1 && e.button !== 2) return;
  drag = true;
  dragPan = e.shiftKey || e.button === 1 || e.button === 2;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

window.addEventListener("mouseup", () => {
  drag = false;
  dragPan = false;
});

window.addEventListener("mousemove", (e) => {
  if (!drag) return;
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  if (dragPan) {
    applyPanDelta(dx, dy, 0.0028);
  } else {
    camYaw -= dx * 0.0056;
    camPitch = clamp(camPitch - dy * 0.0048, 0.12, 1.16);
  }
});

renderer.domElement.addEventListener(
  "wheel",
  (e) => {
    if (e.cancelable) e.preventDefault();
    const zoomScale = e.ctrlKey ? 0.008 : 0.02;
    camDist = clamp(camDist + e.deltaY * zoomScale, 10, 34);
  },
  { passive: false }
);

let touchMode = "none";
let touchLastX = 0;
let touchLastY = 0;
let touchLastDist = 0;
let touchLastCenterX = 0;
let touchLastCenterY = 0;

function touchCenter(touches, count) {
  const use = Math.min(count, touches.length);
  let x = 0;
  let y = 0;
  for (let i = 0; i < use; i += 1) {
    x += touches[i].clientX;
    y += touches[i].clientY;
  }
  return { x: x / use, y: y / use };
}

function touchDistance(a, b) {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function resetTouchMode(touches) {
  if (!touches || touches.length === 0) {
    touchMode = "none";
    return;
  }
  if (touches.length === 1) {
    touchMode = "orbit";
    touchLastX = touches[0].clientX;
    touchLastY = touches[0].clientY;
    return;
  }
  if (touches.length === 2) {
    touchMode = "pinch";
    touchLastDist = touchDistance(touches[0], touches[1]);
    const center = touchCenter(touches, 2);
    touchLastCenterX = center.x;
    touchLastCenterY = center.y;
    return;
  }
  touchMode = "tri-pan";
  const center = touchCenter(touches, 3);
  touchLastCenterX = center.x;
  touchLastCenterY = center.y;
}

renderer.domElement.addEventListener(
  "touchstart",
  (e) => {
    if (e.cancelable) e.preventDefault();
    resetTouchMode(e.touches);
  },
  { passive: false }
);

renderer.domElement.addEventListener(
  "touchmove",
  (e) => {
    if (e.cancelable) e.preventDefault();
    if (touchMode === "orbit" && e.touches.length === 1) {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - touchLastX;
      const dy = y - touchLastY;
      touchLastX = x;
      touchLastY = y;
      camYaw -= dx * 0.006;
      camPitch = clamp(camPitch - dy * 0.0052, 0.12, 1.16);
      return;
    }

    if (touchMode === "pinch" && e.touches.length >= 2) {
      const nextDist = touchDistance(e.touches[0], e.touches[1]);
      const dDist = nextDist - touchLastDist;
      touchLastDist = nextDist;
      camDist = clamp(camDist - dDist * 0.028, 10, 34);

      const center = touchCenter(e.touches, 2);
      const dx = center.x - touchLastCenterX;
      const dy = center.y - touchLastCenterY;
      touchLastCenterX = center.x;
      touchLastCenterY = center.y;
      applyPanDelta(dx, dy, 0.0019);
      return;
    }

    if (touchMode === "tri-pan" && e.touches.length >= 3) {
      const center = touchCenter(e.touches, 3);
      const dx = center.x - touchLastCenterX;
      const dy = center.y - touchLastCenterY;
      touchLastCenterX = center.x;
      touchLastCenterY = center.y;

      // Three-finger gesture blends orbit and pan for broader camera control.
      camYaw -= dx * 0.0032;
      camPitch = clamp(camPitch - dy * 0.0024, 0.12, 1.16);
      applyPanDelta(dx * 0.45, dy * 0.45, 0.0022);
      return;
    }

    resetTouchMode(e.touches);
  },
  { passive: false }
);

renderer.domElement.addEventListener(
  "touchend",
  (e) => {
    resetTouchMode(e.touches);
  },
  { passive: false }
);

renderer.domElement.addEventListener(
  "touchcancel",
  () => {
    touchMode = "none";
  },
  { passive: false }
);

if (ui.matingCallBtn) {
  ui.matingCallBtn.addEventListener("click", (e) => {
    if (e.cancelable) e.preventDefault();
    triggerMatingCall();
  });
}

if (ui.mateCards) {
  ui.mateCards.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;
    const selectButton = target.closest("[data-mate-select]");
    if (!selectButton) return;
    const id = Number(selectButton.getAttribute("data-mate-select"));
    if (!Number.isFinite(id)) return;
    selectMateById(id, false);
    mateCardsRenderKey = "";
  });
}

window.addEventListener("keydown", (e) => {
  if (e.code.startsWith("Arrow") || e.code === "Space") {
    e.preventDefault();
  }
  KEY[e.code] = true;
  if (e.code === "Space" && !e.repeat) tryBurstMove();
  if (e.code === "KeyE") tryReproduce();
  if (e.code === "KeyF") focusPlayerCamera(false);
  if (e.code === "KeyG") {
    mapState.enabled = !mapState.enabled;
    setActionMessage(`Map ${mapState.enabled ? "shown" : "hidden"}.`, 1.6);
  }
  if (e.code === "Digit1") selectMateBySlot(1, false);
  if (e.code === "Digit2") selectMateBySlot(2, false);
  if (e.code === "Digit3") selectMateBySlot(3, false);
  if (e.code === "KeyQ") cycleMateSelection(-1);
  if (e.code === "KeyR") cycleMateSelection(1);
  if (e.code === "KeyM") cycleToneProfile();
  if (e.code === "KeyP") togglePredatorMode();
  if (e.code === "KeyT") {
    telemetry.enabled = !telemetry.enabled;
    setActionMessage(`Telemetry ${telemetry.enabled ? "enabled" : "hidden"}.`, 1.8);
  }
  if (e.code === "KeyK") saveSnapshot("manual-save");
  if (e.code === "KeyL") loadSnapshot();
  if (e.code === "KeyN") {
    newLineage(true);
    saveSnapshot("new-lineage");
  }
  if (e.code === "Tab") {
    e.preventDefault();
    debugShown = !debugShown;
    ui.debug.classList.toggle("hidden", !debugShown);
  }
});

window.addEventListener("keyup", (e) => {
  KEY[e.code] = false;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const camTarget = new THREE.Vector3();
const camPos = new THREE.Vector3();

function updateCamera(dt) {
  camTarget.copy(player.mesh.position).add(new THREE.Vector3(0, 2.5, 0)).add(camPan);
  const cx = Math.sin(camYaw) * Math.cos(camPitch) * camDist;
  const cy = Math.sin(camPitch) * camDist + 2.6;
  const cz = Math.cos(camYaw) * Math.cos(camPitch) * camDist;
  camPos.set(camTarget.x + cx, camTarget.y + cy, camTarget.z + cz);
  camera.position.lerp(camPos, 1 - Math.exp(-dt * 8));
  camera.lookAt(camTarget);
}

function drawMinimap() {
  if (!ui.minimap || !minimapCtx || !ui.mapPanel) return;
  if (!mapState.enabled) {
    ui.mapPanel.classList.add("hidden");
    return;
  }
  ui.mapPanel.classList.remove("hidden");

  const ctx = minimapCtx;
  const w = ui.minimap.width;
  const h = ui.minimap.height;
  const cx = w * 0.5;
  const cy = h * 0.5;
  const radius = Math.min(w, h) * 0.46;
  const range = Math.max(58, Math.min(mapState.range, WORLD.radius + 18));
  const scale = radius / range;

  const toMapX = (x) => cx + (x - player.pos.x) * scale;
  const toMapY = (z) => cy - (z - player.pos.z) * scale;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255, 244, 214, 0.9)";
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = "rgba(165, 201, 133, 0.92)";
  ctx.fillRect(0, 0, w, h);

  if (WORLD.tier >= BIOMES.volcanic.unlockTier) {
    ctx.fillStyle = "rgba(190, 117, 75, 0.44)";
    ctx.beginPath();
    ctx.arc(toMapX(VOLCANIC_CENTER.x), toMapY(VOLCANIC_CENTER.z), VOLCANIC_RADIUS * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  if (WORLD.tier >= BIOMES.wetland.unlockTier) {
    ctx.fillStyle = "rgba(121, 173, 112, 0.44)";
    ctx.beginPath();
    ctx.arc(toMapX(LAGOON_CENTER.x), toMapY(LAGOON_CENTER.z), LAGOON_RADIUS * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(245, 252, 228, 0.56)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(toMapX(0), toMapY(0), WORLD.radius * scale, 0, Math.PI * 2);
  ctx.stroke();

  const drawEntity = (x, z, r, color, alpha) => {
    const mx = toMapX(x);
    const my = toMapY(z);
    if (mx < -4 || my < -4 || mx > w + 4 || my > h + 4) return;
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  for (let i = 0; i < populations.flora.length; i += 3) {
    const f = populations.flora[i];
    if (!f || !f.alive) continue;
    const color = f.toxic ? "#cc6d4e" : f.edible === false ? "#a9955f" : "#4ca145";
    drawEntity(f.mesh.position.x, f.mesh.position.z, 1.4, color, 0.84);
  }

  for (let i = 0; i < populations.trees.length; i += 2) {
    const tree = populations.trees[i];
    if (!tree) continue;
    drawEntity(tree.mesh.position.x, tree.mesh.position.z, 1.9, "#2f7c38", 0.86);
  }

  for (const prey of populations.prey) {
    if (!prey.alive) continue;
    drawEntity(prey.mesh.position.x, prey.mesh.position.z, 1.8, prey.edible === false ? "#8f9ba4" : "#b7d86d", 0.92);
  }

  for (const aquatic of populations.aquatic) {
    if (!aquatic.alive) continue;
    drawEntity(
      aquatic.mesh.position.x,
      aquatic.mesh.position.z,
      1.7,
      aquatic.edible === false ? "#5a8da0" : "#78cbe6",
      0.9
    );
  }

  for (const avian of populations.avian) {
    if (!avian.alive) continue;
    drawEntity(
      avian.mesh.position.x,
      avian.mesh.position.z,
      1.6,
      avian.edible === false ? "#b8987d" : "#efcc7f",
      0.9
    );
  }

  for (const pred of populations.predators) {
    drawEntity(pred.mesh.position.x, pred.mesh.position.z, 2.15, "#ce6b54", 0.94);
  }

  const mateState = nearestMateState();
  const selectedMate = getSelectedMate();
  for (const mate of populations.mates) {
    if (mate.captured) continue;
    const eligible = requirementMet(mate.requirement);
    const isNearestEligible = mateState.nearestEligible && mateState.nearestEligible.id === mate.id;
    const isSelected = selectedMate && selectedMate.id === mate.id;
    const color = isNearestEligible
      ? "#f2ef90"
      : isSelected
        ? eligible
          ? "#ffe7ac"
          : "#dbc9a8"
        : eligible
          ? "#adeabd"
          : "#949f80";
    drawEntity(
      mate.mesh.position.x,
      mate.mesh.position.z,
      isSelected ? 3.35 : isNearestEligible ? 3.1 : 2.5,
      color,
      0.98
    );
  }

  for (const rival of populations.rivals) {
    drawEntity(rival.mesh.position.x, rival.mesh.position.z, 2.3, "#d88950", 0.95);
  }

  ctx.restore();

  ctx.strokeStyle = "rgba(248, 252, 236, 0.86)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Player always centered in this radar map.
  ctx.fillStyle = "#fffde6";
  ctx.beginPath();
  ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
  ctx.fill();

  const hx = player.forward.x;
  const hz = player.forward.z;
  const mag = Math.sqrt(hx * hx + hz * hz) || 1;
  const ux = hx / mag;
  const uz = hz / mag;
  const tipX = cx + ux * 9;
  const tipY = cy - uz * 9;
  ctx.strokeStyle = "rgba(255, 253, 224, 0.95)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  if (ui.mapLegend) {
    const mateLegend = isSimpleReproductionMode() ? "Mint=Mate" : "Mint/Gold=Mates";
    const rivalLegend = isSimpleReproductionMode() ? "" : " | Orange=Rivals";
    ui.mapLegend.textContent = `Map: G | Radius ${range.toFixed(
      0
    )}m | Ivory=You | Red/Amber=harmful flora | Gray=inedible fauna | Green=trees | Gold=selected mate | ${mateLegend}${rivalLegend}`;
  }
}

setWorldFromGeneration(player.generation);
syncPopulation();
rebuildBiomeVisuals();
if (!loadSnapshot()) {
  newLineage(false);
}
focusPlayerCamera(true);

let simTime = 0;
let autosaveTimer = 0;
const clock = new THREE.Clock();

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  simTime += dt;
  autosaveTimer += dt;
  telemetry.sampleFrames += 1;
  telemetry.sampleTime += dt;
  if (telemetry.sampleTime >= 0.5) {
    telemetry.fps = telemetry.sampleFrames / telemetry.sampleTime;
    telemetry.sampleFrames = 0;
    telemetry.sampleTime = 0;
  }
  if (actionMessageTimer > 0) {
    actionMessageTimer -= dt;
    if (actionMessageTimer <= 0) actionMessage = "";
  }

  updatePlayer(dt);
  updateFlora(dt);
  updateTrees(dt);
  updatePrey(dt);
  updateAquatic(dt);
  updateAvian(dt);
  updatePredators(dt);
  updateMatingPhase(dt);
  updateMatesAndRivals(dt);
  updateFunLoop(dt);
  updatePlayerMorphology(dt);
  tryDeathReset();
  syncPopulation();

  updateCamera(dt);
  hudText();
  debugText();
  drawMinimap();

  if (autosaveTimer >= BALANCE.save.autosaveSeconds) {
    autosaveTimer = 0;
    saveSnapshot("autosave");
  }

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

frame();
