---
title: Greedy
phase: 2
tags: [dsa, greedy]
group: Greedy
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
When a **locally-optimal choice is provably safe** — take the best option at each
step and never reconsider. One pass, usually **O(n)** (plus sorting). Common shapes:
"max reach", "fewest of X", "schedule the most", "buy low / sell high".

> The trap: greedy is *wrong* when an early choice can sabotage a later one. If you
> can build a small counterexample, you need [[dynamic-programming|DP]] instead.

## Greedy vs DP — the deciding question
```
 "Does committing to the best-looking choice NOW ever hurt me later?"
   No  -> greedy (prove the exchange argument / it's monotonic)
   Yes -> DP (consider options, reuse subresults)
```

## Worked example — Jump Game (can you reach the end?)
Track the **farthest** index reachable; if you ever stand beyond it, you're stuck.
```python
def can_jump(nums):
    reach = 0
    for i, n in enumerate(nums):
        if i > reach:
            return False
        reach = max(reach, i + n)
    return True
```

## Worked example — Maximum subarray (Kadane, a greedy/DP hybrid)
Drop the running sum whenever it goes negative — it can only hurt what follows.
```python
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)     # restart vs extend
        best = max(best, cur)
    return best
```

## Common greedy moves
- **Sort, then sweep** — intervals (keep the one that ends earliest), assign cookies, etc.
- **Track a running best** — farthest reach, min price so far, current end of a "jump".
- **Exchange argument** — show that swapping toward the greedy choice never worsens
  the answer (this is your informal proof it's correct).

## Complexity
Typically **O(n)**, or **O(n log n)** when a sort sets up the greedy order.

## Canonical problems (NeetCode / classic)
| Problem | Greedy choice |
|---|---|
| Jump Game / Jump Game II | farthest reach / extend current jump |
| Gas Station | reset start when the tank goes negative |
| Best Time to Buy & Sell Stock | track min price so far |
| Maximum Subarray | drop negative running sum (Kadane) |
| Hand of Straights / Partition Labels | sort + grouping sweep |
| Non-overlapping Intervals | sort by end, keep earliest-ending |
| Merge Intervals | sort by start, extend ([[intervals]]) |

## Gotchas / re-solve notes
- **Sanity-check greedy with a tiny adversarial example** before trusting it.
- Many greedy problems need a **sort first** ([[arrays-07-sorting]]) — count that cost.
- "Min number of …" and "max number of non-conflicting …" are usually greedy; "number
  of ways" / "min cost with interacting choices" are usually [[dynamic-programming|DP]].

## Related
- Array-specific greedy (Candy, Gas Station) is detailed in [[arrays-11-greedy]]
- Interval greedy lives in [[intervals]]; contrast with [[dynamic-programming]]
