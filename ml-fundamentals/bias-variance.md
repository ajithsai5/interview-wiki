---
title: Bias-Variance Tradeoff
phase: 5
tags: [ml, fundamentals]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

# Bias-Variance Tradeoff

## 60-second answer
Total error on unseen data breaks into three parts: **bias**, **variance**, and
irreducible noise. Bias is error from the model being too simple to capture the
real pattern — it underfits, and it's wrong in the same way every time. Variance
is error from the model being too sensitive to the particular training set — it
overfits, learning the noise, so it swings wildly if you reshuffle the data.
The tradeoff: making the model more flexible lowers bias but raises variance, and
vice versa. The goal isn't to kill either one — it's to find the sweet spot that
minimizes *total* test error. In practice I diagnose it from the gap between
training and validation error: low train + high val = variance problem; high on
both = bias problem.

## Why it matters / when used
This is the lens for every "my model isn't working" question. It tells you
*which direction to move*: a high-bias model needs more capacity / features /
less regularization; a high-variance model needs more data, regularization, or a
simpler model.

## The details
Expected test error at a point decomposes as:

```
E[(y - f̂(x))²] = Bias[f̂(x)]² + Var[f̂(x)] + σ²(irreducible noise)
```

- **Bias** = error from wrong assumptions (linear model on a curved relationship).
  Adding capacity ↓ bias.
- **Variance** = how much `f̂` changes across different training sets. More
  capacity / fewer samples ↑ variance.
- **Irreducible noise** (σ²) = floor you can't beat; it's in the data itself.

Diagnosis from learning curves:
| Train err | Val err | Verdict | Fix |
|-----------|---------|---------|-----|
| high | high | underfit / high bias | bigger model, more features, train longer, less [[regularization]] |
| low | high | overfit / high variance | more data, [[regularization]], simpler model, early stopping |
| low | low | well-fit | ship it |

Levers that trade along the curve: model complexity, regularization strength,
amount of training data (more data shrinks variance, not bias), ensembling
(bagging ↓ variance, boosting ↓ bias).

## Common interview questions
- "Your model has 99% train accuracy and 70% test — what's happening and what do
  you do?" → high variance; regularize / more data / simplify.
- "Does more data always help?" → mainly for variance; won't fix a high-bias model.
- "Where does deep learning sit?" → big nets are high-capacity (low bias) but
  modern regularization (dropout, weight decay, augmentation, early stopping)
  controls the variance.

## Related
- [[regularization]] — the main knob for pulling down variance
- [[metrics]] — how you actually measure the train/val gap
