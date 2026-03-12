/**
 * script.js
 * Visualization engine, playback controls, statistics, and UI interaction.
 */

"use strict";

/* ─── DOM REFERENCES ─────────────────────────────────────────── */
const mainCanvas    = document.getElementById('mainCanvas');
const treeCanvas    = document.getElementById('treeCanvas');
const stepMsg       = document.getElementById('stepMessage');
const progressFill  = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');

const statComparisons = document.getElementById('stat-comparisons');
const statSwaps       = document.getElementById('stat-swaps');
const statDepth       = document.getElementById('stat-depth');
const statStep        = document.getElementById('stat-step');
const statTotal       = document.getElementById('stat-total');
const statPhase       = document.getElementById('stat-phase');

const btnPlay      = document.getElementById('btnPlay');
const btnReset     = document.getElementById('btnReset');
const btnStepFwd   = document.getElementById('btnStepFwd');
const btnStepBack  = document.getElementById('btnStepBack');
const btnRandomize = document.getElementById('btnRandomize');

const speedSlider  = document.getElementById('speedSlider');
const sizeSlider   = document.getElementById('sizeSlider');
const speedValue   = document.getElementById('speedValue');
const sizeValue    = document.getElementById('sizeValue');

const iconPlay  = document.getElementById('iconPlay');
const iconPause = document.getElementById('iconPause');

/* ─── STATE ──────────────────────────────────────────────────── */
let steps       = [];
let treeNodes   = [];
let currentIdx  = 0;
let isPlaying   = false;
let timer       = null;
let arraySize   = 16;
let currentArr  = [];
let originalMax = 1;

const SPEED_MAP = {
  1: 1800, 2: 1200, 3: 800, 4: 550, 5: 350,
  6: 220,  7: 130,  8: 70,  9: 35,  10: 12,
};

/* ─── CANVAS SIZING ──────────────────────────────────────────── */
function resizeCanvases() {
  const mainRect = mainCanvas.parentElement.getBoundingClientRect();
  const treeRect = treeCanvas.parentElement.getBoundingClientRect();

  mainCanvas.width  = Math.floor(mainRect.width);
  // Increased ratio 0.32 → 0.38 so bars have more vertical room
  mainCanvas.height = Math.max(240, Math.floor(mainRect.width * 0.38));

  // Tree height scales with recursion depth; cap kept the same
  const maxDepth        = treeNodes.reduce((m, n) => Math.max(m, n.depth), 0);
  const treeH           = Math.max(120, Math.min(240, (maxDepth + 1) * 48 + 24));
  treeCanvas.width      = Math.floor(treeRect.width);
  treeCanvas.height     = treeH;
  treeCanvas.style.height = treeH + 'px';
}

/* ─── ARRAY GENERATION ───────────────────────────────────────── */
function generateArray(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 90) + 10);
  }
  return arr;
}

/* ─── INITIALIZE / RESET ─────────────────────────────────────── */
function init(arr) {
  stopPlayback();
  currentArr  = arr.slice();
  originalMax = Math.max(...arr);

  const result = generateQuickSortSteps(arr);
  steps     = result.steps;
  treeNodes = result.treeNodes;
  currentIdx = 0;

  statTotal.textContent = steps.length;
  sizeValue.textContent = `${arr.length} elements`;

  resizeCanvases();
  renderStep(0);
}

function randomizeAndInit() {
  const arr = generateArray(arraySize);
  init(arr);
}

