---
title: Graphs 01 · BFS & DFS
phase: 2
tags: [dsa, graphs, bfs, dfs]
group: Graphs
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
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
- **Adjacency list** — O(V + E) space, the default for sparse graphs.
- **Adjacency matrix** — O(V²); only when the graph is dense or you need O(1) "is there an
  edge a→b?" checks.

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

## Dry run — BFS distances from A
```
 graph:  A-B, A-C, B-D, C-D
 start A: dist={A:0}, q=[A]
 pop A -> push B(1), C(1)          dist={A:0,B:1,C:1}  q=[B,C]
 pop B -> D not seen -> push D(2)  dist={...,D:2}      q=[C,D]
 pop C -> D already in dist (skip) q=[D]
 pop D -> neighbors all seen       q=[]
 -> distances A:0 B:1 C:1 D:2  (D found via B at depth 2, the shortest)
```
Because C also touches D but D was already recorded at distance 2, the **first** arrival
wins — that's why BFS gives shortest paths.

## The golden rule: always track `seen`
Without it, cycles loop forever. `seen` (a set or visited grid) is mandatory in every
traversal. For BFS, **mark on enqueue** — marking on dequeue lets a node sit in the queue
multiple times before it's first processed.

## Reconstructing the actual path (not just the distance)
Store a `parent` pointer when you first reach each node, then walk back from the target.
```python
def bfs_path(start, target, adj):
    parent = {start: None}
    q = deque([start])
    while q:
        node = q.popleft()
        if node == target: break
        for nxt in adj[node]:
            if nxt not in parent:
                parent[nxt] = node
                q.append(nxt)
    if target not in parent: return None
    path = []                              # walk parents back to the start
    while target is not None:
        path.append(target); target = parent[target]
    return path[::-1]
```

## BFS vs DFS — which?
```
 shortest path (equal edge weights) -> BFS
 "any path / does X reach Y / components / detect cycle" -> DFS (or BFS)
 weighted shortest path -> NOT plain BFS -> Dijkstra (graphs-04)
```

## Complexity
Both visit each vertex and edge once: **O(V + E)** time, O(V) space.

## Canonical problems
| Problem | Approach |
|---|---|
| Clone Graph | DFS/BFS + hashmap old→new node |
| Number of Connected Components | DFS per unvisited node (or union-find) |
| Course Schedule (has cycle?) | DFS colors or topo sort ([[graphs-03-topo-union]]) |
| Word Ladder | BFS on the implicit word graph |
| Rotting Oranges / shortest grid path | multi-source / plain BFS ([[graphs-02-grids]]) |

## Variations & follow-ups
- "Clone Graph" / "Copy with neighbors" → carry a `{old: new}` map; create the clone on
  first visit, then wire neighbors.
- "Bipartite check" → BFS/DFS 2-coloring; conflict ⇒ not bipartite.
- "Shortest path with the actual route" → keep `parent[]` and backtrack (above).
- Cycle detection differs by graph type: **undirected** → DFS with a parent check (or
  union-find); **directed** → DFS 3-color (white/gray/black) or topo sort.

## Gotchas
- **Never omit `seen`**; for BFS mark on **enqueue**.
- Deep graphs can overflow recursion — use **iterative** DFS (explicit [[stack-00-roadmap|stack]]) or BFS.
- BFS gives shortest path only when edges are unweighted/equal.

## Next
- [[graphs-02-grids]] — grids as graphs
