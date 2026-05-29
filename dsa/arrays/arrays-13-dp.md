---
title: Arrays 13 · Dynamic Programming on Arrays
phase: 2
tags: [dsa, arrays, dp]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The core idea
**Dynamic programming** = break a problem into overlapping subproblems, solve
each once, and reuse the answers. On arrays this is usually **1D DP**: a `dp`
array where `dp[i]` is the answer for the prefix ending at `i`, built from earlier
entries via a **recurrence**.

```
 define   dp[i] = best answer considering elements up to i
 relate   dp[i] = f(dp[i-1], dp[i-2], ..., arr[i])     <- the recurrence
 base     dp[0] = something simple
 answer   dp[n-1]  (or max/min over dp)
```

Two ways to implement the same recurrence:
- **Top-down** (recursion + memo cache) — natural, easy to derive.
- **Bottom-up** (fill a table left→right) — usually faster, often O(1) space after.

## Worked example — House Robber
Can't rob two adjacent houses. At house `i`: either **skip** it (keep `dp[i-1]`)
or **rob** it (`arr[i] + dp[i-2]`).
```
 dp[i] = max(dp[i-1], arr[i] + dp[i-2])

 houses = [2, 7, 9, 3, 1]
 dp:  2 -> 7 -> max(7, 9+2=11)=11 -> max(11, 3+7=10)=11 -> max(11,1+11=12)=12
 answer = 12   (rob houses 2, 9, 1)
```
```python
def rob(arr):
    prev2 = prev1 = 0                  # dp[i-2], dp[i-1]
    for x in arr:
        prev2, prev1 = prev1, max(prev1, x + prev2)
    return prev1
# O(n) time, O(1) space — only the last two states matter
```

## Worked example — Maximum Product Subarray
Product flips sign on negatives, so track **both** the running max and min ending
here (a min × a new negative can become the new max).
```
 nums = [2, 3, -2, 4]
 keep cur_max, cur_min; on a negative, swap them before extending
```
```python
def max_product(nums):
    best = cur_max = cur_min = nums[0]
    for x in nums[1:]:
        if x < 0:
            cur_max, cur_min = cur_min, cur_max    # negative flips roles
        cur_max = max(x, cur_max * x)
        cur_min = min(x, cur_min * x)
        best = max(best, cur_max)
    return best
```
(Compare with plain-sum [[arrays-06-kadane]] — same skeleton, extra min state.)

## Worked example — Best Time to Buy/Sell Stock
Track the **min price so far**; best profit = max over `price - min_so_far`.
```python
def max_profit(prices):
    min_price = float('inf')
    best = 0
    for p in prices:
        min_price = min(min_price, p)
        best = max(best, p - min_price)
    return best
```

## Worked example — Jump Game II (fewest jumps)
DP/greedy hybrid: expand the current jump's reach; when you exhaust it, you must
take another jump.
```python
def jump(nums):
    jumps = cur_end = farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == cur_end:               # used up this jump's range
            jumps += 1
            cur_end = farthest
    return jumps
```

## How to derive a DP (the recipe)
```
 1. State:      what does dp[i] MEAN? (answer for prefix ending at i)
 2. Choice:     at i, what options do I have? (take / skip / split ...)
 3. Recurrence: combine earlier dp values for each choice, pick best
 4. Base case:  smallest input(s)
 5. Order:      fill so dependencies are ready (usually left -> right)
 6. Optimize:   if dp[i] only needs dp[i-1], dp[i-2] -> drop to O(1) variables
```

## Practice
| Problem | dp[i] meaning |
|---|---|
| House Robber | max loot up to house i |
| Maximum Product Subarray | max/min product ending at i |
| Best Time to Buy/Sell Stock | best profit with min-so-far |
| Jump Game II | fewest jumps to reach i |
| Climbing Stairs | ways to reach step i (`dp[i]=dp[i-1]+dp[i-2]`) |

## Pitfalls
- Nail the **state definition** in words first — vague state = wrong recurrence.
- Get **base cases** right (empty / single element).
- Product/sign problems need the extra **min** state; don't reuse the sum template blindly.

## Related
- Generalizes [[arrays-06-kadane]] · vs [[arrays-11-greedy]] (when local choice is safe)
- Back to the start: [[arrays-00-roadmap]]
