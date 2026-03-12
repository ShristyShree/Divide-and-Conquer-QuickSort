/**
 * quickSort.js
 * Quick Sort implementation with full step-by-step trace for visualization.
 * Uses last element as pivot (Lomuto scheme).
 */

"use strict";

/* ─── STEP TYPES ─────────────────────────────────────────────── */
const STEP = {
  SET_PIVOT:       'SET_PIVOT',
  COMPARE:         'COMPARE',
  SWAP:            'SWAP',
  PLACE_PIVOT:     'PLACE_PIVOT',
  MARK_SORTED:     'MARK_SORTED',
  RECURSE_LEFT:    'RECURSE_LEFT',
  RECURSE_RIGHT:   'RECURSE_RIGHT',
  BASE_CASE:       'BASE_CASE',
  COMBINE:         'COMBINE',
  DONE:            'DONE',
};

/* ─── PHASE TAGS ─────────────────────────────────────────────── */
const PHASE = {
  DIVIDE:  'Divide',
  CONQUER: 'Conquer',
  COMBINE: 'Combine',
};

/* ─── QUICK SORT STEP GENERATOR ──────────────────────────────── */
function generateQuickSortSteps(arr) {
  const array      = arr.slice();
  const steps      = [];
  const treeNodes  = [];
  let   comparisons = 0;
  let   swaps       = 0;
  let   nodeId      = 0;

  const sortedIndices = new Set();

  function push(type, phase, msg, extra = {}) {
    steps.push({
      type, phase, msg,
      array: array.slice(),
      sortedIndices: new Set(sortedIndices),
      comparisons, swaps,
      depth: extra.depth ?? 0,
      ...extra,
    });
  }

  function partition(low, high, depth, parentId) {
    const pivotVal  = array[high];
    const myId      = nodeId++;
    const treeRange = `[${low}..${high}]`;

    treeNodes.push({ id: myId, parentId, low, high, depth, label: treeRange });

    push(STEP.SET_PIVOT, PHASE.DIVIDE,
      `🔵 DIVIDE: Select pivot = ${pivotVal} at index ${high}  (range ${treeRange}, depth ${depth})`,
      { pivot: high, low, high, depth, treeNodeId: myId });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      push(STEP.COMPARE, PHASE.DIVIDE,
        `🔵 DIVIDE: Compare arr[${j}]=${array[j]} with pivot=${pivotVal}`,
        { pivot: high, compare: [j, high], low, high, depth, treeNodeId: myId, comparisons });

      if (array[j] <= pivotVal) {
        i++;
        if (i !== j) {
          swaps++;
          [array[i], array[j]] = [array[j], array[i]];
          push(STEP.SWAP, PHASE.DIVIDE,
            `🔵 DIVIDE: Swap arr[${i}]=${array[i]} ↔ arr[${j}]=${array[j]}  (arr[${j}] ≤ pivot)`,
            { pivot: high, swap: [i, j], low, high, depth, treeNodeId: myId, swaps });
        }
      }
    }

    i++;
    if (i !== high) {
      swaps++;
      [array[i], array[high]] = [array[high], array[i]];
      push(STEP.PLACE_PIVOT, PHASE.DIVIDE,
        `🔵 DIVIDE: Place pivot ${pivotVal} at final position ${i}`,
        { pivot: i, swap: [i, high], low, high, depth, treeNodeId: myId, swaps });
    } else {
      push(STEP.PLACE_PIVOT, PHASE.DIVIDE,
        `🔵 DIVIDE: Pivot ${pivotVal} already at correct position ${i}`,
        { pivot: i, low, high, depth, treeNodeId: myId });
    }

    sortedIndices.add(i);
    push(STEP.MARK_SORTED, PHASE.COMBINE,
      `🟢 COMBINE: Index ${i} is now in its final sorted position`,
      { pivot: i, low, high, depth, treeNodeId: myId });

    return { pivotIdx: i, myId };
  }

  function quickSort(low, high, depth, parentId) {
    if (low >= high) {
      if (low === high) {
        sortedIndices.add(low);
        push(STEP.BASE_CASE, PHASE.CONQUER,
          `🟠 CONQUER: Base case — single element at index ${low} is trivially sorted`,
          { low, high, depth, treeNodeId: parentId });
      }
      return;
    }

    const { pivotIdx, myId } = partition(low, high, depth, parentId);

    if (pivotIdx - 1 >= low) {
      push(STEP.RECURSE_LEFT, PHASE.CONQUER,
        `🟠 CONQUER: Recurse LEFT on [${low}..${pivotIdx - 1}]  (depth ${depth + 1})`,
        { low, high: pivotIdx - 1, depth: depth + 1, treeNodeId: myId });
      quickSort(low, pivotIdx - 1, depth + 1, myId);
    } else if (low <= pivotIdx - 1) {
      sortedIndices.add(low);
    }

    if (pivotIdx + 1 <= high) {
      push(STEP.RECURSE_RIGHT, PHASE.CONQUER,
        `🟠 CONQUER: Recurse RIGHT on [${pivotIdx + 1}..${high}]  (depth ${depth + 1})`,
        { low: pivotIdx + 1, high, depth: depth + 1, treeNodeId: myId });
      quickSort(pivotIdx + 1, high, depth + 1, myId);
    }

    push(STEP.COMBINE, PHASE.COMBINE,
      `🟢 COMBINE: Subarray [${low}..${high}] is now fully sorted`,
      { low, high, depth, treeNodeId: myId });
  }

  if (array.length <= 1) {
    sortedIndices.add(0);
    push(STEP.DONE, PHASE.COMBINE, '✅ Array already sorted!', { depth: 0 });
  } else {
    quickSort(0, array.length - 1, 0, null);
    push(STEP.DONE, PHASE.COMBINE, '✅ Quick Sort complete — array fully sorted!', { depth: 0 });
  }

  return { steps, treeNodes };
}

