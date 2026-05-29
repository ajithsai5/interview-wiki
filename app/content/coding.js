/* Coding / DSA — pushes notes into window.WIKI_NOTES */
window.WIKI_NOTES = window.WIKI_NOTES || [];
window.WIKI_NOTES.push(

{
  id: "big-o",
  title: "Big-O & Complexity Analysis",
  domain: "Coding / DSA",
  difficulty: "warm-up",
  updated: "2026-05-29",
  tags: ["big-o", "complexity", "time", "space"],
  related: ["hashing", "binary-search", "sorting"],
  body: `
## TL;DR
Big-O describes how runtime/space **grows** with input size n, ignoring constants and lower-order terms. It's the language for comparing algorithms and the first thing an interviewer expects after you code.

## The ladder (best \u2192 worst)
| Notation | Name | Example |
|---|---|---|
| O(1) | constant | hash lookup, array index |
| O(log n) | logarithmic | [[Binary Search|binary search]] |
| O(n) | linear | single pass / scan |
| O(n log n) | linearithmic | good [[Sorting Algorithms|sorts]] (merge, heap) |
| O(n\u00b2) | quadratic | nested loops over pairs |
| O(2\u207f), O(n!) | exponential/factorial | brute-force subsets/permutations |

## Rules of thumb
- Drop constants and non-dominant terms: <code>O(2n + 100) = O(n)</code>, <code>O(n\u00b2 + n) = O(n\u00b2)</code>.
- **Sequential** code adds (<code>O(a) + O(b)</code>); **nested** multiplies (<code>O(a*b)</code>).
- Analyze **time and space** separately \u2014 a hash map trades O(n) space for O(1) lookups.
- **Amortized** \u2014 occasional expensive ops averaged out (dynamic-array push is amortized O(1)).
- State whether it's **worst / average / best** case.

## Common gotchas
- Hashing is O(1) *average*, O(n) worst case (collisions).
- String concatenation in a loop can be O(n\u00b2).
- Recursion space = call-stack depth (often O(log n) or O(n)).

## Say it out loud
> "This is O(n) time because I scan once, and O(n) space for the hash map. I could drop to O(1) space with two pointers but lose the single pass."

## Likely questions
- *Complexity of your solution \u2014 time and space?*
- *Average vs worst case for a hash map?*
- *What does amortized O(1) mean?*
`,
},

{
  id: "hashing",
  title: "Hash Maps & the Lookup Trick",
  domain: "Coding / DSA",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["hashmap", "hashset", "two-sum", "frequency"],
  related: ["big-o", "two-pointers", "sliding-window"],
  body: `
## TL;DR
The single most useful interview pattern: trade **space for time** by storing things you've seen in a hash map/set for O(1) average lookup. Turns many O(n\u00b2) brute forces into O(n).

## Canonical example \u2014 Two Sum
Brute force checks all pairs: O(n\u00b2). Instead, store each value's complement as you go:
<pre><code>def two_sum(nums, target):
    seen = {}                # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []</code></pre>
One pass, O(n) time, O(n) space.

## When to reach for a hash map
- "Have I **seen** this before?" \u2192 hash **set** (dedupe, cycle detection, presence).
- "How **many** times?" \u2192 hash **map** as a frequency counter (anagrams, top-k, majority).
- "Find a **complement / pair / group**" \u2192 store what you need to look up later.
- **Grouping** \u2192 map a canonical key to a bucket (group anagrams by sorted letters).

## Tradeoffs & gotchas
- O(1) lookups are **average** case; worst case O(n) with bad hashing. (See [[Big-O & Complexity Analysis|complexity]].)
- Costs O(n) extra space \u2014 if the interviewer wants O(1) space, consider [[Two Pointers|two pointers]] (needs sorted input) instead.
- Hashing custom objects needs a stable hash/equality.

## Say it out loud
> "Whenever I see a nested loop searching for a match, I ask whether a hash map of what I've already seen turns it into one pass \u2014 trading O(n) space for O(n) time."

## Likely questions
- *Two Sum / group anagrams / first unique character.*
- *Why is hash lookup O(1)? When is it not?*
- *Set vs map \u2014 when each?*
`,
},

{
  id: "two-pointers",
  title: "Two Pointers",
  domain: "Coding / DSA",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["two-pointers", "array", "sorted", "in-place"],
  related: ["hashing", "sliding-window", "binary-search"],
  body: `
## TL;DR
Use two indices moving through a structure \u2014 from both ends, or at different speeds \u2014 to solve in O(n) time and O(1) space what would otherwise be O(n\u00b2). Usually needs a **sorted** array (or a linked list).

## Two flavors
**Converging (both ends)** \u2014 for sorted-array pair problems:
<pre><code>def pair_sum_sorted(a, target):
    lo, hi = 0, len(a) - 1
    while lo &lt; hi:
        s = a[lo] + a[hi]
        if s == target: return [lo, hi]
        if s &lt; target:  lo += 1     # need bigger
        else:           hi -= 1     # need smaller
    return []</code></pre>

**Fast/slow (different speeds)** \u2014 linked-list cycle detection (Floyd's), find middle, remove nth-from-end. The fast pointer moves 2\u00d7; if there's a cycle they meet.

## When to use it
- Sorted array + "find a pair/triple summing to X" (3Sum = sort + outer loop + two pointers).
- **In-place** array work: remove duplicates, move zeros, partition, reverse.
- Linked list: cycle detection, middle node, palindrome check.
- Merging two sorted arrays/lists.

## Two pointers vs hashing
Both crack pair-sum. [[Hash Maps & the Lookup Trick|Hashing]] works on **unsorted** input (O(n) space). Two pointers needs **sorted** input but uses **O(1) space**. Pick based on whether sorting is allowed/cheap and the space constraint.

## Say it out loud
> "If the array's sorted and I'm looking for pairs or doing in-place work, two pointers gives O(n) time with O(1) space. For cycles or 'middle of a list', I use the fast/slow variant."

## Likely questions
- *3Sum, container with most water, remove duplicates in place.*
- *Detect a cycle in a linked list (Floyd's).*
- *Two pointers vs hash map for pair sum?*
`,
},

{
  id: "sliding-window",
  title: "Sliding Window",
  domain: "Coding / DSA",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["sliding-window", "substring", "subarray", "two-pointers"],
  related: ["two-pointers", "hashing", "big-o"],
  body: `
## TL;DR
For problems about a **contiguous subarray/substring**, maintain a window with two pointers and update an aggregate as it slides \u2014 O(n) instead of recomputing every subarray (O(n\u00b2) or O(n\u00b3)).

## Fixed-size window
Slide a window of size k, adding the entering element and removing the leaving one:
<pre><code>def max_sum_k(a, k):
    window = sum(a[:k]); best = window
    for i in range(k, len(a)):
        window += a[i] - a[i - k]   # add new, drop old
        best = max(best, window)
    return best</code></pre>

## Variable-size window
Expand the right edge; shrink the left while a constraint is violated. Classic for "longest substring without repeating characters":
<pre><code>def longest_unique(s):
    seen = {}; left = 0; best = 0
    for right, c in enumerate(s):
        if c in seen and seen[c] &gt;= left:
            left = seen[c] + 1      # jump past the dup
        seen[c] = right
        best = max(best, right - left + 1)
    return best</code></pre>

## Recognize it when\u2026
- "Longest/shortest/max-sum **contiguous** subarray or substring satisfying a condition."
- "At most k distinct / no repeats / sum \u2264 target."
- Often pairs with a [[Hash Maps & the Lookup Trick|hash map]] of counts inside the window.

## Window vs subsequence
Sliding window is **contiguous** only. If the problem allows skipping elements (subsequence), it's usually [[Dynamic Programming|DP]], not a window.

## Say it out loud
> "Contiguous subarray with a constraint \u2192 sliding window. I expand the right edge and shrink the left when the constraint breaks, keeping a running aggregate so the whole scan is O(n)."

## Likely questions
- *Longest substring without repeating characters.*
- *Minimum window substring; max sum subarray of size k.*
- *Why is it O(n), not O(n\u00b2)?*
`,
},

{
  id: "binary-search",
  title: "Binary Search",
  domain: "Coding / DSA",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["binary-search", "sorted", "log-n", "search-space"],
  related: ["big-o", "two-pointers", "sorting"],
  body: `
## TL;DR
Halve the search space each step \u2192 O(log n). Obvious on a sorted array, but the real interview skill is **binary search on the answer**: any monotonic predicate over a range can be searched.

## The template
<pre><code>def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo &lt;= hi:
        mid = lo + (hi - lo) // 2   # avoids overflow
        if a[mid] == target: return mid
        if a[mid] &lt; target:  lo = mid + 1
        else:                hi = mid - 1
    return -1</code></pre>

## Binary search on the answer
If you can ask a yes/no question that's **monotonic** over a numeric range ("can we do it with capacity X?"), binary-search X. Examples: minimum eating speed, ship-within-D-days capacity, split array largest sum, sqrt(x).
<pre><code># find smallest X where feasible(X) is True
while lo &lt; hi:
    mid = (lo + hi) // 2
    if feasible(mid): hi = mid
    else:             lo = mid + 1
return lo</code></pre>

## Where it bites
- **Off-by-one / infinite loops** \u2014 be consistent: <code>lo &lt;= hi</code> with <code>mid\u00b11</code>, or <code>lo &lt; hi</code> without. Don't mix.
- Finding **leftmost/rightmost** occurrence needs a tweaked condition (bisect_left vs bisect_right).
- Forgetting the array must be **sorted** (or the predicate monotonic).

## Say it out loud
> "Sorted input or a monotonic feasibility check screams binary search \u2014 O(log n). For 'minimize the max' style problems I binary-search the answer and verify feasibility in O(n), giving O(n log range)."

## Likely questions
- *Search in rotated sorted array; find first/last position.*
- *Koko eating bananas / capacity to ship \u2014 binary search on the answer.*
- *How do you avoid off-by-one bugs?*
`,
},

{
  id: "trees-bst",
  title: "Trees, BSTs & Traversals",
  domain: "Coding / DSA",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["tree", "bst", "dfs", "bfs", "recursion"],
  related: ["graphs", "dynamic-programming", "big-o"],
  body: `
## TL;DR
Most tree problems are recursion in disguise: do something at a node, recurse on children, combine. Know the traversal orders cold and the **BST invariant** (left &lt; node &lt; right \u2192 inorder is sorted).

## Traversals
- **DFS** (recursive or stack):
  - **Preorder** (node, left, right) \u2014 copy/serialize a tree.
  - **Inorder** (left, node, right) \u2014 **sorted order for a BST**.
  - **Postorder** (left, right, node) \u2014 delete/compute from children up (e.g. subtree sums, height).
- **BFS / level-order** (queue) \u2014 shortest path in unweighted trees, level-by-level processing.

<pre><code>def inorder(node, out):
    if not node: return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)</code></pre>

## BST property
For every node, all left descendants &lt; node &lt; all right descendants. \u2192 search/insert/delete in **O(h)** where h is height: O(log n) if balanced, O(n) if degenerate (a linked list). Balanced variants (AVL, Red-Black) guarantee O(log n).

## Common patterns
- **Height / depth / diameter** \u2192 postorder, return info upward.
- **Validate BST** \u2192 inorder must be strictly increasing (or pass down min/max bounds).
- **Lowest Common Ancestor** \u2192 recurse; the node where the two targets split.
- **Level order / right-side view / zigzag** \u2192 BFS.

## Say it out loud
> "I default to recursion: handle the node, recurse on children, combine results. Inorder on a BST gives sorted output, which validates it. Operations are O(height), so balance matters \u2014 worst case a skewed tree degrades to O(n)."

## Likely questions
- *Validate a BST; lowest common ancestor.*
- *Inorder/preorder/postorder \u2014 and a use for each.*
- *Why is BST search O(h), and when is that bad?*
`,
},

{
  id: "graphs",
  title: "Graphs: BFS, DFS & Beyond",
  domain: "Coding / DSA",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["graph", "bfs", "dfs", "topological-sort", "dijkstra"],
  related: ["trees-bst", "dynamic-programming", "big-o"],
  body: `
## TL;DR
Model the problem as nodes + edges, then pick a traversal: **BFS** for shortest path in unweighted graphs, **DFS** for connectivity/cycles/topological order, **Dijkstra** for weighted shortest paths. Remember a **visited set** to avoid infinite loops.

## Representations
- **Adjacency list** \u2014 dict of node \u2192 neighbors. O(V+E) space; the default.
- **Adjacency matrix** \u2014 V\u00d7V; good for dense graphs / O(1) edge checks.

## The core traversals
<pre><code>from collections import deque
def bfs(graph, start):
    seen = {start}; q = deque([start])
    while q:
        node = q.popleft()
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt); q.append(nxt)</code></pre>
- **BFS** (queue) \u2014 explores by distance \u2192 **shortest path in unweighted graphs**, level structure.
- **DFS** (stack/recursion) \u2014 explores deep \u2192 connected components, cycle detection, path existence, topological sort.

## Patterns to recognize
- **Grid problems** (islands, flood fill, rotting oranges) = graphs where cells are nodes, neighbors are up/down/left/right.
- **Topological sort** \u2014 ordering a DAG by dependencies (course schedule). Kahn's algorithm (BFS on in-degrees) or DFS post-order.
- **Cycle detection** \u2014 DFS with a recursion stack (directed) or union-find (undirected).
- **Shortest path** \u2014 unweighted: BFS; non-negative weights: **Dijkstra** (min-heap); negative edges: Bellman-Ford.
- **Connected components / "are these connected"** \u2014 union-find (DSU).

## Say it out loud
> "I'd build an adjacency list, then choose: BFS for unweighted shortest path, DFS for connectivity, cycles or topological order, Dijkstra with a heap for weighted shortest paths. Always a visited set, and grids are just implicit graphs."

## Likely questions
- *Number of islands / course schedule (topo sort).*
- *BFS vs DFS \u2014 when each? Why BFS for shortest path?*
- *Detect a cycle in a directed graph.*
`,
},

{
  id: "dynamic-programming",
  title: "Dynamic Programming",
  domain: "Coding / DSA",
  difficulty: "advanced",
  updated: "2026-05-29",
  tags: ["dp", "memoization", "tabulation", "recurrence"],
  related: ["big-o", "graphs", "backtracking"],
  body: `
## TL;DR
DP solves problems with **overlapping subproblems** and **optimal substructure** by solving each subproblem once and reusing the answer. Two styles: top-down **memoization** (recursion + cache) or bottom-up **tabulation**.

## The recipe
1. **Define the state** \u2014 what do the subproblem parameters mean? (e.g. <code>dp[i]</code> = best using first i items.)
2. **Recurrence** \u2014 express <code>dp[i]</code> from smaller states.
3. **Base cases** \u2014 the smallest subproblems.
4. **Order / memo** \u2014 fill bottom-up, or recurse with a cache.
5. **Optimize space** \u2014 often only the last row/few values are needed.

<pre><code># Top-down: Fibonacci with memoization
from functools import lru_cache
@lru_cache(None)
def fib(n):
    if n &lt; 2: return n
    return fib(n-1) + fib(n-2)</code></pre>

## How to recognize DP
- "**Count the ways**", "**min/max** cost/path", "**can we reach/partition**".
- Choices at each step + the future depends only on the current **state** (not the path taken).
- A brute-force recursion that **recomputes** the same subproblems \u2192 add a cache = DP.

## Classic families
- **1D** \u2014 climbing stairs, house robber, max subarray (Kadane).
- **Knapsack** \u2014 subset sum, coin change, partition.
- **Two-sequence (2D)** \u2014 edit distance, longest common subsequence.
- **Intervals / grids** \u2014 unique paths, matrix chain.

## Memoization vs tabulation
| | Memoization (top-down) | Tabulation (bottom-up) |
|---|---|---|
| Style | Recursion + cache | Iterative table |
| Computes | Only needed states | All states |
| Risk | Stack depth | Wasted states |
| Space-optimizable | Harder | Easier (rolling array) |

## Say it out loud
> "I look for overlapping subproblems and optimal substructure. I'll write the brute-force recursion first, define the state and recurrence, then memoize it. If recursion depth or constants matter, I convert to a bottom-up table and shrink space to the rows I actually need."

## Likely questions
- *Coin change / longest common subsequence / edit distance.*
- *Memoization vs tabulation tradeoffs?*
- *How do you identify a problem as DP?*
`,
},

{
  id: "sorting",
  title: "Sorting Algorithms",
  domain: "Coding / DSA",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["sorting", "quicksort", "mergesort", "stability"],
  related: ["big-o", "binary-search", "heaps"],
  body: `
## TL;DR
Know the O(n log n) comparison sorts (merge, quick, heap), what **stable** means, and \u2014 most usefully for interviews \u2014 that "sort first" often unlocks a clean O(n log n) solution to a problem that looks O(n\u00b2).

## The comparison sorts
| Algorithm | Time (avg / worst) | Space | Stable | Notes |
|---|---|---|---|---|
| **Merge sort** | n log n / n log n | O(n) | Yes | Predictable; good for linked lists / external sort |
| **Quick sort** | n log n / **n\u00b2** | O(log n) | No | Fast in practice; worst case on bad pivots |
| **Heap sort** | n log n / n log n | O(1) | No | In-place, no worst-case blowup |
| **Insertion** | n\u00b2 / n\u00b2 | O(1) | Yes | Great for tiny/nearly-sorted arrays |

**O(n log n) is the lower bound** for comparison-based sorting.

## Quicksort details (commonly probed)
Pick a pivot, **partition** into &lt;pivot and &gt;pivot, recurse. Worst case O(n\u00b2) when the pivot is always the min/max (e.g. already-sorted input with a naive pivot) \u2192 use random or median-of-three pivots.

## Non-comparison sorts
**Counting / radix / bucket** sort run in O(n) (or O(nk)) by exploiting bounded integer keys \u2014 they sidestep the n log n bound because they don't compare elements.

## Stability \u2014 why it matters
A **stable** sort preserves the relative order of equal keys. Essential when sorting by multiple keys in passes (sort by name, then stably by age).

## "Sort first" as a strategy
Sorting upfront (O(n log n)) often enables [[Two Pointers|two pointers]], [[Binary Search|binary search]], greedy interval merging, or dedup \u2014 turning an O(n\u00b2) brute force into O(n log n).

## Say it out loud
> "Comparison sorts bottom out at O(n log n). I'd mention quicksort's O(n\u00b2) worst case and the random-pivot fix, merge sort's stability and O(n) space, and that counting/radix beat the bound for bounded integers. Often the move is just 'sort first' to enable two pointers or binary search."

## Likely questions
- *Quicksort vs merge sort \u2014 time, space, stability?*
- *When is quicksort O(n\u00b2), and how do you avoid it?*
- *What does a stable sort mean and when do you need it?*
`,
},

{
  id: "heaps",
  title: "Heaps & Priority Queues",
  domain: "Coding / DSA",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["heap", "priority-queue", "top-k", "median"],
  related: ["sorting", "graphs", "big-o"],
  body: `
## TL;DR
A heap gives you the **min or max element in O(1)** and insert/pop in **O(log n)**, without keeping everything sorted. The go-to structure for "top-k", "k-th largest", streaming medians, and Dijkstra.

## What it is
A binary heap is a complete tree where every parent \u2264 (min-heap) or \u2265 (max-heap) its children. Backed by an array; push/pop "bubble" elements up/down in O(log n). Python's <code>heapq</code> is a min-heap (negate values for a max-heap).

## The killer pattern: top-k with a heap of size k
To find the k largest in a stream of n items, keep a **min-heap of size k**: push each item, pop the smallest when size exceeds k. O(n log k) time, O(k) space \u2014 beats sorting everything (O(n log n)) when k \u226a n, and works on streams.
<pre><code>import heapq
def k_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) &gt; k:
            heapq.heappop(h)   # drop the smallest
    return h                   # the k largest remain</code></pre>

## When to reach for a heap
- **Top-k / k-th largest or smallest** \u2014 heap of size k.
- **Merge k sorted lists** \u2014 heap of the k front elements.
- **Streaming median** \u2014 two heaps (a max-heap of the low half, min-heap of the high half).
- **[[Graphs: BFS, DFS & Beyond|Dijkstra]] / Prim's** \u2014 min-heap of frontier edges by cost.
- "Schedule / always grab the next best" \u2192 greedy with a priority queue.

## Heap vs sorting
If you need the **few** best, a heap (O(n log k)) beats a full [[Sorting Algorithms|sort]] (O(n log n)) and handles unbounded streams. If you need everything ordered, just sort.

## Say it out loud
> "When I see 'k-th largest', 'top-k', or 'merge k lists', I reach for a heap \u2014 O(log n) push/pop, and a size-k heap solves top-k in O(n log k) even on a stream. Two heaps give a running median."

## Likely questions
- *K-th largest element; top-k frequent.*
- *Find the median of a data stream.*
- *Heap vs sorted array for top-k \u2014 why?*
`,
},

{
  id: "backtracking",
  title: "Backtracking & Recursion",
  domain: "Coding / DSA",
  difficulty: "advanced",
  updated: "2026-05-29",
  tags: ["backtracking", "recursion", "dfs", "combinatorics"],
  related: ["dynamic-programming", "trees-bst", "graphs"],
  body: `
## TL;DR
Backtracking explores all candidate solutions by building them incrementally and **abandoning** a path as soon as it can't lead to a valid solution. It's DFS over the space of choices with **undo**. The pattern behind permutations, combinations, subsets, N-Queens, and Sudoku.

## The template
<pre><code>def backtrack(path, choices):
    if is_solution(path):
        results.append(path[:])   # copy
        return
    for choice in choices:
        if not valid(choice, path):
            continue              # prune
        path.append(choice)       # choose
        backtrack(path, next_choices(choice))
        path.pop()                # un-choose (backtrack)</code></pre>
The trio: **choose \u2192 explore \u2192 un-choose**. The <code>path.pop()</code> is what makes it "backtracking".

## Recognize it
- "Generate **all** subsets / permutations / combinations."
- "Find all paths / placements / partitions satisfying constraints" (N-Queens, word search, Sudoku).
- Constraint-satisfaction where you can prune invalid partial solutions early.

## Pruning = the whole game
Exhaustive search is exponential (O(2\u207f), O(n!)). The art is **pruning** dead branches early (constraint checks, sorting to skip duplicates) so you explore a tiny fraction of the tree.

## Backtracking vs DP
Both are recursion over choices. **[[Dynamic Programming|DP]]** applies when subproblems **overlap** and you want one optimal value \u2192 cache and reuse. **Backtracking** applies when you need to **enumerate all solutions** or there's no overlap to exploit. If a backtracking solution recomputes overlapping states for a count/optimum, switch to DP.

## Say it out loud
> "Backtracking is DFS over choices with undo: choose, recurse, un-choose. I generate candidates incrementally and prune invalid branches early to avoid the full exponential blow-up. If subproblems overlap and I only need an optimum or a count, I'd memoize it into DP instead."

## Likely questions
- *Subsets / permutations / combination sum / N-Queens.*
- *How is backtracking different from plain DFS?*
- *When backtracking vs dynamic programming?*
`,
}

);
