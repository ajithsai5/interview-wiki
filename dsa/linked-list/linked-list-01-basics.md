---
title: Linked List 01 · Basics
phase: 2
tags: [dsa, linked-list, basics]
group: Linked List
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## What a linked list is
A chain of **nodes**, each holding a value and a pointer to the `next` node. Unlike an
array, elements aren't contiguous — so **no random access** (no `list[i]` in O(1)),
but **O(1) insert/delete** if you have the node.
```
 [1|·]──▶[2|·]──▶[3|·]──▶[4|None]
  head                     tail
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

## The dummy-head trick (use it constantly)
Put a throwaway node **before** the head. Now the "first real node" is never a special
case — building/removing is uniform, and you return `dummy.next`.
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
   prev ─▶ X ─▶ Y      becomes     prev ─▶ Y
   prev.next = prev.next.next
```
```python
def delete_after(prev):
    if prev and prev.next:
        prev.next = prev.next.next      # unlink; X is gone
```

## Complexity
| Operation | Cost |
|---|---|
| Access by position | **O(n)** (must walk) |
| Insert / delete given the node | **O(1)** |
| Search | O(n) |

## Gotchas
- **Always advance** the pointer in a loop, or you spin forever.
- Use a **dummy head** whenever the first node might change — removes edge cases.
- Check `node` and `node.next` before dereferencing `node.next.next`.

## Next
- [[linked-list-02-reverse-fastslow]] — reversal and fast/slow pointers
