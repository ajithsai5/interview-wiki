---
title: Graphs 02 · Grids
phase: 2
tags: [dsa, graphs, grid, bfs, dfs]
group: Graphs
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## A grid IS a graph
Each cell is a node; it connects to its 4 neighbors (up/down/left/right). The same
BFS/DFS applies — you just generate neighbors with offsets and bounds-check.
```python
DIRS = [(-1,0),(1,0),(0,-1),(0,1)]
for dr, dc in DIRS:
    nr, nc = r + dr, c + dc
    if 0 <= nr < rows and 0 <= nc < cols:   # ALWAYS bounds-check
        ...
```

## Number of Islands (DFS flood-fill)
Each unvisited land cell starts an island; sink its whole component so you don't
recount it.
```python
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    def sink(r, c):
        if 0 <= r < rows and 0 <= c < cols and grid[r][c] == "1":
            grid[r][c] = "0"                 # mark visited
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                sink(r+dr, c+dc)
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1; sink(r, c)
    return count
```

## Multi-source BFS — Rotting Oranges (time = levels)
Start BFS from **all** sources at once; each BFS level is one time step.
```python
from collections import deque
def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    q = deque(); fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2: q.append((r, c, 0))
            elif grid[r][c] == 1: fresh += 1
    minutes = 0
    while q:
        r, c, t = q.popleft()
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2; fresh -= 1
                minutes = t + 1
                q.append((nr, nc, t + 1))
    return minutes if fresh == 0 else -1
```

## Multi-source from borders — Pacific Atlantic
Instead of asking "can this cell reach the ocean?", flood **inward from each ocean's
border** and intersect the two reachable sets. Reframing the start saves huge work.

## Complexity
**O(rows · cols)** — each cell visited a constant number of times.

## Canonical problems
| Problem | Pattern |
|---|---|
| Number of Islands / Max Area of Island | grid DFS/BFS |
| Rotting Oranges | multi-source BFS |
| Walls and Gates | multi-source BFS from gates |
| Pacific Atlantic Water Flow | DFS from borders, intersect |
| Surrounded Regions | DFS from border, mark safe |
| Word Search | grid backtracking ([[backtracking-03-advanced]]) |

## Gotchas
- **Bounds-check before indexing** every neighbor.
- Mark visited (sink the cell, or a `visited` set) to avoid infinite loops/recount.
- "Distance/time in a grid" → **BFS** (levels), not DFS.

## Next
- [[graphs-03-topo-union]] — topological sort + union-find
