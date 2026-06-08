---
title: Stack 00 · Roadmap
phase: 2
tags: [dsa, stack, roadmap, index]
group: Stack
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## What this track is
A **stack** is LIFO — last in, first out. It shows up whenever "the most recent
thing" matters: matching brackets, undo, evaluating expressions, and the powerful
**monotonic stack** for "next greater / smaller" problems.

## The path
1. [[stack-01-basics]] — LIFO, operations, matching (valid parentheses), min stack
2. [[stack-02-monotonic]] — the monotonic-stack pattern: next greater / warmer / span
3. [[stack-03-problems]] — RPN, histogram, decode, simplify path, and recursion→stack

## Pattern → reach-for-it
| Clue | Use |
|---|---|
| "balanced / matching / nesting" | matching stack — [[stack-01-basics]] |
| "next greater / smaller element", "days until" | monotonic stack — [[stack-02-monotonic]] |
| "evaluate expression", "undo", "innermost first" | stack — [[stack-03-problems]] |

## Related
- Monotonic stack also appears in [[arrays-12-advanced]]
- Iterative [[trees-00-roadmap|tree]] / [[graphs-00-roadmap|graph]] traversal uses an explicit stack
