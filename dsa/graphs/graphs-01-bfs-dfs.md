---
title: Graphs 01 · BFS & DFS
phase: 2
tags: [dsa, graphs, bfs, dfs]
group: Graphs
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Representing a graph
Most common: an **adjacency list** (node → list of neighbors).
```
   A — B          adj = {
   |   |            "A": ["B", "C"],
   C — D            "B": ["A", "D"],
                    "C": ["A", "D"],
                    "D": ["B", "C"] }
```
Build it from an edge list:
```python
from collections import defaultdict
def build(edges, directed=False):
    adj = defaultdict(list)
    for a, b in edges:
        adj[a].append(b)
        if not directed: adj[b].append(a)
    return adj
```

## DFS — reachability, components, cycles
```python
def dfs(node, adj, seen):
    seen.add(node)
    for nxt in adj[node]:
        if nxt not in seen:
            dfs(nxt, adj, seen)
```

## BFS — shortest path in an UNWEIGHTED graph
Explore in rings; the first time you reach a node is via a shortest path. **Mark
visited when you enqueue**, not when you dequeue (or nodes get added repeatedly).
```python
from collections import deque
def bfs_dist(start, adj):
    dist = {start: 0}
    q = deque([start])
    while q:
        node = q.popleft()
        for nxt in adj[node]:
            if nxt not in dist:
                dist[nxt] = dist[node] + 1     # one more edge
                q.append(nxt)
    return dist
```

## The golden rule: always track `seen`
Without it, cycles loop forever. `seen` (a set or visited grid) is mandatory in every
traversal.

## BFS vs DFS — which?
```
 shortest path (equal edge weights) -> BFS
 "any path / does X reach Y / components / detect cycle" -> DFS (or BFS)
 weighted shortest path -> NOT plain BFS -> Dijkstra (graphs-04)
```

## Complexity
Both visit each vertex and edge once: **O(V + E)** time, O(V) space.

## Canonical problems
| Problem | Tool |
|---|---|
| Clone Graph | DFS/BFS + hashmap old→new |
| Number of Connected Components | DFS per unvisited node (or union-find) |
| Course Schedule (has cycle?) | DFS colors or topo sort ([[graphs-03-topo-union]]) |
| Word Ladder | BFS on the word graph |

## Gotchas
- **Never omit `seen`**; for BFS mark on **enqueue**.
- Deep graphs can overflow recursion — use **iterative** DFS (explicit [[stack-00-roadmap|stack]]) or BFS.
- BFS gives shortest path only when edges are unweighted/equal.

## Next
- [[graphs-02-grids]] — grids as graphs
