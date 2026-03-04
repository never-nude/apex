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
    preyBase: 12,
    preyPerTier: 7,
    predatorBase: 5,
    predatorPerTier: 3,
  },
  player: {
    maxEnergyBase: 70,
    maxEnergyFromStamina: 70,
    moveSpeedBase: 4.2,
    moveSpeedFromTrait: 9.2,
    steerTurnRate: 2.7,
    steerReverseScale: 0.72,
    reproductionAgeMin: 52,
    reproductionEnergyRatio: 0.72,
    reproductionHealthMin: 35,
    reproductionInteractDistance: 3.4,
    reproductionCooldownAfterFail: 18,
    reproductionCooldownAfterBirth: 12,
    offspringStartEnergyRatio: 0.64,
    deathResetEnergyRatio: 0.55,
    energyDrainBase: 0.58,
    energyDrainMoveScale: 0.75,
    scorchDrainScale: 0.95,
    wetlandDrainScale: 0.74,
    lowEnergyRatio: 0.22,
    lowEnergyDamageBase: 0.65,
    lowEnergyDamageHazardScale: 0.28,
    passiveHealthRegen: 0.55,
    predatorContactDamage: 18,
    predatorKnockback: 4.8,
  },
  feeding: {
    floraGainBase: 0.42,
    preyGainBase: 0.5,
    floraRespawnMin: 12,
    floraRespawnMax: 20,
    floraTierRespawnScale: 0.05,
    preyRespawnMin: 9,
    preyRespawnMax: 16,
    preyTierRespawnScale: 0.04,
    preyEnergyMin: 10,
    preyEnergyMax: 16,
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
const telemetry = {
  enabled: true,
  fps: 0,
  sampleFrames: 0,
  sampleTime: 0,
  births: 0,
  deaths: 0,
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

function makePhenotypeProfile(opts) {
  const next = seeded(opts.seed || 1);
  const t = opts.traits || DEFAULT_TRAITS;
  const role = opts.role || "neutral";
  const tone = toneProfile();
  const cute = tone.cuteVisual;

  const bodyScale = new THREE.Vector3(
    clamp(jitter(1 + t.speed * 0.55 + t.carnivore * 0.35, 0.18, next), 0.7, 1.9),
    clamp(jitter(0.85 + t.stamina * 0.7, 0.14, next), 0.65, 1.7),
    clamp(jitter(0.9 + t.herbivore * 0.4 + t.swim * 0.35, 0.14, next), 0.65, 1.8)
  );
  const avgScale = (bodyScale.x + bodyScale.y + bodyScale.z) / 3;
  bodyScale.lerp(
    new THREE.Vector3(avgScale * 1.03, avgScale * 0.96, avgScale * 1.02),
    cute * 0.28
  );

  let appendageType = "spike";
  if (t.swim > 0.56) appendageType = "fin";
  if (t.herbivore > t.carnivore + 0.2) appendageType = "leg";
  if (role === "predator") appendageType = "spike";
  if (role === "prey" && t.swim < 0.55) appendageType = "leg";
  if (cute > 0.93 && appendageType === "spike" && role !== "predator") appendageType = "leg";

  const baseAppendageCount = clamp(
    Math.round(2 + t.speed * 2 + t.carnivore * 3 + t.social * 2 + next() * 3),
    2,
    9
  );
  const appendageCount = clamp(
    Math.round(baseAppendageCount * (1 - cute * 0.1) + cute * 0.8),
    2,
    9
  );

  const dorsalCount = clamp(
    Math.round((t.carnivore * 3 + t.heat * 2 + next() * 2) * (1 - cute * 0.15)),
    0,
    5
  );
  const tailLength = clamp(0.3 + t.speed * 0.7 + t.swim * 0.5 + next() * 0.25, 0.2, 1.65);
  const eyeScale = clamp(0.08 + t.social * 0.07 + next() * 0.06 + cute * 0.04, 0.06, 0.24);
  const eyeSpacing = clamp(0.12 + t.social * 0.1 + next() * 0.05, 0.12, 0.3);
  const bodyRadius = 0.72 + cute * 0.07;
  const appendageLength = clamp(
    (0.28 + t.speed * 0.45 + t.carnivore * 0.35 + next() * 0.24) * (1 - cute * 0.14),
    0.18,
    1.18
  );
  const snoutLength = clamp(0.18 + t.carnivore * 0.42 + t.herbivore * 0.18 + next() * 0.1, 0.16, 0.7);
  const crestHeight = clamp((0.12 + t.carnivore * 0.28 + t.heat * 0.18) * (1 - cute * 0.12), 0.05, 0.46);
  const earSize = clamp(0.1 + t.social * 0.2 + cute * 0.1 + next() * 0.06, 0.08, 0.44);
  const stripeCount = clamp(Math.round(1 + t.carnivore * 2 + t.heat * 1.5 + next() * 1.5), 1, 4);
  const headScale = new THREE.Vector3(
    clamp(bodyScale.x * (0.54 + t.social * 0.11 + cute * 0.06), 0.48, 1.15),
    clamp(bodyScale.y * (0.48 + t.stamina * 0.1 + cute * 0.05), 0.45, 1.1),
    clamp(bodyScale.z * (0.5 + t.carnivore * 0.16 + t.herbivore * 0.12), 0.45, 1.2)
  );

  return {
    seed: opts.seed || 1,
    role,
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
  };
}

function applyPhenotype(mesh, baseColor, profile) {
  removePhenotype(mesh);
  mesh.material.transparent = true;
  mesh.material.opacity = 0.14;

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

  const tintLayers = [
    { material: bodyMat, h: 0, s: 0, l: 0 },
    { material: accentMat, h: 0.04, s: 0.06, l: 0.1 },
    { material: underMat, h: 0, s: -0.08, l: 0.2 },
    { material: markMat, h: -0.03, s: 0.1, l: -0.12 },
    { material: ornamentMat, h: 0.02, s: 0.04, l: -0.08 },
  ];
  const tintMaterials = [bodyMat, accentMat, underMat, markMat, ornamentMat];
  const rig = new THREE.Group();
  const appendages = [];
  const dorsal = [];
  const ornaments = [];
  const markings = [];

  const body = new THREE.Mesh(new THREE.SphereGeometry(profile.bodyRadius, 16, 16), bodyMat);
  body.scale.copy(profile.bodyScale);
  rig.add(body);

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

  for (let i = 0; i < profile.stripeCount; i += 1) {
    const patch = new THREE.Mesh(new THREE.SphereGeometry(profile.bodyRadius * 0.26, 9, 9), markMat);
    patch.scale.set(profile.bodyScale.x * 0.68, profile.bodyScale.y * 0.22, profile.bodyScale.z * 0.18);
    patch.position.set(
      0,
      profile.bodyScale.y * (0.08 + i * 0.08),
      -profile.bodyScale.z * 0.3 + i * profile.bodyScale.z * 0.22
    );
    markings.push(patch);
    rig.add(patch);
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

  for (const side of [-1, 1]) {
    let ornament;
    if (profile.appendageType === "fin") {
      ornament = new THREE.Mesh(
        new THREE.BoxGeometry(profile.earSize * 0.22, profile.earSize * 0.05, profile.earSize * 0.48),
        ornamentMat
      );
      ornament.position.set(side * profile.headScale.x * 0.52, head.position.y + profile.headScale.y * 0.12, head.position.z);
      ornament.rotation.z = side * Math.PI * 0.2;
      ornament.rotation.x = Math.PI * 0.12;
    } else {
      ornament = new THREE.Mesh(
        new THREE.ConeGeometry(profile.earSize * 0.16, profile.earSize, 8),
        ornamentMat
      );
      ornament.position.set(
        side * profile.headScale.x * 0.44,
        head.position.y + profile.headScale.y * 0.33,
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
    const y = profile.appendageType === "leg" ? -profile.bodyScale.y * 0.55 : 0;
    let limb;
    if (profile.appendageType === "fin") {
      limb = new THREE.Mesh(
        new THREE.BoxGeometry(profile.appendageLength * 0.2, profile.appendageLength * 0.07, profile.appendageLength),
        accentMat
      );
      limb.position.copy(dir.clone().multiplyScalar(profile.bodyScale.x * 0.65));
      limb.position.y = y;
      limb.lookAt(limb.position.clone().add(dir));
    } else if (profile.appendageType === "leg") {
      limb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.08, profile.appendageLength, 7),
        accentMat
      );
      limb.position.copy(dir.clone().multiplyScalar(profile.bodyScale.x * 0.58));
      limb.position.y = y - profile.appendageLength * 0.35;
      limb.rotation.z = Math.sin(ang) * 0.25;
    } else {
      limb = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, profile.appendageLength, 8),
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

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.09 + profile.tailLength * 0.02, profile.tailLength, 9), accentMat);
  tail.position.set(0, 0, -profile.bodyScale.z * 0.95);
  tail.rotation.x = Math.PI / 2;
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
    head,
    snout: { mesh: snout, rest: snout.rotation.clone() },
    mouth: { mesh: mouth, rest: mouth.rotation.clone() },
    tail: { mesh: tail, rest: tail.rotation.clone() },
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
  }

  for (const limb of rig.appendages) {
    if (profile.appendageType === "leg") {
      limb.mesh.rotation.x =
        limb.rest.x + Math.sin(phase + limb.phase) * (0.22 + speed * (0.72 + cuteMotion * 0.07));
      limb.mesh.rotation.z = limb.rest.z + Math.cos(phase * 0.6 + limb.phase) * 0.12;
      continue;
    }
    if (profile.appendageType === "fin") {
      limb.mesh.rotation.z =
        limb.rest.z + Math.sin(phase * 0.8 + limb.phase) * (0.14 + speed * (0.28 + cuteMotion * 0.06));
      limb.mesh.rotation.y = limb.rest.y + Math.cos(phase * 0.7 + limb.phase) * 0.12;
      continue;
    }
    limb.mesh.rotation.x = limb.rest.x + Math.sin(phase * 0.45 + limb.phase) * (0.04 + speed * 0.08);
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
  traits: { ...DEFAULT_TRAITS },
  morphTraits: { ...DEFAULT_TRAITS },
  renderedMorphTraits: { ...DEFAULT_TRAITS },
  morphSeed: 911,
  morphLabel: "balanced legged grazer",
  morphRefreshTimer: 0,
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

function createLabelSprite(text, fg, bg) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, 128, 64);
  ctx.fillStyle = bg || "rgba(8, 26, 22, 0.78)";
  ctx.strokeStyle = "rgba(199, 236, 222, 0.75)";
  ctx.lineWidth = 3;
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(4, 6, 120, 52, 14);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(4, 6, 120, 52);
    ctx.strokeRect(4, 6, 120, 52);
  }

  ctx.fillStyle = fg || "#eafff3";
  ctx.font = "700 30px 'Avenir Next', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, 33);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.55, 0.78, 1);
  return sprite;
}

