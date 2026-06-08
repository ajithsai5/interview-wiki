---
title: Graphs 00 · Roadmap
phase: 2
tags: [dsa, graphs, roadmap, index]
group: Graphs
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## What this track is
Graphs model **connections**: paths, "are these linked?", grids, prerequisites,
networks. The toolkit is small but covers a lot: **BFS, DFS, topological sort,
union-find, Dijkstra**.

## The path
1. [[graphs-01-bfs-dfs]] — representations + the two core traversals (BFS = shortest unweighted)
2. [[graphs-02-grids]] — grids as graphs: islands, flood fill, multi-source BFS
3. [[graphs-03-topo-union]] — topological sort (dependencies) + union-find (connectivity)
4. [[graphs-04-shortest-path]] — Dijkstra and friends (weighted shortest path)

## Pattern → reach-for-it
| Clue | Use |
|---|---|
| "shortest path, unweighted / grid" | BFS — [[graphs-01-bfs-dfs]] |
| "connected components / reachable" | DFS or union-find |
| "grid of land/water/rooms" | grid DFS/BFS — [[graphs-02-grids]] |
| "prerequisites / ordering / cycle" | topological sort — [[graphs-03-topo-union]] |
| "weighted shortest path" | Dijkstra — [[graphs-04-shortest-path]] |

## Related
- Generalizes [[trees-00-roadmap|tree]] BFS/DFS; grids overlap [[arrays-10-matrix]] & [[backtracking-03-advanced]]; Dijkstra uses a [[heap-00-roadmap|heap]]