/* ─── RENDER A STEP ──────────────────────────────────────────── */
function renderStep(idx) {
  if (!steps.length) return;
  idx = Math.max(0, Math.min(idx, steps.length - 1));
  currentIdx = idx;

  const step = steps[idx];

  renderBars(mainCanvas, step, originalMax);
  renderTree(treeCanvas, treeNodes, step.treeNodeId);

  // Step message — coloured by phase
  stepMsg.textContent = step.msg || '';
  stepMsg.className   = 'step-message';
  if (step.phase === PHASE.DIVIDE)  stepMsg.classList.add('phase-divide-msg');
  if (step.phase === PHASE.CONQUER) stepMsg.classList.add('phase-conquer-msg');
  if (step.phase === PHASE.COMBINE) stepMsg.classList.add('phase-combine-msg');

  // Progress bar
  const pct = steps.length > 1 ? (idx / (steps.length - 1)) * 100 : 100;
  progressFill.style.width  = pct + '%';
  progressLabel.textContent = `${idx + 1} / ${steps.length}`;

  // Statistics
  updateStat(statComparisons, step.comparisons ?? 0);
  updateStat(statSwaps,       step.swaps       ?? 0);
  updateStat(statDepth,       step.depth       ?? 0);
  updateStat(statStep,        idx + 1);

  // Phase label colour
  const phaseColors = {
    [PHASE.DIVIDE]:  '#2563EB',
    [PHASE.CONQUER]: '#EA580C',
    [PHASE.COMBINE]: '#16A34A',
  };
  statPhase.textContent = step.phase || '—';
  statPhase.style.color = phaseColors[step.phase] || '#475569';
}

/* ─── STAT HELPER ────────────────────────────────────────────── */
let lastStatValues = {};
function updateStat(el, val) {
  const key = el.id;
  if (lastStatValues[key] !== val) {
    el.textContent = val;
    el.classList.remove('bump');
    void el.offsetWidth; // force reflow so animation restarts
    el.classList.add('bump');
    lastStatValues[key] = val;
  }
}

/* ─── PLAYBACK ───────────────────────────────────────────────── */
function startPlayback() {
  if (currentIdx >= steps.length - 1) currentIdx = 0;
  isPlaying = true;
  iconPlay.style.display  = 'none';
  iconPause.style.display = '';
  tick();
}

function stopPlayback() {
  isPlaying = false;
  clearTimeout(timer);
  iconPlay.style.display  = '';
  iconPause.style.display = 'none';
}

function tick() {
  if (!isPlaying) return;
  renderStep(currentIdx);
  if (currentIdx >= steps.length - 1) {
    stopPlayback();
    return;
  }
  currentIdx++;
  const delay = SPEED_MAP[parseInt(speedSlider.value)] || 350;
  timer = setTimeout(tick, delay);
}

function togglePlay() {
  if (isPlaying) stopPlayback();
  else           startPlayback();
}

/* ─── CONTROLS ───────────────────────────────────────────────── */
btnPlay.addEventListener('click', togglePlay);

btnReset.addEventListener('click', () => {
  stopPlayback();
  init(currentArr);
});

btnStepFwd.addEventListener('click', () => {
  stopPlayback();
  renderStep(currentIdx + 1);
});

btnStepBack.addEventListener('click', () => {
  stopPlayback();
  renderStep(currentIdx - 1);
});

btnRandomize.addEventListener('click', randomizeAndInit);

/* ─── SLIDERS ────────────────────────────────────────────────── */
speedSlider.addEventListener('input', () => {
  const ms = SPEED_MAP[parseInt(speedSlider.value)];
  speedValue.textContent = ms >= 1000 ? (ms / 1000).toFixed(1) + 's' : ms + 'ms';
});

sizeSlider.addEventListener('input', () => {
  arraySize = parseInt(sizeSlider.value);
  sizeValue.textContent = `${arraySize} elements`;
  randomizeAndInit();
});

/* ─── KEYBOARD ───────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  switch (e.key) {
    case ' ':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      e.preventDefault();
      stopPlayback();
      renderStep(currentIdx + 1);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      stopPlayback();
      renderStep(currentIdx - 1);
      break;
    case 'r': case 'R':
      stopPlayback();
      init(currentArr);
      break;
  }
});

/* ─── RESIZE ─────────────────────────────────────────────────── */
let resizeDebounce;
window.addEventListener('resize', () => {
  clearTimeout(resizeDebounce);
  resizeDebounce = setTimeout(() => {
    resizeCanvases();
    if (steps.length) renderStep(currentIdx);
  }, 120);
});

/* ─── INITIAL SPEED LABEL ────────────────────────────────────── */
(function () {
  const ms = SPEED_MAP[parseInt(speedSlider.value)];
  speedValue.textContent = ms + 'ms';
})();

/* ─── BOOT ───────────────────────────────────────────────────── */
randomizeAndInit();