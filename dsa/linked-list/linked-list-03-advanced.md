---
title: Linked List 03 · Advanced
phase: 2
tags: [dsa, linked-list, heap]
group: Linked List
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Merge two sorted lists (dummy head)
```python
def merge_two(a, b):
    dummy = tail = ListNode()
    while a and b:
        if a.val <= b.val: tail.next, a = a, a.next
        else:              tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b           # attach whatever remains
    return dummy.next
```

## Remove Nth node from the end (two pointers, one pass)
Advance `fast` n steps first; then move both until `fast` hits the end — `slow` lands
just before the target. A dummy head handles "remove the head".
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

## Add Two Numbers (digits in reverse, carry)
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
`L0→L1→…→Ln` becomes `L0→Ln→L1→Ln-1→…` — **find middle → reverse 2nd half → merge alternately.**

## Merge K sorted lists (heap)
Push each list's head into a min-heap; pop the smallest, advance that list. O(N log k).
```python
import heapq
def merge_k(lists):
    h = [(n.val, i, n) for i, n in enumerate(lists) if n]
    heapq.heapify(h)
    dummy = tail = ListNode()
    while h:
        _, i, node = heapq.heappop(h)
        tail.next = node; tail = node
        if node.next:
            heapq.heappush(h, (node.next.val, i, node.next))
    return dummy.next
```

## LRU Cache — hashmap + doubly linked list
O(1) get/put: a **hashmap** (key → node) for lookup, a **doubly linked list** ordered
by recency (most-recent at one end). On access, move the node to the front; when full,
evict the node at the back.
```
 map: key -> node          list: [MRU] <-> ... <-> [LRU]
 get/put -> move node to MRU end; evict from LRU end when over capacity
```

## Complexity
Merge two / remove-Nth / add: O(n). Merge-K: O(N log k). LRU get/put: **O(1)**.

## Canonical problems
| Problem | Tools |
|---|---|
| Merge Two Sorted Lists | dummy head |
| Remove Nth Node From End | two pointers + dummy |
| Add Two Numbers | dummy + carry |
| Reorder List | middle + reverse + merge |
| Merge K Sorted Lists | min-heap ([[heap-00-roadmap]]) |
| LRU Cache | hashmap + doubly linked list |

## Gotchas
- `tail.next = a or b` cleanly attaches the leftover tail in a merge.
- LRU needs a **doubly** linked list (O(1) unlink) plus the hashmap — singly isn't enough.
- Always return `dummy.next`, never the dummy.

## Related
- Builds on [[linked-list-02-reverse-fastslow]]; uses [[heap-00-roadmap]] and [[hashing-00-roadmap]]
- Back to [[linked-list-00-roadmap]]
