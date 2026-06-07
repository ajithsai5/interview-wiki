---
title: Linked List
phase: 2
tags: [dsa, linked-list, two-pointers]
group: Linked List
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
Linked-list problems test **pointer manipulation**, not cleverness. The recurring
moves are: **reverse**, **fast/slow pointers**, **merge**, **dummy head**, and
**cycle detection**. If you can do those five, you can do most of them.

```
 a singly linked list:
 [1|·]──▶[2|·]──▶[3|·]──▶[4|None]
  head
 each node: { val, next }
```
```python
class ListNode:
    def __init__(self, val=0, nxt=None):
        self.val, self.next = val, nxt
```

## Move 1 — Reverse a list (the most important)
Re-point each `next` backward, carrying a `prev`.
```
 before: 1 -> 2 -> 3 -> None
 after:  None <- 1 <- 2 <- 3   (return 3)
```
```python
def reverse(head):
    prev = None
    while head:
        nxt = head.next     # save
        head.next = prev    # flip
        prev = head         # advance prev
        head = nxt          # advance head
    return prev
```

## Move 2 — Fast / slow pointers
`slow` moves 1 step, `fast` moves 2. When `fast` hits the end, `slow` is at the
**middle**. If they ever meet, there's a **cycle** (Floyd's algorithm).
```python
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow            # middle node

def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False
```

## Move 3 — Dummy head (clean merges/removals)
A dummy node before the head removes special-casing of the first element.
```python
def merge_two(a, b):
    dummy = tail = ListNode()
    while a and b:
        if a.val <= b.val: tail.next, a = a, a.next
        else:              tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b          # attach the rest
    return dummy.next
```

## Complexity
- Traverse / reverse / merge: **O(n)** time, **O(1)** space (iterative).
- Recursive reverse is O(n) time but O(n) stack space — prefer iterative.

## Canonical problems (NeetCode)
| Problem | Move |
|---|---|
| Reverse Linked List | reverse |
| Merge Two Sorted Lists | dummy head + merge |
| Linked List Cycle | fast/slow (Floyd) |
| Reorder List | find middle → reverse 2nd half → merge |
| Remove Nth Node From End | two pointers n apart + dummy |
| Add Two Numbers | dummy head + carry |
| LRU Cache | hashmap + doubly linked list |
| Merge K Sorted Lists | heap of heads ([[heap]]) or divide-and-conquer |

## Gotchas / re-solve notes
- **Save `head.next` before you overwrite it** in reverse, or you lose the rest.
- Guard `while fast and fast.next` (two-step) to avoid `None.next` crashes.
- Use a **dummy head** whenever the first node might change — far fewer edge cases.
- Drawing 3–4 nodes and moving arrows by hand beats guessing.

## Related
- Fast/slow is the [[arrays-03-two-pointers|two-pointer]] idea on nodes
- LRU Cache combines this with [[hashing-01-fundamentals|hashing]]; Merge-K uses [[heap]]
