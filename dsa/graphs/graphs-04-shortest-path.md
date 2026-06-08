---
title: Graphs 04 · Shortest Path (Dijkstra)
phase: 2
tags: [dsa, graphs, dijkstra, heap]
group: Graphs
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
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

## Network Delay Time (classic Dijkstra)
Run Dijkstra from the source; the answer is the **max** finalized distance (or -1 if
some node is unreachable).

## Variants you may meet
- **0/1 weights** → BFS with a deque (0-1 BFS): push 0-edges to front, 1-edges to back.
- **All-pairs / negative edges** → Bellman-Ford or Floyd-Warshall (rare in interviews).
- **Min spanning tree** ("connect all at min cost") → Prim's (heap) or Kruskal's
  (sort edges + union-find from [[graphs-03-topo-union]]).

## Complexity
Dijkstra with a binary heap: **O(E log V)**. Space O(V + E).

## Canonical problems
| Problem | Tool |
|---|---|
| Network Delay Time | Dijkstra |
| Cheapest Flights Within K Stops | Dijkstra/BFS with a stop limit (or Bellman-Ford) |
| Path with Minimum Effort / Swim in Rising Water | Dijkstra on a grid (cost = max edge) |
| Min Cost to Connect All Points | MST (Prim's / Kruskal's) |

## Gotchas
- Dijkstra needs **non-negative** weights; negatives → Bellman-Ford.
- Skip **stale** heap entries (`if d > dist[node]: continue`).
- Equal weights? Don't over-engineer — plain **BFS** is the shortest path.

## Related
- Uses a [[heap-00-roadmap|heap]]; MST uses [[graphs-03-topo-union|union-find]]; unweighted shortest path is [[graphs-01-bfs-dfs|BFS]]
- Back to [[graphs-00-roadmap]]
