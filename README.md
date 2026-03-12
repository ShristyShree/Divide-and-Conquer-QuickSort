

---

# Quick Sort Visualization — Divide & Conquer Algorithm

An interactive web-based visualization tool that demonstrates how the **Quick Sort algorithm** works using the **Divide and Conquer paradigm**.

This project helps students observe the internal behavior of Quick Sort, including **pivot selection, partitioning, recursive calls, and recursion depth**, through an animated step-by-step interface.

The visualizer was developed to support learning in **Design and Analysis of Algorithms (DAA)** courses.

---

# Project Objective

Sorting algorithms are often difficult to understand because most of the work happens through **recursion and partitioning**, which are not directly visible.

This project aims to make Quick Sort easier to understand by showing:

* how the array is partitioned around a pivot
* how recursive subproblems are created
* how recursion depth evolves
* how the final sorted order emerges

The visualization highlights each step so students can clearly follow the algorithm's execution.

---

# Quick Sort Algorithm

Quick Sort is a **comparison-based sorting algorithm** that follows the **Divide and Conquer strategy**.

The algorithm works in three major stages:

### 1. Divide

Select a **pivot element** and partition the array such that:

* elements smaller than the pivot appear before it
* elements larger than the pivot appear after it

### 2. Conquer

Recursively apply Quick Sort to the **left and right subarrays**.

### 3. Combine

Since each partition becomes sorted independently, no additional work is needed to combine the results.

---

# Pseudocode

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
            i = i + 1
            swap A[i], A[j]

    swap A[i+1], A[high]
    return i + 1
```

---

# Recurrence Relation

The time complexity of Quick Sort can be expressed using the recurrence relation:

```
T(n) = T(k) + T(n − k − 1) + Θ(n)
```

Where:

| Symbol    | Meaning                                   |
| --------- | ----------------------------------------- |
| k         | number of elements smaller than the pivot |
| n − k − 1 | number of elements greater than the pivot |
| Θ(n)      | cost of partitioning the array            |

---

# Time Complexity Analysis

| Case         | Complexity | Explanation                                     |
| ------------ | ---------- | ----------------------------------------------- |
| Best Case    | O(n log n) | Pivot divides array evenly                      |
| Average Case | O(n log n) | Typical random inputs                           |
| Worst Case   | O(n²)      | Pivot repeatedly produces unbalanced partitions |

---

# Space Complexity

```
O(log n)
```

This space is required for the **recursive call stack** during execution.

---

# Key Features

### Interactive Visualization

The array elements are represented as vertical bars whose heights correspond to their values.

During execution:

* comparisons are highlighted
* swaps are animated
* the pivot element is emphasized

---

### Recursion Tree Visualization

A recursion tree is displayed below the main visualization.

This tree shows:

* each recursive call as a node
* the currently active subproblem
* recursion depth progression

This helps students understand **how the problem is divided into smaller subproblems**.

---

### Runtime Statistics

The visualizer tracks and displays live algorithm statistics:

* number of comparisons
* number of swaps
* recursion depth
* step counter
* total steps executed

---

### Step-by-Step Execution

Users can control how the algorithm runs:

* Play / Pause animation
* Step Forward
* Step Backward
* Reset the visualization

---

### Adjustable Parameters

Users can experiment with the algorithm by changing:

* **array size** (5–40 elements)
* **visualization speed**
* **random input generation**

This allows exploration of how Quick Sort behaves under different inputs.

---

# Color Legend

| Color  | Meaning                           |
| ------ | --------------------------------- |
| Blue   | Active range being processed      |
| Red    | Pivot element                     |
| Purple | Elements currently being compared |
| Orange | Swap operation                    |
| Green  | Final sorted position             |

---

# Project Structure

```
quick-sort-visualizer
│
├── index.html
├── style.css
├── script.js
├── quickSort.js
└── README.md
```

### File Description

**index.html**
Defines the layout of the application, including panels for visualization, controls, and algorithm information.

**style.css**
Contains the visual design, layout system, and responsive styling.

**script.js**
Implements the visualization engine, playback controls, UI interaction, and recursion tree rendering.

**quickSort.js**
Contains the Quick Sort algorithm implementation and generates step-by-step visualization states.

---

# How to Run the Project

No installation is required.

Simply open the main HTML file in any modern browser.

```
Open index.html
```

Or run a local server:

```
python -m http.server
```

Then open:

```
http://localhost:8000
```

---

# Educational Value

This visualization helps students:

* understand the **Divide & Conquer paradigm**
* observe how **recursive algorithms operate**
* analyze algorithm complexity
* visualize partitioning and pivot placement

It provides a practical demonstration of how theoretical algorithm concepts translate into real execution.

---

# Possible Extensions

Future improvements could include:

* visualizing additional Divide & Conquer algorithms
* comparing Quick Sort with Merge Sort
* showing different pivot selection strategies
* interactive recursion tree exploration

---

