---
title: Linked List 03 · Advanced
phase: 2
tags: [dsa, linked-list, heap, hashing]
group: Linked List
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## Merge two sorted lists (dummy head)
Walk both, attach the smaller head, advance. The dummy means no special-casing the
first node.
```python
def merge_two(a, b):
    dummy = tail = ListNode()
    while a and b:
        if a.val <= b.val: tail.next, a = a, a.next
        else:              tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b           # attach whatever remains (one list is empty)
    return dummy.next
```

## Remove Nth node from the end (two pointers, one pass)
Advance `fast` n steps first; then move both until `fast` hits the end — `slow` lands
just **before** the target. A dummy head handles "remove the head".
```
 n=2:  dummy -> 1 -> 2 -> 3 -> 4 -> 5
 fast starts 2 ahead; when fast hits the last node, slow is before the 4th (=2nd from end)
```
```python
def remove_nth(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n):
        fast = fast.next
    while fast.next:
        fast, slow = fast.next, slow.next
    slow.next = slow.next.next   # skip the nth-from-end
    return dummy.next
```

## Add Two Numbers (digits stored in reverse, carry)
```python
def add_two(l1, l2):
    dummy = tail = ListNode()
    carry = 0
    while l1 or l2 or carry:
        s = carry + (l1.val if l1 else 0) + (l2.val if l2 else 0)
        carry, digit = divmod(s, 10)
        tail.next = ListNode(digit); tail = tail.next
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    return dummy.next
```

## Reorder List (combine the moves)
`L0→L1→…→Ln` becomes `L0→Ln→L1→Ln-1→…` — **find middle → reverse 2nd half → merge
alternately**. Each step is from [[linked-list-02-reverse-fastslow]].
```python
def reorder(head):
    if not head or not head.next: return
    # 1) middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow, fast = slow.next, fast.next.next
    # 2) reverse second half
    second = slow.next; slow.next = None; prev = None
    while second:
        second.next, prev, second = prev, second, second.next
    # 3) merge two halves
    first, second = head, prev
    while second:
        first.next, first = second, first.next
        second.next, second = first, second.next
```

## Merge K sorted lists (heap)
Push each list's head into a min-heap; pop the smallest, advance that list. **O(N log k)**
for N total nodes, k lists.
```python
import heapq
def merge_k(lists):
    h = [(n.val, i, n) for i, n in enumerate(lists) if n]   # i breaks val ties
    heapq.heapify(h)
    dummy = tail = ListNode()
    while h:
        _, i, node = heapq.heappop(h)
        tail.next = node; tail = node
        if node.next:
            heapq.heappush(h, (node.next.val, i, node.next))
    return dummy.next
```
(Alternative: divide-and-conquer pairwise merges, also O(N log k).)

## LRU Cache — hashmap + doubly linked list
O(1) get/put: a **hashmap** (key → node) for lookup, plus a **doubly linked list**
ordered by recency. On access, move the node to the front (most-recent); when over
capacity, evict the node at the back (least-recent).
```
 map: key -> node            list:  [MRU] <-> ... <-> [LRU]
 get(k):  move node to MRU end, return value
 put(k):  upsert node at MRU end; if size > cap, unlink LRU and delete from map
```
A doubly linked list is required so any node unlinks in O(1).

## Complexity
Merge-two / remove-Nth / add / reorder: O(n). Merge-K: O(N log k). LRU get/put: **O(1)**.

## Canonical problems
| Problem | Tools |
|---|---|
| Merge Two Sorted Lists | dummy head |
| Remove Nth Node From End | two pointers + dummy |
| Add Two Numbers | dummy + carry |
| Reorder List | middle + reverse + merge |
| Merge K Sorted Lists | min-heap ([[heap-00-roadmap]]) |
| Copy List with Random Pointer | hashmap old→new, or interleave |
| LRU Cache | hashmap + doubly linked list |

## Variations & follow-ups
- **LFU Cache** → hashmap + per-frequency doubly linked lists (harder).
- "Copy List with Random Pointer" → either a `map` of old→new nodes, or weave copies
  between originals to find randoms in O(1) space.
- Merge-K with a known small k → divide-and-conquer can beat the heap constant.

## Gotchas
- `tail.next = a or b` cleanly attaches the leftover tail in a merge.
- LRU needs a **doubly** linked list (O(1) unlink) **plus** the hashmap — singly isn't enough.
- Always return `dummy.next`, never the dummy itself.

## Related
- Builds on [[linked-list-02-reverse-fastslow]]; uses [[heap-00-roadmap]] and [[hashing-00-roadmap]]
- Back to [[linked-list-00-roadmap]]
