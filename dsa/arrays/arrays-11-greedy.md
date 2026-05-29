---
title: Arrays 11 · Greedy + Arrays
phase: 2
tags: [dsa, arrays, greedy]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The core idea
A **greedy** algorithm makes the choice that looks best **right now** and never
looks back — and for the right problems, those local choices add up to the global
optimum. One pass, usually **O(n)** (plus sorting if needed).

> The hard part isn't coding greedy — it's *proving* (or convincing yourself)
> that the local choice is safe. If a counterexample exists, greedy is wrong and
> you likely need [[arrays-13-dp|DP]].

## Worked example — Jump Game (can you reach the end?)
Track the **farthest** index reachable so far. If you ever stand on a cell beyond
that reach, you're stuck.
```
 nums = [2, 3, 1, 1, 4]
 i=0 reach=max(0, 0+2)=2
 i=1 reach=max(2, 1+3)=4   >= last index -> reachable!
```
```python
def can_jump(nums):
    reach = 0
    for i, n in enumerate(nums):
        if i > reach:            # can't even get here
            return False
        reach = max(reach, i + n)
    return True
```

## Worked example — Gas Station
If total gas ≥ total cost, a solution exists. Sweep once; whenever the running
tank goes negative, **no station up to here can be the start**, so reset the
start to the next station.
```
 if tank dips below 0 at station i, start must be after i
   start ->        x (dip)
   [...running tank...]----\
                            reset start = i+1, tank = 0
```
```python
def can_complete_circuit(gas, cost):
    if sum(gas) < sum(cost):
        return -1
    start = tank = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:                 # everything up to i fails as a start
            start = i + 1
            tank = 0
    return start
```

## Worked example — Candy (two greedy passes)
Each child gets ≥1 candy; a child with a higher rating than a neighbor gets more.
Sweep **left→right** (fix the left neighbor rule), then **right→left** (fix the
right neighbor rule), taking the max.
```
 ratings = [1, 0, 2]
 L->R:  [1, 1, 2]
 R->L:  [1, 1, 2]  (max with previous)   total = 5? -> [2,1,2] = 5
```
```python
def candy(ratings):
    n = len(ratings)
    candies = [1] * n
    for i in range(1, n):                       # left to right
        if ratings[i] > ratings[i-1]:
            candies[i] = candies[i-1] + 1
    for i in range(n - 2, -1, -1):              # right to left
        if ratings[i] > ratings[i+1]:
            candies[i] = max(candies[i], candies[i+1] + 1)
    return sum(candies)
```

## Worked example — Merge Intervals
Greedy after sorting by start (full code in [[arrays-07-sorting]]): keep extending
the current interval while the next one overlaps.

## Practice
| Problem | Greedy choice |
|---|---|
| Jump Game | track farthest reach |
| Jump Game II | extend "current jump end", count jumps (BFS-like) |
| Gas Station | reset start when tank < 0 |
| Candy | two directional passes |
| Merge Intervals | sort by start, extend while overlapping |

## Greedy vs DP — how to tell
- **Greedy**: a single locally-best choice is provably safe (no need to undo).
- **DP**: choices interact; you must consider multiple options and combine
  sub-results. If you can build a counterexample to the greedy choice → use
  [[arrays-13-dp|DP]].

## Pitfalls
- Don't assume greedy works — sanity-check with a small adversarial example.
- Many greedy array problems need **sorting first** ([[arrays-07-sorting]]); count that cost.

## Related
- Often pairs with [[arrays-07-sorting]] · contrast with [[arrays-13-dp]]
- Next: [[arrays-12-advanced]]
