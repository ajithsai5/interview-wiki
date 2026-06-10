---
title: Graphs 04 · Shortest Path (Dijkstra)
phase: 2
tags: [dsa, graphs, dijkstra, heap]
group: Graphs
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## When BFS isn't enough
Plain BFS finds the fewest **edges**. With **weighted** edges (costs/times/distances),
you need **Dijkstra**: always expand the closest-so-far node, using a min-heap. Works
when weights are **non-negative**.

## Dijkstra with a heap
```python
import heapq
def dijkstra(adj, start):                 # adj: node -> [(neighbor, weight), ...]
    dist = {start: 0}
    pq = [(0, start)]                     # (distance_so_far, node)
    while pq:
        d, node = heapq.heappop(pq)
        if d > dist.get(node, float('inf')):
            continue                      # stale entry -> skip
        for nbr, w in adj[node]:
            nd = d + w
            if nd < dist.get(nbr, float('inf')):
                dist[nbr] = nd
                heapq.heappush(pq, (nd, nbr))
    return dist
```
```
 pop the nearest unfinalized node, relax its edges, push improved distances
 the first time you pop a node, its distance is final (non-negative weights)
```

## Dry run — from A, edges A→B(1), A→C(4), B→C(2), B→D(7), C→D(1)
```
 pq=[(0,A)] dist={A:0}
 pop (0,A): relax B->1 push(1,B); C->4 push(4,C)        dist{A0,B1,C4}
 pop (1,B): relax C->1+2=3 < 4 push(3,C); D->1+7=8 push(8,D)  dist{...C3,D8}
 pop (3,C): relax D->3+1=4 < 8 push(4,D)                dist{...D4}
 pop (4,C): stale (3 already final) -> skip
 pop (4,D): relax none better                            dist{...D4}
 pop (8,D): stale -> skip
 -> A0 B1 C3 D4. Note C improved from 4 to 3 via B; the stale (4,C) entry was skipped.
```
This is why the **stale-entry skip** matters: `heapq` has no decrease-key, so we push a
fresh `(dist, node)` and let the old, larger one get discarded when popped.

## Network Delay Time (classic Dijkstra)
Run Dijkstra from the source; the answer is the **max** finalized distance (or −1 if
some node is unreachable).

## Variants you may meet
- **0/1 weights** → BFS with a deque (0-1 BFS): push 0-edges to the **front**, 1-edges to
  the **back**. O(V + E), no heap.
- **At most K stops** (Cheapest Flights) → **Bellman-Ford** style: relax all edges K+1
  times, so the hop limit is respected (plain Dijkstra can finalize a node "too early").
- **All-pairs / negative edges** → Bellman-Ford (single source, negatives) or
  Floyd-Warshall (all pairs, O(V³)); rare in interviews.
- **Min spanning tree** ("connect all at min cost") → Prim's (heap) or Kruskal's
  (sort edges + union-find from [[graphs-03-topo-union]]).

## Complexity
Dijkstra with a binary heap: **O(E log V)**. Space O(V + E).

## Canonical problems
| Problem | Approach |
|---|---|
| Network Delay Time | Dijkstra from source, answer = max dist |
| Cheapest Flights Within K Stops | Bellman-Ford (K+1 relaxations) or Dijkstra+stops |
| Path with Minimum Effort | Dijkstra on grid, cost = max edge on the path |
| Swim in Rising Water | Dijkstra/binary search, minimize the max cell on a path |
| Min Cost to Connect All Points | MST — Prim's (heap) or Kruskal's (union-find) |

## Variations & follow-ups
- "Path with Minimum Effort" / "Swim in Rising Water" → Dijkstra where a path's cost is the
  **max** edge (not the sum) — relax with `max(d, w)` instead of `d + w`.
- "Cheapest Flights Within K Stops" → the K-hop cap breaks plain Dijkstra; use Bellman-Ford
  with exactly K+1 rounds.
- MST vs shortest path: MST minimizes **total** connecting cost (Prim/Kruskal); Dijkstra
  minimizes distance **from one source**. Different goals — don't mix them up.

## Gotchas
- Dijkstra needs **non-negative** weights; negatives → Bellman-Ford.
- Skip **stale** heap entries (`if d > dist[node]: continue`).
- Equal weights? Don't over-engineer — plain **BFS** is the shortest path.
- A "≤ K stops" constraint usually means **Bellman-Ford**, not vanilla Dijkstra.

## Related
- Uses a [[heap-00-roadmap|heap]]; MST uses [[graphs-03-topo-union|union-find]]; unweighted shortest path is [[graphs-01-bfs-dfs|BFS]]
- Back to [[graphs-00-roadmap]]
