---
title: Linked List 02 · Reverse & Fast/Slow
phase: 2
tags: [dsa, linked-list, two-pointers]
group: Linked List
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Reverse a list (the most important move)
Re-point each `next` backward, carrying a `prev`. **Save `next` before you overwrite it.**
```
 before: 1 -> 2 -> 3 -> None
 after:  None <- 1 <- 2 <- 3      return prev (= 3)
```
```python
def reverse(head):
    prev = None
    while head:
        nxt = head.next      # 1. save the rest
        head.next = prev     # 2. flip the pointer
        prev = head          # 3. prev moves up
        head = nxt           # 4. head moves up
    return prev
```

## Fast / slow pointers
`slow` steps 1, `fast` steps 2. Two classic uses:

**Middle of the list** — when `fast` reaches the end, `slow` is at the middle.
```python
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

**Cycle detection (Floyd's)** — if there's a loop, fast laps slow and they meet.
```
 1 -> 2 -> 3 -> 4
           ^---------/      fast & slow eventually collide inside the loop
```
```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False
```

**Find the cycle's start** — after they meet, move one pointer to head; advance both
by 1; they meet at the entry (a known math result).
```python
def cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            p = head
            while p is not slow:
                p, slow = p.next, slow.next
            return p
    return None
```

## Complexity
All **O(n)** time, **O(1)** space (iterative). Recursive reverse is O(n) stack space.

## Canonical problems
| Problem | Move |
|---|---|
| Reverse Linked List | reverse |
| Middle of the Linked List | fast/slow |
| Linked List Cycle I / II | Floyd's; II = find entry |
| Palindrome Linked List | find middle → reverse 2nd half → compare |
| Reorder List | middle → reverse → merge ([[linked-list-03-advanced]]) |

## Gotchas
- In reverse, **save `head.next` first** or you lose the remaining list.
- Loop guard is `while fast and fast.next` (you take two steps).
- Reversing a *sublist* (Reverse Nodes in k-Group) — track the boundary nodes carefully;
  a dummy head helps.

## Next
- [[linked-list-03-advanced]] — merge, reorder, remove-Nth, LRU
