---
title: Linked List 01 · Basics
phase: 2
tags: [dsa, linked-list, basics]
group: Linked List
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## What a linked list is
A chain of **nodes**, each holding a value and a pointer to the `next` node. Unlike an
array, elements aren't contiguous in memory — so **no O(1) random access** (no `list[i]`),
but **O(1) insert/delete** once you hold the node.
```
 [1|·]──▶[2|·]──▶[3|·]──▶[4|None]
  head                     tail
 array vs list:  array = O(1) access, O(n) insert-middle
                 list  = O(n) access, O(1) insert/delete given the node
```
```python
class ListNode:
    def __init__(self, val=0, nxt=None):
        self.val, self.next = val, nxt
```

## Traverse
```python
node = head
while node:
    print(node.val)
    node = node.next        # advance — forgetting this = infinite loop
```
Count / find length:
```python
def length(head):
    n = 0
    while head:
        n += 1; head = head.next
    return n
```

## The dummy-head trick (use it constantly)
Put a throwaway node **before** the head. Now the "first real node" is never a special
case — building, inserting, and deleting are all uniform, and you `return dummy.next`.
```
 dummy ─▶ [1] ─▶ [2] ─▶ [3]
 build/remove always have a node "before" the one you touch -> no head edge case
```
```python
def build_from(values):
    dummy = tail = ListNode()
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next
```

## Insert / delete (given the previous node)
```
 delete the node AFTER prev:
   prev ─▶ X ─▶ Y      becomes     prev ─▶ Y     (X unlinked)
 insert N after prev:
   prev ─▶ Y           becomes     prev ─▶ N ─▶ Y
```
```python
def delete_after(prev):
    if prev and prev.next:
        prev.next = prev.next.next      # unlink

def insert_after(prev, val):
    prev.next = ListNode(val, prev.next)
```

## Singly vs doubly
- **Singly** (`next` only) — most problems; O(1) forward moves.
- **Doubly** (`prev` + `next`) — needed when you must unlink a node in O(1) from
  *anywhere* (e.g., LRU cache, [[linked-list-03-advanced]]).

## Complexity
| Operation | Cost |
|---|---|
| Access by position | **O(n)** (must walk) |
| Insert / delete given the node | **O(1)** |
| Search by value | O(n) |
| Get length | O(n) |

## Canonical problems
| Problem | Approach |
|---|---|
| Middle of the Linked List | fast/slow ([[linked-list-02-reverse-fastslow]]) |
| Remove Linked List Elements | dummy head + skip matches |
| Design Linked List | implement get/add/delete with indices |
| Convert Binary Number in a Linked List | walk, `res = res*2 + node.val` |

## Variations & follow-ups
- "Delete a node given only that node" (no head) → copy next node's value into it, skip
  the next node.
- Doubly linked + hashmap → O(1) LRU cache.
- Sentinel **head and tail** dummies make doubly-linked edits cleanest.

## Gotchas
- **Always advance** the pointer in a loop, or you spin forever.
- Use a **dummy head** whenever the first node might change — removes edge cases.
- Check `node` and `node.next` exist before dereferencing `node.next.next`.

## Next
- [[linked-list-02-reverse-fastslow]] — reversal and fast/slow pointers
