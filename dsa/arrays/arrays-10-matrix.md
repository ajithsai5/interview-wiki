---
title: Arrays 10 · Matrix (2D Arrays)
phase: 2
tags: [dsa, arrays, matrix, grid]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The core idea
A matrix is an **array of arrays**. Address a cell by `(row, col)` → `grid[r][c]`.
Dimensions: `rows = len(grid)`, `cols = len(grid[0])`.

```
            c=0  c=1  c=2
          +----+----+----+
   r=0    |  1 |  2 |  3 |
          +----+----+----+
   r=1    |  4 |  5 |  6 |     grid[1][2] = 6
          +----+----+----+
   r=2    |  7 |  8 |  9 |
          +----+----+----+
```

## Traversal directions
```python
rows, cols = len(grid), len(grid[0])

for r in range(rows):              # row-major (most common)
    for c in range(cols):
        visit(grid[r][c])

for c in range(cols):              # column-major
    for r in range(rows):
        visit(grid[r][c])
```
**Diagonals:** main diagonal cells share `r == c`; anti-diagonal cells share
`r + c == cols - 1`. Cells on the *same* diagonal share a constant `r - c`.

## The 4-neighbor trick (used in grid BFS/DFS)
```python
DIRS = [(-1,0),(1,0),(0,-1),(0,1)]      # up, down, left, right
for dr, dc in DIRS:
    nr, nc = r + dr, c + dc
    if 0 <= nr < rows and 0 <= nc < cols:   # bounds check!
        visit(grid[nr][nc])
```

## Worked example — Spiral Matrix
Keep four shrinking borders (top, bottom, left, right). Walk right → down → left
→ up, peeling a layer each loop.
```
 +--->---+
 |  1 2 3|        order: 1 2 3 | 6 9 | 8 7 | 4 | 5
 |  4 5 6|
 |  7 8 9|
```
```python
def spiral_order(grid):
    res = []
    top, bottom = 0, len(grid) - 1
    left, right = 0, len(grid[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1): res.append(grid[top][c])
        top += 1
        for r in range(top, bottom + 1): res.append(grid[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1): res.append(grid[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1): res.append(grid[r][left])
            left += 1
    return res
```

## Worked example — Rotate Image 90° (in place)
**Transpose** (swap across the main diagonal), then **reverse each row**.
```
 1 2 3      transpose     1 4 7    reverse rows    7 4 1
 4 5 6   ------------->   2 5 8   ------------->    8 5 2
 7 8 9                    3 6 9                      9 6 3
```
```python
def rotate(grid):
    n = len(grid)
    for r in range(n):                      # transpose
        for c in range(r + 1, n):
            grid[r][c], grid[c][r] = grid[c][r], grid[r][c]
    for row in grid:                        # reverse each row
        row.reverse()
```

## Worked example — Number of Islands (grid DFS)
Each unvisited '1' starts an island; flood-fill its connected land so you don't
recount it.
```python
def num_islands(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    def sink(r, c):
        if 0 <= r < rows and 0 <= c < cols and grid[r][c] == '1':
            grid[r][c] = '0'                  # mark visited
            sink(r+1,c); sink(r-1,c); sink(r,c+1); sink(r,c-1)
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                sink(r, c)
    return count
```

## Practice
| Problem | Idea |
|---|---|
| Spiral Matrix | four shrinking borders |
| Rotate Image | transpose + reverse rows |
| Set Matrix Zeroes | use first row/col as markers (O(1) space) |
| Word Search | DFS + backtracking from each cell |
| Number of Islands | flood-fill DFS/BFS |

## Pitfalls
- **Always bounds-check** `0 <= nr < rows and 0 <= nc < cols` before indexing.
- `[[0]*c]*r` makes **shared** rows (aliasing bug!). Use `[[0]*c for _ in range(r)]`.
- Don't forget to **mark visited**, or grid DFS recurses forever.

## Related
- Grid DFS/BFS connect to graphs (seeded [[graphs]]) · backtracking in [[arrays-12-advanced]]
- Next: [[arrays-11-greedy]]