/* ─── BAR RENDERING ──────────────────────────────────────────── */
function renderBars(canvas, step, originalMax) {
  const ctx = canvas.getContext('2d');
  const W   = canvas.width;
  const H   = canvas.height;
  const arr = step.array;
  const n   = arr.length;

  const pad    = 32;
  const topPad = 8;   // FIX: was 24 — reduced to eliminate large dead space above bars
  const botPad = 28;
  const bot    = H - botPad;
  const maxH   = H - botPad - topPad;

  const usableW = W - pad * 2;
  const barW    = Math.max(4, Math.floor(usableW / n) - 2);
  const gap     = Math.floor((usableW - barW * n) / (n + 1));

  ctx.clearRect(0, 0, W, H);

  // background grid lines
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  for (let g = 0; g <= 4; g++) {
    const y = topPad + (maxH / 4) * g;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(W - pad, y);
    ctx.stroke();
  }

  const { pivot, compare = [], swap = [], sortedIndices, low, high } = step;

  arr.forEach((val, i) => {
    const barH = Math.max(6, Math.round((val / originalMax) * maxH));
    const x    = pad + gap + i * (barW + gap);
    const y    = bot - barH;

    let fillColor   = '#CBD5E1';
    let strokeColor = 'transparent';

    if (sortedIndices && sortedIndices.has(i)) {
      fillColor   = '#16A34A';
      strokeColor = '#15803D';
    }
    if (low !== undefined && high !== undefined && i >= low && i <= high) {
      if (!sortedIndices?.has(i)) {
        fillColor = '#93C5FD';
      }
    }
    if (compare.includes(i) && i !== pivot) {
      fillColor   = '#7C3AED';
      strokeColor = '#5B21B6';
    }
    if (swap.includes(i) && i !== pivot) {
      fillColor   = '#D97706';
      strokeColor = '#B45309';
    }
    if (i === pivot) {
      fillColor   = '#DC2626';
      strokeColor = '#991B1B';
    }

    if (barH > 30) {
      ctx.shadowColor   = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur    = 4;
      ctx.shadowOffsetY = 2;
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle   = fillColor;
    const r = Math.min(4, barW / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
    ctx.lineTo(x + barW, bot);
    ctx.lineTo(x, bot);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor   = 'transparent';
    ctx.shadowBlur    = 0;
    ctx.shadowOffsetY = 0;

    if (strokeColor !== 'transparent') {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    if (barW >= 16) {
      ctx.fillStyle    = '#475569';
      ctx.font         = `bold ${Math.min(10, barW - 2)}px "JetBrains Mono", monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'bottom';
      ctx.globalAlpha  = 0.85;
      ctx.fillText(val, x + barW / 2, bot - 2);
    }

    if (i === pivot) {
      ctx.fillStyle    = '#DC2626';
      ctx.font         = `bold 9px "Sora", sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'top';
      ctx.globalAlpha  = 1;
      ctx.fillText('P', x + barW / 2, bot + 4);
    }

    ctx.globalAlpha = 1;
  });
}

/* ─── RECURSION TREE RENDERING ───────────────────────────────── */
function renderTree(canvas, treeNodes, activeId) {
  const ctx = canvas.getContext('2d');
  const W   = canvas.width;
  const H   = canvas.height;
  ctx.clearRect(0, 0, W, H);

  if (!treeNodes || treeNodes.length === 0) return;

  const byDepth = {};
  let   maxDepth = 0;
  treeNodes.forEach(n => {
    byDepth[n.depth] = byDepth[n.depth] || [];
    byDepth[n.depth].push(n);
    if (n.depth > maxDepth) maxDepth = n.depth;
  });

  const levelH    = Math.min(52, (H - 20) / (maxDepth + 1));
  const nodeW     = 60;
  const nodeH     = 22;
  const positions = {};

  Object.keys(byDepth).forEach(d => {
    const nodes   = byDepth[d];
    const count   = nodes.length;
    const spacing = Math.max(nodeW + 8, (W - 40) / count);
    const startX  = (W - spacing * (count - 1)) / 2;
    nodes.forEach((n, i) => {
      positions[n.id] = {
        x: startX + i * spacing,
        y: 14 + parseInt(d) * levelH + nodeH / 2,
      };
    });
  });

  // edges
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth   = 1.5;
  treeNodes.forEach(n => {
    if (n.parentId !== null && n.parentId !== undefined && positions[n.parentId]) {
      const p = positions[n.parentId];
      const c = positions[n.id];
      if (!p || !c) return;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + nodeH / 2);
      ctx.lineTo(c.x, c.y - nodeH / 2);
      ctx.stroke();
    }
  });

  // nodes
  treeNodes.forEach(n => {
    const pos      = positions[n.id];
    if (!pos) return;
    const x        = pos.x - nodeW / 2;
    const y        = pos.y - nodeH / 2;
    const isActive = n.id === activeId;
    const isDone   = n.id < activeId;

    const r = 6;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + nodeW - r, y);
    ctx.quadraticCurveTo(x + nodeW, y, x + nodeW, y + r);
    ctx.lineTo(x + nodeW, y + nodeH - r);
    ctx.quadraticCurveTo(x + nodeW, y + nodeH, x + nodeW - r, y + nodeH);
    ctx.lineTo(x + r, y + nodeH);
    ctx.quadraticCurveTo(x, y + nodeH, x, y + nodeH - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    if (isActive) {
      ctx.fillStyle   = '#EA580C';
      ctx.shadowColor = 'rgba(234,88,12,.35)';
      ctx.shadowBlur  = 8;
    } else if (isDone) {
      ctx.fillStyle = '#DCFCE7';
    } else {
      ctx.fillStyle = '#DBEAFE';
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = isActive ? '#C2410C' : (isDone ? '#86EFAC' : '#93C5FD');
    ctx.lineWidth   = isActive ? 2 : 1;
    ctx.stroke();

    ctx.fillStyle    = isActive ? '#FFFFFF' : (isDone ? '#15803D' : '#1D4ED8');
    ctx.font         = `${isActive ? 'bold ' : ''}10px "JetBrains Mono", monospace`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.label, pos.x, pos.y);
  });
}