/* ML System Design — pushes notes into window.WIKI_NOTES */
window.WIKI_NOTES = window.WIKI_NOTES || [];
window.WIKI_NOTES.push(

{
  id: "ml-system-design-framework",
  title: "ML System Design Framework",
  domain: "ML System Design",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["system-design", "framework", "interview-staple"],
  related: ["rec-system-design", "model-serving", "feature-engineering", "ab-testing"],
  body: `
## TL;DR
ML system design interviews reward **structure**, not a perfect model. Clarify the problem, frame it as ML, define metrics, then walk data \u2192 features \u2192 model \u2192 serving \u2192 monitoring. Talk tradeoffs out loud at every step.

## A repeatable 7-step skeleton
1. **Clarify & scope** \u2014 What exactly are we predicting? Scale (QPS, users, latency budget)? Online or batch? What does "good" mean to the business?
2. **Frame as ML** \u2014 Map the product goal to a concrete task (classification / ranking / regression / generation). State inputs, outputs, and the label \u2014 *how do we even get labels?*
3. **Metrics** \u2014 **Offline** (AUC, NDCG, MAE\u2026) to iterate, **online** (CTR, revenue, retention) to decide. Note proxy-vs-true-objective gaps and guardrail metrics.
4. **Data & [[Feature Engineering & Stores|features]]** \u2014 Sources, labeling, leakage, freshness, imbalance. Train/serve consistency.
5. **Model** \u2014 Baseline first (logistic reg / GBT), then justify complexity. Discuss the bias/variance and latency tradeoffs.
6. **[[Model Serving & Inference|Serving]]** \u2014 Batch vs real-time, latency/throughput, caching, candidate generation \u2192 ranking, fallback.
7. **Evaluate & monitor** \u2014 [[A/B Testing & Online Evaluation|A/B test]], watch drift, retraining cadence, feedback loops.

## Things that impress
- Starting with a **baseline** and adding complexity only when justified.
- Naming the **label-generation** strategy (often the hardest real-world part).
- Calling out **train/serve skew**, **feedback loops**, and **data leakage** unprompted.
- Tying every metric back to the business objective.

## Say it out loud
> "Let me first clarify the objective and scale, frame it as a concrete ML task, and decide how we get labels. Then I'll define offline and online metrics, design the data and feature pipeline, start from a simple baseline, lay out serving for the latency budget, and finish with A/B testing and monitoring for drift."

## Likely questions
- *Design the feed ranking / recommendations / fraud detection / search.*
- *How would you get labels for this?*
- *Offline metric improved but the A/B test was flat \u2014 why?*
`,
},

{
  id: "rec-system-design",
  title: "Recommendation & Ranking Systems",
  domain: "ML System Design",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["recsys", "ranking", "retrieval", "two-tower"],
  related: ["ml-system-design-framework", "embeddings", "feature-engineering", "ab-testing"],
  body: `
## TL;DR
At scale you can't rank millions of items per request, so recommenders use a **multi-stage funnel**: cheap **candidate generation** (retrieval) narrows millions \u2192 hundreds, then an expensive **ranking** model orders them, then **re-ranking** applies business rules (diversity, freshness, dedupe).

## The funnel
1. **Candidate generation / retrieval** \u2014 fast, high-recall. Two-tower [[Embeddings & Vector Search|embedding]] models + ANN search, plus heuristics (popular, recent, followed). Millions \u2192 ~hundreds.
2. **Ranking** \u2014 heavy model scoring each candidate with rich features (user\u00d7item interactions). Optimizes predicted engagement. Hundreds \u2192 ordered list.
3. **Re-ranking / policy** \u2014 diversity, freshness, fairness, dedupe, ads blending, business rules.

## Collaborative vs content-based
- **Collaborative filtering** \u2014 "users like you liked X" from the interaction matrix. Strong but suffers **cold start** (new users/items).
- **Content-based** \u2014 item/user features; handles cold start.
- **Hybrid** \u2014 the practical norm.

## Hard problems to mention
- **Cold start** \u2014 new users/items have no history (use content features, popularity, exploration).
- **Feedback loops / popularity bias** \u2014 you only get labels for what you showed; the system reinforces itself. Mitigate with exploration / unbiased estimators.
- **Position bias** \u2014 higher-ranked items get more clicks regardless of relevance.
- **Implicit feedback** \u2014 clicks aren't ground-truth relevance; no true negatives.

## Say it out loud
> "I'd use a retrieval-then-ranking funnel: a two-tower model with ANN for high-recall candidate generation, a heavy ranker with cross features for precision, and a re-ranking layer for diversity and business rules. Then I'd flag cold start, position bias, and feedback loops as the real challenges."

## Likely questions
- *Why a multi-stage funnel instead of one model?*
- *How do you handle cold start?*
- *Why are implicit-feedback labels tricky?*
`,
},

{
  id: "model-serving",
  title: "Model Serving & Inference",
  domain: "ML System Design",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["serving", "latency", "batch", "caching"],
  related: ["ml-system-design-framework", "quantization", "feature-engineering", "model-monitoring"],
  body: `
## TL;DR
Serving is where ML meets SRE: hit a **latency budget** at the required **throughput** and cost. The first fork is **batch vs online**; then latency tactics (caching, batching, quantization), and always a **fallback**.

## Batch vs online
- **Batch (offline)** \u2014 precompute predictions on a schedule, store in a key-value cache, serve by lookup. Cheap, simple, but stale; great when inputs change slowly (daily recs, churn scores).
- **Online (real-time)** \u2014 compute per request. Fresh, handles novel inputs, but you own the latency/throughput problem.
- **Streaming / near-real-time** \u2014 in between (feature updates via a stream).

## Latency & throughput tactics
- **Caching** \u2014 cache predictions or expensive features for hot keys.
- **Batching** \u2014 group requests to exploit GPU parallelism (trade a little latency for throughput).
- **[[Quantization & Efficient Inference|Quantization]] / distillation** \u2014 smaller, faster models.
- **Multi-stage** \u2014 cheap filter model \u2192 expensive model only on survivors (see the [[Recommendation & Ranking Systems|ranking funnel]]).
- **Autoscaling + load balancing** for traffic spikes.

## Reliability essentials
- **Fallbacks** \u2014 if the model times out, serve popularity/heuristics, never an error.
- **Train/serve skew** \u2014 features must be computed identically in training and serving (a [[Feature Engineering & Stores|feature store]] enforces this).
- **Shadow / canary deploys** \u2014 test a new model on live traffic before full rollout.

## Say it out loud
> "First I'd decide batch vs online from freshness and latency needs. For online I'd set a latency budget, then use caching, request batching, and a smaller/quantized model to hit it, with a heuristic fallback and a feature store to avoid train/serve skew."

## Likely questions
- *Batch vs online inference \u2014 tradeoffs and examples?*
- *Your model's p99 latency is too high \u2014 what do you do?*
- *What is train/serve skew and how do you prevent it?*
`,
},

{
  id: "feature-engineering",
  title: "Feature Engineering & Stores",
  domain: "ML System Design",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["features", "feature-store", "leakage", "encoding"],
  related: ["ml-system-design-framework", "model-serving", "cross-validation", "rec-system-design"],
  body: `
## TL;DR
Features are usually the highest-leverage part of a classical ML system. The craft is turning raw data into informative, leak-free signals \u2014 and a **feature store** keeps the same definitions in training and serving so you avoid train/serve skew.

## Common transformations
- **Numeric** \u2014 scaling/standardization, log transform for skew, binning, clipping outliers.
- **Categorical** \u2014 one-hot (low cardinality), target/mean encoding (high cardinality, *leakage-prone* \u2014 compute within CV folds), embeddings (very high cardinality).
- **Temporal** \u2014 recency, rolling aggregates, time-since-last-event, cyclical encodings (hour/day as sin/cos).
- **Interactions** \u2014 cross features (user \u00d7 item), ratios.
- **Text/image** \u2014 [[Embeddings & Vector Search|embeddings]].

## Leakage \u2014 the cardinal sin
A feature that encodes the future or the label inflates offline metrics and collapses in production. Watch: target encoding without folds, post-event aggregates, time-traveling joins. (See [[Cross-Validation & Data Splits|leakage]].)

## Feature stores
A system that defines features once and serves them two ways:
- **Offline** \u2014 historical, **point-in-time correct** values for training (no future leakage).
- **Online** \u2014 low-latency lookups for serving.

The point: **train/serve consistency**. The same code/definition produces both, eliminating skew \u2014 a top cause of "great offline, bad online".

## Say it out loud
> "I'd engineer recency and aggregate features, encode high-cardinality categories with target encoding inside CV folds to avoid leakage, and serve everything through a feature store so training and serving use point-in-time-correct, identical definitions."

## Likely questions
- *How do you encode a high-cardinality categorical?*
- *What is a feature store and what problem does it solve?*
- *Give examples of feature leakage.*
`,
},

{
  id: "ab-testing",
  title: "A/B Testing & Online Evaluation",
  domain: "ML System Design",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["ab-testing", "experimentation", "statistics", "metrics"],
  related: ["ml-system-design-framework", "model-serving", "probability"],
  body: `
## TL;DR
Offline metrics tell you a model is *different*; an **A/B test** tells you it's *better* for users. Randomly split traffic, run long enough for significance, and judge on the true business metric plus guardrails.

## How it works
- **Randomize** users (not requests) into control vs treatment so the only systematic difference is the model.
- Pick a **primary metric** (the decision metric: revenue, retention, CTR), plus **guardrails** (latency, complaints, churn) that must not regress.
- Run until you hit the **sample size** for your minimum detectable effect, then test significance.

## Stats you should name
- **p-value / significance** \u2014 chance of seeing this effect if there were truly no difference.
- **Statistical power** \u2014 chance of detecting a real effect; drives sample size.
- **Peeking problem** \u2014 repeatedly checking and stopping at significance inflates false positives. Fix the horizon up front or use sequential testing.
- **Multiple comparisons** \u2014 testing many metrics \u2192 correct (Bonferroni/FDR).

## Pitfalls
- **Novelty effect** \u2014 early bump that fades; run long enough.
- **Network effects** \u2014 treatment leaks to control (marketplaces, social) \u2192 use cluster/geo randomization.
- **Simpson's paradox** \u2014 aggregate reverses within segments.
- Offline\u2013online gap: better AUC, flat A/B \u2014 the offline metric was a poor proxy, or there's train/serve skew.

## Say it out loud
> "I'd randomize users into control and treatment, pre-register a primary metric and guardrails, size the experiment for the minimum detectable effect, and avoid peeking. Then I'd watch for novelty and network effects before trusting the result."

## Likely questions
- *Walk through designing an A/B test for a new model.*
- *Offline metric up, A/B flat \u2014 explain.*
- *What is the peeking problem?*
`,
}

);
