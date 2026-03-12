#  Quick Sort Visualizer — Divide & Conquer

An interactive, step-by-step educational visualization of the Quick Sort algorithm, built with pure HTML, CSS, and Vanilla JavaScript using HTML5 Canvas.

---

##  Algorithm Overview

**Quick Sort** is a highly efficient comparison-based sorting algorithm that employs the **Divide & Conquer** paradigm.

### How It Works

1. **Divide** — Select a *pivot* element (last element, Lomuto scheme) and partition the array so all elements ≤ pivot go left, all > pivot go right.
2. **Conquer** — Recursively apply Quick Sort to the left and right sub-arrays.
3. **Combine** — No extra work needed; the array is sorted in place.

### Partition 

```
QUICKSORT(A, low, high):
  if low < high:
    p = PARTITION(A, low, high)
    QUICKSORT(A, low, p - 1)
    QUICKSORT(A, p + 1, high)

PARTITION(A, low, high):
  pivot = A[high]
  i = low - 1
  for j = low to high - 1:
    if A[j] <= pivot:
      i++
      swap A[i] and A[j]
  swap A[i+1] and A[high]
  return i + 1
```

---

## Recurrence Relation

```
T(n) = T(k) + T(n–k–1) + Θ(n)
```

| Symbol    | Meaning                            |
|-----------|------------------------------------|
| `k`       | Number of elements left of pivot   |
| `n–k–1`   | Number of elements right of pivot  |
| `Θ(n)`    | Cost of partitioning               |

---

##  Time Complexity

| Case         | Complexity    | When                              |
|--------------|---------------|-----------------------------------|
|  Best      | `O(n log n)`  | Pivot always splits array evenly  |
|  Average   | `O(n log n)`  | Random/typical inputs             |
|  Worst     | `O(n²)`       | Already sorted, pivot always min/max |

##  Space Complexity

`O(log n)` — due to recursive call stack depth

---

##  Features

- **Step-by-step bar visualization** with color-coded phases
- **Live Recursion Tree** showing active recursive calls
- **Runtime Statistics**: comparisons, swaps, recursion depth, step count
- **Play / Pause / Step Forward / Step Back** controls
- **Variable speed control** (12ms → 1800ms per step)
- **Configurable array size** (5–40 elements)
- **Random array generator**
- **Keyboard shortcuts** (Space, ←, →, R)
- **Responsive light-theme UI** with Sora + JetBrains Mono fonts

### Color Legend

| Color  | Meaning                  |
|--------|--------------------------|
|  Blue   | Active range / DIVIDE phase |
|  Red    | Pivot element               |
|  Purple | Elements being compared     |
|  Amber  | Elements being swapped      |
|  Green  | Confirmed sorted position   |

---

##  Project Structure

```
quicksort-visualizer/
├── index.html      Main page: layout and HTML structure
├── style.css       Light-theme modern CSS
├── quickSort.js    Algorithm + step generation + canvas renderers
├── script.js       Visualization engine, playback, UI controls
└── README.md       This file
```

---

##  How to Run

**No build step required.** Open directly in any modern browser:

```bash
# Option 1: open directly
open index.html

# Option 2: simple local server (Python)
python3 -m http.server 8080
# then visit http://localhost:8080

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

---

##  How the Visualization Demonstrates Divide & Conquer

| Phase       | Color  | What you see                                                |
|-------------|--------|-------------------------------------------------------------|
| **Divide**  | Blue   | Pivot (red bar) selected; comparisons scan the active range |
| **Conquer** | Orange | Recursion tree node highlighted; sub-arrays processed       |
| **Combine** | Green  | Pivot placed in final position; sorted bars turn green      |

The **Recursion Tree** below the main canvas shows every sub-problem as a node. The currently active node is highlighted in orange, making it visually clear how the algorithm breaks the problem down and builds back up.

---

