/* MLOps & Infra + Math Foundations — pushes notes into window.WIKI_NOTES */
window.WIKI_NOTES = window.WIKI_NOTES || [];
window.WIKI_NOTES.push(

/* ---------------- MLOps & Infra ---------------- */
{
  id: "model-monitoring",
  title: "Monitoring & Data Drift",
  domain: "MLOps & Infra",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["monitoring", "drift", "data-quality", "production"],
  related: ["ml-deployment", "model-serving", "ab-testing"],
  body: `
## TL;DR
A model that was great at launch silently rots as the world changes. Monitoring catches it: track **data quality**, **drift**, and **model performance**, and alert before users feel it. "Deploy and forget" is the classic ML failure.

## What to monitor (layers)
1. **System/ops** \u2014 latency, throughput, error rate, resource use. Standard SRE.
2. **Data quality** \u2014 schema changes, nulls, ranges, volume. Most production incidents are *data* problems, not model problems.
3. **Drift** \u2014 the inputs/labels shift away from training.
4. **Model performance** \u2014 accuracy/AUC/business metric \u2014 *when labels arrive* (often delayed).

## Drift types
- **Data / covariate drift** \u2014 P(X) changes; input distribution moves (new user segment, seasonality). Detect by comparing distributions (PSI, KL divergence, KS test) vs a reference window.
- **Concept drift** \u2014 P(Y|X) changes; the *relationship* changes (fraud tactics evolve, post-COVID behavior). The model's logic is now wrong even if inputs look normal.
- **Label drift** \u2014 P(Y) changes.

## The label-delay problem
You often can't measure accuracy live because ground truth arrives late (did this loan default? did the user churn?). So you lean on **proxy signals**: input drift, prediction-distribution shift, and delayed performance backfills.

## Responding
- Alert \u2192 investigate (data bug vs real drift) \u2192 retrain on fresh data or roll back.
- **Retraining cadence** \u2014 scheduled, or triggered by drift/performance thresholds.
- Keep a [[Monitoring & Data Drift|reference dataset]] and automated retraining + [[ML Deployment & CI/CD|canary]] rollout.

## Say it out loud
> "I'd monitor four layers: ops, data quality, drift, and performance. Covariate drift is P(X) moving; concept drift is P(Y|X) moving and is more dangerous. Since labels lag, I rely on input/prediction drift as early proxies and trigger retraining + canary deploys."

## Likely questions
- *Data drift vs concept drift?*
- *How do you monitor accuracy when labels are delayed?*
- *When/how do you decide to retrain?*
`,
},

{
  id: "ml-deployment",
  title: "ML Deployment & CI/CD",
  domain: "MLOps & Infra",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["deployment", "ci-cd", "canary", "reproducibility"],
  related: ["model-monitoring", "model-serving", "ab-testing"],
  body: `
## TL;DR
Shipping a model safely means versioning **data + code + model**, testing more than software (the data and the model behavior), and rolling out gradually with a fast rollback. ML adds data/model dimensions on top of normal CI/CD.

## What must be versioned (reproducibility)
- **Code** (git), **data** (snapshot/hash, e.g. DVC), **model artifact**, **environment**, **hyperparameters/config**.
- A **model registry** stores versioned artifacts with lineage \u2192 you can reproduce and roll back any prediction.

## Testing pyramid for ML
- **Code** \u2014 unit/integration tests as usual.
- **Data** \u2014 validation (schema, ranges, nulls) before training/serving.
- **Model** \u2014 minimum quality bar on a holdout, behavioral tests (invariances, known cases), no regression vs current prod.
- **Train/serve consistency** \u2014 same feature code both sides (a [[Feature Engineering & Stores|feature store]] helps).

## Rollout strategies
- **Shadow** \u2014 new model runs on live traffic, predictions logged but **not served**. Zero user risk; compare to prod.
- **Canary** \u2014 route a small % of traffic to the new model, watch metrics, ramp up.
- **A/B** \u2014 a controlled [[A/B Testing & Online Evaluation|experiment]] to prove it's *better*, not just non-breaking.
- **Blue-green** \u2014 instant switch + instant rollback.

## Say it out loud
> "I version data, code, and the model in a registry for reproducibility, add data-validation and model-quality gates to CI, then roll out via shadow then canary while [[Monitoring & Data Drift|monitoring]], with a blue-green switch for instant rollback."

## Likely questions
- *What's different about CI/CD for ML vs software?*
- *Shadow vs canary deployment?*
- *How do you make a prediction reproducible?*
`,
},

/* ---------------- Math Foundations ---------------- */
{
  id: "linear-algebra",
  title: "Linear Algebra Essentials",
  domain: "Math Foundations",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["linear-algebra", "matrix", "eigen", "svd"],
  related: ["optimization-convexity", "probability", "embeddings"],
  body: `
## TL;DR
ML is linear algebra at scale: data is matrices, models are matrix multiplies, and learning moves vectors in high-dimensional space. Know matrix multiply, dot products, norms, eigen/SVD, and what each *means*.

## The must-knows
- **Vectors & dot product** \u2014 <code>a\u00b7b = |a||b|cos\u03b8</code>. Measures alignment \u2192 the basis of **cosine similarity** for [[Embeddings & Vector Search|embeddings]].
- **Matrix multiply** \u2014 a linear transformation / change of basis; the core op in every neural net layer. Inner dims must match: (m\u00d7k)(k\u00d7n) = (m\u00d7n).
- **Norms** \u2014 L2 (Euclidean length), L1 (sum of abs) \u2014 same norms used in [[Overfitting & Regularization|regularization]].
- **Rank** \u2014 number of independent dimensions; **low-rank** structure is why [[Fine-Tuning vs Prompting|LoRA]] and compression work.

## Eigenvalues & SVD (the interview favorites)
- **Eigenvector/eigenvalue** \u2014 <code>A v = \u03bb v</code>: a direction the transform only scales (by \u03bb), doesn't rotate.
- **SVD** \u2014 <code>A = U \u03a3 V\u1d40</code>: factor any matrix into rotate\u2013scale\u2013rotate. The singular values rank directions by importance.
- **PCA** \u2014 dimensionality reduction = keep the top singular vectors (directions of max variance). Used for compression, denoising, visualization.

## Why it matters in ML
- Forward pass = stacked matrix multiplies + nonlinearities.
- PCA/SVD compress and denoise features.
- Low-rank approximations cut memory/compute (LoRA, quantization-adjacent).

## Say it out loud
> "A matrix multiply is a linear transformation; that's what each layer does. Dot products measure alignment \u2014 cosine similarity for embeddings. SVD factors any matrix into rotate-scale-rotate and ranks directions by importance, which is exactly what PCA exploits for dimensionality reduction."

## Likely questions
- *What does an eigenvector represent geometrically?*
- *How does PCA relate to SVD?*
- *Why is the dot product the basis of cosine similarity?*
`,
},

{
  id: "probability",
  title: "Probability & Statistics",
  domain: "Math Foundations",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["probability", "bayes", "distributions", "clt", "mle"],
  related: ["ab-testing", "loss-functions", "evaluation-metrics"],
  body: `
## TL;DR
Probability is the language of uncertainty in ML. Master Bayes' theorem, the common distributions, expectation/variance, the CLT, and MLE \u2014 they underpin loss functions, evaluation, and [[A/B Testing & Online Evaluation|experimentation]].

## Bayes' theorem
<pre><code>P(A|B) = P(B|A) * P(A) / P(B)</code></pre>
Update a **prior** with **evidence** to get a **posterior**. The classic trap: with a rare disease, even a very accurate test yields many false positives \u2014 because the base rate P(disease) is tiny. Always reason about base rates.

## Distributions to know
- **Bernoulli / Binomial** \u2014 single / repeated yes-no trials (clicks, conversions).
- **Normal (Gaussian)** \u2014 the default for continuous; central to the CLT.
- **Poisson** \u2014 counts of rare events per interval (arrivals, defects).
- **Exponential** \u2014 time between events.

## Core results
- **Expectation & variance** \u2014 mean and spread; <code>Var(X) = E[X\u00b2] - E[X]\u00b2</code>.
- **Central Limit Theorem** \u2014 sums/means of many independent variables tend Normal regardless of the underlying distribution \u2192 why we can use normal-based confidence intervals in A/B tests.
- **Law of large numbers** \u2014 sample mean \u2192 true mean as n grows.

## Estimation
- **MLE** \u2014 pick parameters that maximize the likelihood of the observed data. Minimizing [[Loss Functions|cross-entropy]] *is* MLE; minimizing MSE is MLE under Gaussian noise.
- **MAP** \u2014 MLE + a prior (\u2248 MLE with [[Overfitting & Regularization|regularization]]).

## Say it out loud
> "Bayes updates a prior with evidence \u2014 and base rates dominate, which is why accurate tests still mislead on rare conditions. The CLT is why sample means are roughly normal, justifying A/B confidence intervals. And MLE connects directly to our losses: cross-entropy and MSE are MLE under different noise assumptions."

## Likely questions
- *Disease-test / base-rate Bayes problem.*
- *State the CLT and why it matters for A/B testing.*
- *What is MLE, and how does it relate to the loss function?*
`,
},

{
  id: "optimization-convexity",
  title: "Optimization & Convexity",
  domain: "Math Foundations",
  difficulty: "advanced",
  updated: "2026-05-29",
  tags: ["convex", "optimization", "gradients", "saddle-points"],
  related: ["gradient-descent", "linear-algebra", "loss-functions"],
  body: `
## TL;DR
Training = minimizing a loss. **Convex** problems have one global minimum that [[Gradient Descent & Optimizers|gradient descent]] reliably finds; deep nets are **non-convex** with many local minima and saddle points \u2014 yet still optimize well in practice.

## Convex vs non-convex
- **Convex** \u2014 a bowl: any local minimum is the global minimum. [[Logistic Regression|Logistic regression]], linear regression, SVMs. Optimization is "easy" and reproducible.
- **Non-convex** \u2014 a mountain range: many local minima, plateaus, **saddle points**. Neural nets. No global-optimum guarantee.

## Why deep nets train anyway
- In high dimensions, most critical points are **saddle points**, not bad local minima \u2014 and SGD's noise helps escape them.
- Many local minima are roughly **equally good**; you don't need the global one.
- This is why initialization, [[Gradient Descent & Optimizers|momentum/Adam]], and learning-rate schedules matter so much.

## Conditioning & curvature
- **Gradient** \u2014 first-order, the slope. **Hessian** \u2014 second-order, the curvature.
- A poorly **conditioned** loss surface (very different curvature per direction) makes plain GD zig-zag \u2192 [[Dropout & Normalization|normalization]] and adaptive optimizers help.
- Second-order methods (Newton) use the Hessian but are too expensive at scale \u2192 we use first-order + tricks.

## Say it out loud
> "Convex losses like logistic regression have a single global min that gradient descent finds reliably. Deep nets are non-convex, but high-dimensional critical points are mostly saddles, many minima are equally good, and SGD noise escapes saddles \u2014 so we optimize fine without global guarantees."

## Likely questions
- *Is logistic regression convex? Is a neural net?*
- *Why doesn't non-convexity stop deep learning?*
- *Gradient vs Hessian \u2014 why don't we use second-order methods at scale?*
`,
}

);