function createMateMarker(mesh, label) {
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

  mesh.add(group);
  return { group, ring, beam, tip, tag, ringMaterial, beamMaterial, tipMaterial };
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
  return `${frame} ${locomotion} ${diet}`;
}

function refreshPlayerPhenotype(force) {
  const source = player.morphTraits || player.traits;
  if (!force && traitDistance(source, player.renderedMorphTraits) < BALANCE.phenotype.refreshThreshold) {
    return false;
  }
  const profile = makePhenotypeProfile({
    seed: player.morphSeed,
    role: "player",
    traits: source,
  });
  applyPhenotype(player.mesh, 0xe7f4c6, profile);
  ensurePlayerMarker();
  setPhenotypeTint(player.mesh, 0xeeffd8);
  player.mesh.material.opacity = 0.44;
  player.mesh.material.emissive.setHex(0x174f3f);
  player.mesh.material.emissiveIntensity = 0.56;
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
  player.morphSeed = seed;
  player.morphTraits = cloneTraits(player.traits);
  player.renderedMorphTraits = cloneTraits(player.traits);
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
  player.metrics = resetMetrics();
  player.mesh.position.copy(player.pos);
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
    player: {
      generation: player.generation,
      age: Number(player.age.toFixed(3)),
      energy: Number(player.energy.toFixed(3)),
      health: Number(player.health.toFixed(3)),
      reproductionCooldown: Number(player.reproductionCooldown.toFixed(3)),
      traits: { ...player.traits },
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

  const state = parsed.player;
  player.generation = clamp(Math.floor(Number(state.generation) || 1), 1, 9999);
  player.traits = sanitizeTraits(state.traits);
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
  player.reproductionCooldown = clamp(Number(state.reproductionCooldown) || 0, 0, 9999);
  player.pos.set(Number(state.pos && state.pos.x) || 0, 0, Number(state.pos && state.pos.z) || 0);
  limitToWorld(player.pos);
  placeAtSurface(player.pos, PLAYER_HEIGHT_OFFSET);
  player.vel.set(0, 0, 0);
  player.forward.set(0, 0, 1);
  player.energy = clamp(Number(state.energy) || maxEnergy() * BALANCE.player.offspringStartEnergyRatio, 0, maxEnergy());
  player.metrics = resetMetrics();
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
  player.generation = 1;
  player.traits = { ...DEFAULT_TRAITS };
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
  prey: [],
  predators: [],
  mates: [],
  rivals: [],
};

let idCounter = 1;
function nextId() {
  const id = idCounter;
  idCounter += 1;
  return id;
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
  node.energy = rand(profile.energyMin, profile.energyMax);
  node.respawnMult = profile.respawnMult;
  node.mesh.material.color.setHex(profile.color);
}

function spawnFlora() {
  const mesh = makeSphere(0x63b16f, rand(0.56, 0.9), 8);
  const p = randVec(WORLD.radius - 6);
  placeAtSurface(p, 0.52);
  mesh.position.copy(p);
  scene.add(mesh);
  populations.flora.push({
    id: nextId(),
    mesh,
    alive: true,
    respawn: 0,
    energy: 10,
    respawnMult: 1.0,
  });
  applyFloraBiome(populations.flora[populations.flora.length - 1]);
}

function spawnPrey() {
  const id = nextId();
  const mesh = makeSphere(0xc5db78, rand(0.64, 0.95), 10);
  const p = randVec(WORLD.radius - 7);
  placeAtSurface(p, 0.68);
  mesh.position.copy(p);
  applyPhenotype(
    mesh,
    0xc5db78,
    makePhenotypeProfile({
      seed: id * 33 + 7,
      role: "prey",
      traits: {
        speed: rand(0.25, 0.9),
        stamina: rand(0.2, 0.8),
        herbivore: rand(0.55, 0.98),
        carnivore: rand(0.05, 0.35),
        swim: rand(0.05, 0.55),
        heat: rand(0.1, 0.65),
        social: rand(0.2, 0.9),
      },
    })
  );
  scene.add(mesh);
  populations.prey.push({
    id,
    mesh,
    vel: new THREE.Vector3(),
    wander: randVec(1),
    alive: true,
    respawn: 0,
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
  applyPhenotype(
    mesh,
    0xce735e,
    makePhenotypeProfile({
      seed: id * 61 + 13,
      role: "predator",
      traits: {
        speed: rand(0.45, 0.95),
        stamina: rand(0.3, 0.95),
        herbivore: rand(0.0, 0.2),
        carnivore: rand(0.65, 1.0),
        swim: rand(0.0, 0.45),
        heat: rand(0.2, 0.9),
        social: rand(0.0, 0.5),
      },
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

function clearGroup(group) {
  for (const e of group) {
    scene.remove(e.mesh);
    disposeMeshTree(e.mesh);
  }
  group.length = 0;
  if (group === populations.mates && mateLockVisual) {
    selectedMateId = null;
    mateLockVisual.group.visible = false;
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

  const root = player.pos.clone();
  const angle = rand(0, Math.PI * 2);
  const dist = simpleMode ? rand(2.8, 4.2) : rand(8, 18);
  root.x += Math.cos(angle) * dist;
  root.z += Math.sin(angle) * dist;
  limitToWorld(root);
  const mateCount = simpleMode ? 1 : 2;
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

    populations.mates.push({
      id,
      slot: i + 1,
      mesh,
      mods,
      pulse: rand(0, Math.PI * 2),
      requirement,
      captured: false,
      heightOffset: 1.2,
      marker: createMateMarker(mesh, `M${i + 1}`),
    });
    applyPhenotype(
      mesh,
      0x9cd8ff,
      makePhenotypeProfile({
        seed: id * 19 + i,
        role: "mate",
        traits: {
          speed: clamp(0.45 + mods.speed, 0, 1),
          stamina: clamp(0.45 + mods.stamina, 0, 1),
          herbivore: clamp(0.45 + mods.herbivore, 0, 1),
          carnivore: clamp(0.45 + mods.carnivore, 0, 1),
          swim: clamp(0.35 + mods.swim, 0, 1),
          heat: clamp(0.35 + mods.heat, 0, 1),
          social: clamp(0.6 + mods.social, 0, 1),
        },
      })
    );
  }

  if (!simpleMode) {
    for (let i = 0; i < populations.mates.length; i += 1) {
      const id = nextId();
      const mesh = makeSphere(0xf2b876, 1.0, 10);
      const p = root.clone().add(randVec(14));
      placeAtSurface(p, 1.0);
      mesh.position.copy(p);
      applyPhenotype(
        mesh,
        0xf2b876,
        makePhenotypeProfile({
          seed: id * 17 + i,
          role: "rival",
          traits: {
            speed: rand(0.35, 0.85),
            stamina: rand(0.25, 0.7),
            herbivore: rand(0.2, 0.6),
            carnivore: rand(0.2, 0.8),
            swim: rand(0.0, 0.5),
            heat: rand(0.2, 0.8),
            social: rand(0.3, 0.75),
          },
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
    prey: BALANCE.populations.preyBase + WORLD.tier * BALANCE.populations.preyPerTier,
    predators: BALANCE.gameplay.predatorsEnabled
      ? BALANCE.populations.predatorBase + WORLD.tier * BALANCE.populations.predatorPerTier
      : 0,
  };
}

function syncPopulation() {
  const target = desiredPopulation();
  trimGroupToTarget(populations.flora, target.flora);
  trimGroupToTarget(populations.prey, target.prey);
  trimGroupToTarget(populations.predators, target.predators);
  while (populations.flora.length < target.flora) spawnFlora();
  while (populations.prey.length < target.prey) spawnPrey();
  while (populations.predators.length < target.predators) spawnPredator();
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

function canReproduce() {
  const req = reproductionThresholds();
  return req.readyAge && req.readyEnergy && req.readyHealth && req.readyCooldown;
}

function isSimpleReproductionMode() {
  return !!BALANCE.gameplay.simpleReproduction;
}

function reproductionThresholds() {
  const tone = toneProfile();
  const ageMin = BALANCE.player.reproductionAgeMin * tone.reproductionAgeMult;
  const energyMin =
    maxEnergy() * BALANCE.player.reproductionEnergyRatio * tone.reproductionEnergyMult;
  const healthMin = clamp(
    BALANCE.player.reproductionHealthMin + tone.reproductionHealthAdd,
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
  const missing = [];
  if (!req.readyAge) missing.push(`age ${player.age.toFixed(0)}/${req.ageMin.toFixed(0)}`);
  if (!req.readyEnergy) missing.push(`energy ${player.energy.toFixed(0)}/${req.energyMin.toFixed(0)}`);
  if (!req.readyHealth) missing.push(`health ${player.health.toFixed(0)}/${req.healthMin.toFixed(0)}`);
  if (!req.readyCooldown) missing.push(`cooldown ${Math.max(0, player.reproductionCooldown).toFixed(1)}s`);
  if (missing.length > 0) {
    return {
      step: "0/3",
      text: `Build readiness: ${missing.join(" | ")}`,
    };
  }

  if (populations.mates.length === 0) {
    return {
      step: simpleMode ? "1/2" : "1/3",
      text: simpleMode ? "Press E once to call a mate." : "Press E once to signal mates.",
    };
  }

  const selectedMate = ensureSelectedMate();
  if (!selectedMate) {
    return {
      step: simpleMode ? "1/2" : "1/3",
      text: simpleMode ? "No mate available. Press E again to call one nearby." : "No mate selected. Use 1/2 or Q/R.",
    };
  }

  const dist = selectedMate.mesh.position.distanceTo(player.mesh.position);
  const eligible = requirementMet(selectedMate.requirement);
  if (!eligible) {
    return {
      step: simpleMode ? "2/2" : "2/3",
      text: simpleMode
        ? `Mate locked (${requirementText(selectedMate.requirement)}). Press E to call another.`
        : `M${selectedMate.slot} locked (${requirementText(selectedMate.requirement)}). Choose another mate or satisfy requirement.`,
    };
  }

  if (dist > BALANCE.player.reproductionInteractDistance) {
    return {
      step: simpleMode ? "2/2" : "2/3",
      text: simpleMode
        ? `Mate nearby. Move closer (${dist.toFixed(1)}m / ${BALANCE.player.reproductionInteractDistance.toFixed(1)}m).`
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

function selectMateBySlot(slot, silent) {
  for (const mate of populations.mates) {
    if (!mate.captured && mate.slot === slot) {
      selectedMateId = mate.id;
      if (!silent) setActionMessage(`Mate M${slot} selected.`, 1.4);
      return true;
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
  selectedMateId = ordered[idx].id;
  setActionMessage(`Mate M${ordered[idx].slot} selected.`, 1.4);
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
  if (!canReproduce() || !state) {
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
  node.respawn =
    rand(BALANCE.feeding.floraRespawnMin, BALANCE.feeding.floraRespawnMax) /
    (1 + WORLD.tier * BALANCE.feeding.floraTierRespawnScale);
  node.respawn *= node.respawnMult || 1;
  node.mesh.visible = false;
  const gain = node.energy * (BALANCE.feeding.floraGainBase + player.traits.herbivore);
  player.energy = clamp(player.energy + gain, 0, maxEnergy());
  player.metrics.plants += 1;
}

function consumePrey(prey) {
  prey.alive = false;
  prey.respawn =
    rand(BALANCE.feeding.preyRespawnMin, BALANCE.feeding.preyRespawnMax) /
    (1 + WORLD.tier * BALANCE.feeding.preyTierRespawnScale);
  prey.mesh.visible = false;
  const gain =
    rand(BALANCE.feeding.preyEnergyMin, BALANCE.feeding.preyEnergyMax) *
    (BALANCE.feeding.preyGainBase + player.traits.carnivore);
  player.energy = clamp(player.energy + gain, 0, maxEnergy());
  player.metrics.prey += 1;
  const stamp = ACTIVE_CHASE.get(prey.id);
  if (stamp !== undefined && stamp > simTime - BALANCE.feeding.chaseSuccessWindow) {
    player.metrics.chaseSuccess += 1;
  }
  ACTIVE_CHASE.delete(prey.id);
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
        respawnEntity(node, WORLD.radius * 0.1, WORLD.radius - 6, 0.52);
        applyFloraBiome(node);
      }
      continue;
    }
    const dist = node.mesh.position.distanceTo(player.mesh.position);
    if (dist < 2.15) consumeFlora(node);
  }
}

function updatePrey(dt) {
  for (const prey of populations.prey) {
    if (!prey.alive) {
      prey.respawn -= dt;
      if (prey.respawn <= 0) {
        prey.alive = true;
        prey.wander = randVec(1);
        respawnEntity(prey, WORLD.radius * 0.14, WORLD.radius - 8, prey.heightOffset);
      }
      continue;
    }

    const pos = prey.mesh.position;
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
    if (catchDist < 1.78 && player.vel.length() > prey.speed * 0.32) {
      consumePrey(prey);
    }

    orientMeshToVelocity(prey.mesh, prey.vel, dt, 9);
    animatePhenotype(prey.mesh, prey.vel.length() / Math.max(0.01, prey.speed), simTime, dt);
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
  if (!canReproduce()) {
    clearGroup(populations.mates);
    clearGroup(populations.rivals);
    updateMateLockVisual(null, null);
    return;
  }

  if (populations.mates.length === 0) {
    spawnMateCluster();
  }

  const selectedMate = ensureSelectedMate();
  const state = nearestMateState();

  for (const mate of populations.mates) {
    if (mate.captured) continue;
    mate.pulse += dt * 2.4;
    const eligible = requirementMet(mate.requirement);
    const isNearestEligible = !!state.nearestEligible && state.nearestEligible.id === mate.id;
    const isNearestAny = !!state.nearestAny && state.nearestAny.id === mate.id;
    const isSelected = !!selectedMate && selectedMate.id === mate.id;

    mate.mesh.scale.setScalar(1 + Math.sin(mate.pulse) * (isSelected ? 0.13 : isNearestAny ? 0.11 : 0.07));
    let tint = eligible ? 0x9cd8ff : 0x5f6f80;
    if (isSelected) tint = eligible ? 0xc4ecff : 0x8993a1;
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
            ? 0xb6e8ff
            : 0x95dcff
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
    clearGroup(populations.rivals);
    player.reproductionCooldown = BALANCE.player.reproductionCooldownAfterFail;
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

  const moveSpd = movementSpeed();
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

  player.energy = clamp(player.energy - energyDrain, 0, maxEnergy());

  if (player.energy < maxEnergy() * BALANCE.player.lowEnergyRatio) {
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

function evolveTraits(mateMods) {
  const tone = toneProfile();
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

  const target = {
    speed: clamp(0.2 + chaseRate * 0.5 + evadeRate * 0.18, 0, 1),
    stamina: clamp(0.2 + activeRatio * 0.62, 0, 1),
    herbivore: clamp(plantRatio, 0, 1),
    carnivore: clamp(preyRatio, 0, 1),
    swim: clamp(waterRatio, 0, 1),
    heat: clamp(heatRatio, 0, 1),
    social: clamp(socialRatio, 0, 1),
  };

  const next = {};
  const targetWeight = clamp(
    BALANCE.evolution.targetWeight * tone.targetWeightScale,
    0.18,
    0.45
  );
  for (const key of TRAIT_KEYS) {
    const mutation =
      rand(BALANCE.evolution.mutationMin, BALANCE.evolution.mutationMax) *
      tone.mutationScale;
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

function nextGeneration(mate) {
  telemetry.births += 1;
  const entry = {
    generation: player.generation,
    age: Number(player.age.toFixed(1)),
    food: { plants: player.metrics.plants, prey: player.metrics.prey },
    traits: { ...player.traits },
  };
  player.lineage.push(entry);

  player.traits = evolveTraits(mate.mods);
  player.generation += 1;
  resetPlayerMorphology(
    player.generation * 911 + Math.floor(Math.random() * 9000) + 29
  );
  setWorldFromGeneration(player.generation);
  rebuildBiomeVisuals();

  initPlayerLifecycle(BALANCE.player.offspringStartEnergyRatio);
  player.reproductionCooldown = BALANCE.player.reproductionCooldownAfterBirth;

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
    spawnMateCluster();
    setActionMessage(
      simpleMode
        ? "Mate called nearby. Move close to M1, then press E again."
        : "Mates signaled nearby. Select one (1/2 or Q/R), move close, then press E.",
      3.2
    );
    return;
  }

  const selectedMate = ensureSelectedMate();
  if (!selectedMate) {
    setActionMessage(
      simpleMode ? "No mate found. Press E to call one again." : "No mate selected. Use 1/2 or Q/R.",
      2.0
    );
    return;
  }

  const selectedDist = selectedMate.mesh.position.distanceTo(player.mesh.position);
  const selectedEligible = requirementMet(selectedMate.requirement);
  if (!selectedEligible) {
    setActionMessage(
      simpleMode
        ? `Mate is locked (${requirementText(selectedMate.requirement)}). Press E to call another.`
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

  nextGeneration(selectedMate);
  setActionMessage("Reproduction success: next generation begins.", 3.1);
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

  ui.lineage.textContent =
    `Generation ${player.generation} | Lineage entries ${lineageLen} | World tier ${WORLD.tier}`;
  const predatorMode = BALANCE.gameplay.predatorsEnabled ? "Predators on" : "Predators off";
  ui.status.textContent =
    `Energy ${energy}/${energyMax} | Health ${player.health.toFixed(0)} | Age ${player.age.toFixed(
      0
    )} | Biome ${biomeName} | Reproduction ${ready} | Tone ${tone.label} | ${predatorMode}`;
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

  if (ui.mateInfo) {
    const simpleMode = isSimpleReproductionMode();
    let mateInfoLine = "Mate cards: unavailable (become reproduction-ready first).";
    if (canReproduce()) {
      if (populations.mates.length === 0) {
        mateInfoLine = simpleMode
          ? "Mate card: none active. Press E to call a nearby mate."
          : "Mate cards: waiting for signal. Press E to spawn mates.";
      } else {
        ensureSelectedMate();
        const cards = populations.mates
          .filter((mate) => !mate.captured)
          .sort((a, b) => a.slot - b.slot)
          .map((mate) => {
            const selected = mate.id === selectedMateId ? "*" : "";
            const reqState = requirementMet(mate.requirement) ? "ok" : "lock";
            return `${selected}M${mate.slot} ${mateModSummary(mate)} ${requirementShort(mate.requirement)} ${reqState}`;
          })
          .join(" | ");
        mateInfoLine = simpleMode
          ? `Mate card: ${cards} | Auto-select active`
          : `Mate cards: ${cards} | Select 1/2 or Q/R`;
      }
    }
    ui.mateInfo.textContent = mateInfoLine;
  }

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
        `Telemetry fps ${telemetry.fps.toFixed(0)} | pop f:${populations.flora.length} p:${populations.prey.length} c:${populations.predators.length}` +
        ` | lineage +${telemetry.births} / -${telemetry.deaths} | tone ${tone.label} | biome ${biomeName}`;
    }
  }

  if (ui.hint) {
    const simpleMode = isSimpleReproductionMode();
    const reproHint = simpleMode
      ? "Reproduce: E (ready -> E to call mate -> move close -> E again)"
      : "Reproduce: E (follow Repro action line)";
    const mateHint = simpleMode ? "" : " | Mate select: 1/2 or Q/R";
    const markerHint = simpleMode
      ? " | Mate marker: M1 mint glow"
      : " | Mate markers: M1/M2 mint-gold | Rival markers: R1/R2 orange";
    ui.hint.textContent =
      `Move: WASD + Arrow steer (Up/Down throttle, Left/Right turn) | Focus: F | Map: G | ${reproHint}${mateHint} | Tone: M | Predators: P | Telemetry: T | Save: K | Load: L | New: N | Debug: Tab | Pan: Shift+Drag${markerHint}`;
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
    `flora=${populations.flora.length} prey=${populations.prey.length} predators=${populations.predators.length}`,
    `plants=${m.plants} prey=${m.prey} chase=${m.chaseSuccess}/${m.chaseAttempts}`,
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

window.addEventListener("keydown", (e) => {
  if (e.code.startsWith("Arrow")) {
    e.preventDefault();
  }
  KEY[e.code] = true;
  if (e.code === "KeyE") tryReproduce();
  if (e.code === "KeyF") focusPlayerCamera(false);
  if (e.code === "KeyG") {
    mapState.enabled = !mapState.enabled;
    setActionMessage(`Map ${mapState.enabled ? "shown" : "hidden"}.`, 1.6);
  }
  if (!isSimpleReproductionMode()) {
    if (e.code === "Digit1") selectMateBySlot(1, false);
    if (e.code === "Digit2") selectMateBySlot(2, false);
    if (e.code === "KeyQ") cycleMateSelection(-1);
    if (e.code === "KeyR") cycleMateSelection(1);
  }
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
    drawEntity(f.mesh.position.x, f.mesh.position.z, 1.4, "#4ca145", 0.78);
  }

  for (const prey of populations.prey) {
    if (!prey.alive) continue;
    drawEntity(prey.mesh.position.x, prey.mesh.position.z, 1.8, "#b7d86d", 0.92);
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
    ui.mapLegend.textContent = `Map: G | Radius ${range.toFixed(0)}m | Ivory=You | Gold=selected mate | ${mateLegend}${rivalLegend}`;
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
  updatePrey(dt);
  updatePredators(dt);
  updateMatesAndRivals(dt);
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
