---
title: Backtracking 03 · Advanced
phase: 2
tags: [dsa, backtracking, grid]
group: Backtracking
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## Grid backtracking — Word Search
DFS from each cell; **mark visited before recursing, restore after**. The restore is
what makes it backtracking (the cell is free for other paths).
```python
def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]:
            return False
        board[r][c] = "#"                      # mark visited
        found = (dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or
                 dfs(r,c+1,i+1) or dfs(r,c-1,i+1))
        board[r][c] = word[i]                  # restore (backtrack)
        return found
    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))
```
The `board[r][c] = "#"` then restore is the in-place "visited" set — cheaper than a
separate set, and the restore lets a different starting cell reuse the square.

## Constraint placement — N-Queens
Place one queen per row; track attacked columns and both diagonals with sets for O(1)
checks. `r - c` identifies one diagonal, `r + c` the other.
```python
def solve_n_queens(n):
    res = []
    cols, diag, anti = set(), set(), set()
    board = []
    def bt(r):
        if r == n:
            res.append(["".join(row) for row in board]); return
        for c in range(n):
            if c in cols or (r-c) in diag or (r+c) in anti:
                continue                       # attacked -> prune
            cols.add(c); diag.add(r-c); anti.add(r+c)
            board.append("." * c + "Q" + "." * (n-c-1))
            bt(r + 1)
            board.pop()
            cols.remove(c); diag.remove(r-c); anti.remove(r+c)   # undo all
    bt(0)
    return res
```
Why `r-c` and `r+c`: every cell on a ╲ diagonal shares the same `r-c`; every cell on a ╱
diagonal shares the same `r+c`. Two integers capture all diagonal conflicts in O(1).

## Partitioning — Palindrome Partitioning
Try every cut point; recurse on the remainder only if the prefix is valid (a palindrome).
```python
def partition(s):
    res, path = [], []
    def bt(start):
        if start == len(s): res.append(path[:]); return
        for end in range(start + 1, len(s) + 1):
            piece = s[start:end]
            if piece == piece[::-1]:           # only recurse on valid prefixes
                path.append(piece)
                bt(end)
                path.pop()
    bt(0)
    return res
```

## Sudoku Solver — fill, try, prune, undo
The full constraint-satisfaction shape: find an empty cell, try each legal digit, recurse,
and **return on the first success** (a decision problem, not enumeration).
```python
def solve_sudoku(board):
    def ok(r, c, ch):
        for i in range(9):
            if board[r][i] == ch or board[i][c] == ch: return False
            br, bc = 3*(r//3) + i//3, 3*(c//3) + i%3      # the 3x3 box
            if board[br][bc] == ch: return False
        return True
    def bt():
        for r in range(9):
            for c in range(9):
                if board[r][c] == ".":
                    for ch in "123456789":
                        if ok(r, c, ch):
                            board[r][c] = ch
                            if bt(): return True          # success -> stop
                            board[r][c] = "."             # undo
                    return False                          # no digit fit -> dead end
        return True                                       # no empty cell -> solved
    bt()
```

## Pruning is what makes hard cases fast
Cut branches that can't lead to a solution as early as possible: `remain < 0` (sums),
"attacked" (N-Queens), "prefix isn't a palindrome" (partition), "digit not legal here"
(Sudoku). Without pruning these blow up; with it they're tractable.

## Canonical problems
| Problem | Approach |
|---|---|
| Word Search | grid DFS + mark/restore in place |
| N-Queens | per-row placement, column + two diagonal sets |
| Palindrome Partitioning | cut points + palindrome prefix check |
| Sudoku Solver | fill cell, try 1–9, prune by row/col/box, return on success |
| Combination Sum (family) | [[backtracking-02-perms-combos]] |

## Variations & follow-ups
- "Word Search II" (many words) → build a **trie** of the words so one DFS matches them all
  at once; far faster than running Word Search per word.
- "N-Queens II" (count only) → same recursion, increment a counter instead of building
  boards.
- "Restore IP Addresses" / "Expression Add Operators" → cut-point partitioning with a
  numeric/validity prune, same shape as palindrome partitioning.

## Gotchas
- Grid: **restore the cell** after recursing, or you wrongly block other paths.
- Undo **every** piece of state you changed (all sets in N-Queens).
- Decision problems (Sudoku) **return True on first success**; enumeration problems record
  and keep going.
- Prune early — it's the difference between O(viable) and exponential blow-up.

## Related
- Grid DFS overlaps [[graphs-02-grids]] and [[arrays-10-matrix]]
- Back to [[backtracking-00-roadmap]]
