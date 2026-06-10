---
title: Linked List 02 · Reverse & Fast/Slow
phase: 2
tags: [dsa, linked-list, two-pointers]
group: Linked List
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## Reverse a list (the most important move)
Re-point each `next` backward, carrying a `prev`. **Save `next` before you overwrite it.**

### Dry run on `1 -> 2 -> 3`
```
 prev=None head=1 :  nxt=2; 1.next=None; prev=1; head=2
 prev=1    head=2 :  nxt=3; 2.next=1;    prev=2; head=3
 prev=2    head=3 :  nxt=None;3.next=2;  prev=3; head=None
 head=None -> return prev (3):   3 -> 2 -> 1 -> None
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
Recursive version (O(n) stack):
```python
def reverse_rec(head):
    if not head or not head.next:
        return head
    new_head = reverse_rec(head.next)
    head.next.next = head        # the node ahead now points back
    head.next = None
    return new_head
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
    return slow                 # for even length, the 2nd middle
```

**Cycle detection (Floyd's)** — in a loop, fast laps slow and they collide.
```
 1 -> 2 -> 3 -> 4
           ^---------/      slow & fast eventually meet inside the loop
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

**Find the cycle's start** — after they meet, move one pointer to head; advance both by
1; they meet at the entry. (Why: the distance from head to entry equals the distance
from the meeting point to the entry, mod the loop length.)
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
| Problem | Approach |
|---|---|
| Reverse Linked List | iterative `prev` flip |
| Reverse Linked List II (sub-range) | reverse between two boundary nodes |
| Reverse Nodes in k-Group | reverse each k-block, reconnect (hard) |
| Middle of the Linked List | fast/slow |
| Linked List Cycle I / II | Floyd's; II finds the entry |
| Palindrome Linked List | middle → reverse 2nd half → compare |
| Reorder List | middle → reverse → merge ([[linked-list-03-advanced]]) |

## Variations & follow-ups
- "Is it a palindrome in O(1) space?" → reverse the second half in place, compare, then
  (politely) restore it.
- Reverse only a **sub-list** → use a dummy head and track the node *before* the range.
- k-Group → check there are k nodes left before reversing each block.

## Gotchas
- In reverse, **save `head.next` first** or you lose the remaining list.
- Loop guard is `while fast and fast.next` (you take two steps) — order matters to avoid
  `None.next`.
- For "middle", decide whether you want the **first or second** middle on even lengths.

## Next
- [[linked-list-03-advanced]] — merge, reorder, remove-Nth, LRU
