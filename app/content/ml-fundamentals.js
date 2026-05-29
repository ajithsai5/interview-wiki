/* ML Fundamentals — pushes notes into window.WIKI_NOTES */
window.WIKI_NOTES = window.WIKI_NOTES || [];
window.WIKI_NOTES.push(

{
  id: "bias-variance",
  title: "Bias\u2013Variance Tradeoff",
  domain: "ML Fundamentals",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["generalization", "overfitting", "theory"],
  related: ["overfitting-regularization", "evaluation-metrics", "cross-validation"],
  body: `
## TL;DR
Total expected error decomposes into **bias** (error from wrong assumptions / too-simple model), **variance** (error from sensitivity to the particular training set), and **irreducible noise**. You can usually trade one for the other; the goal is the sweet spot that minimizes their sum.

## Core idea
For squared error, expected test error at a point decomposes as:

<pre><code>E[(y - f_hat(x))^2] = Bias[f_hat]^2 + Var[f_hat] + sigma^2</code></pre>

- **Bias** \u2014 how far the average prediction (over many training sets) is from the truth. High bias \u2192 *underfitting*.
- **Variance** \u2014 how much predictions wobble as the training set changes. High variance \u2192 *overfitting*.
- **Irreducible error** (<code>sigma^2</code>) \u2014 noise in the data; no model can beat it.

## How it shows up
| Symptom | Likely cause | Fix |
|---|---|---|
| High train error **and** high test error | High bias | Bigger model, more features, train longer |
| Low train error, high test error (big gap) | High variance | More data, regularization, simpler model |
| Both low | Good fit | Ship it |

Model **capacity** is the main dial: as capacity rises, bias falls and variance rises. More **training data** mostly attacks variance (the curves converge).

## Say it out loud (whiteboard)
> "I'd plot train and validation error against capacity or epochs. A big gap means variance \u2014 I'd add data or regularize. Both high means bias \u2014 I'd grow the model. This is also why ensembles like [[Trees, Bagging & Boosting|bagging]] help: averaging many high-variance, low-bias trees cuts variance without adding bias."

## Pitfalls
- "More complex model = always better" \u2014 ignores the variance cost.
- Tuning on the test set leaks information and hides variance. Use [[Cross-Validation & Data Splits|proper splits]].
- In deep nets the classic U-curve gets murky (**double descent**): error can drop again past the interpolation threshold.

## Likely questions
- *Define bias and variance and give the decomposition.*
- *Your model has 99% train / 70% test accuracy \u2014 what's wrong and what do you do?* (Variance \u2192 regularize / more data.)
- *Does adding data fix bias?* (No \u2014 it mainly reduces variance.)
`,
},

{
  id: "overfitting-regularization",
  title: "Overfitting & Regularization",
  domain: "ML Fundamentals",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["regularization", "overfitting", "L1", "L2", "dropout"],
  related: ["bias-variance", "cross-validation", "dropout-normalization", "gradient-descent"],
  body: `
## TL;DR
Overfitting = the model memorizes training noise and fails to generalize. Regularization is any technique that constrains the model so it prefers simpler explanations \u2014 trading a little bias for a lot less variance.

## Detecting overfitting
A growing gap between training and validation metrics. Train loss keeps dropping while val loss flattens then **rises** \u2192 stop there.

## The toolbox
**Penalty-based**
- **L2 (ridge / weight decay)** \u2014 adds <code>lambda * sum(w^2)</code>. Shrinks weights smoothly toward zero; handles correlated features gracefully. The default.
- **L1 (lasso)** \u2014 adds <code>lambda * sum(|w|)</code>. Drives some weights to *exactly* zero \u2192 sparse models / feature selection.
- **Elastic net** \u2014 mix of L1 + L2.

> L1 vs L2 intuition: L1's diamond-shaped constraint region has corners on the axes, so the optimum often lands *on* an axis (a zero weight). L2's circular region rarely does.

**Data & architecture**
- **More data** \u2014 the most reliable fix.
- **Data augmentation** \u2014 cheap synthetic variety (flips, crops, noise, paraphrase).
- **[[Dropout & Normalization|Dropout]]** \u2014 randomly zero activations during training; acts like an ensemble.
- **Early stopping** \u2014 halt when val loss stops improving.
- **Reduce capacity** \u2014 fewer params/layers/depth.

## Say it out loud
> "I'd start with weight decay and early stopping, watch the train/val gap, and add augmentation or dropout if the gap stays wide. L1 if I also want feature sparsity."

## Pitfalls
- Too much regularization \u2192 underfitting (back to high [[Bias\u2013Variance Tradeoff|bias]]).
- <code>lambda</code> must be tuned via [[Cross-Validation & Data Splits|cross-validation]], never on test.
- Weight decay and L2 are equivalent for plain SGD but **not** for Adam \u2014 use decoupled weight decay (AdamW).

## Likely questions
- *L1 vs L2 \u2014 when sparse weights?* (L1.)
- *Why does dropout reduce overfitting?* (Prevents co-adaptation; ensemble effect.)
- *Is early stopping regularization?* (Yes \u2014 it limits effective capacity.)
`,
},

{
  id: "evaluation-metrics",
  title: "Evaluation Metrics (Classification)",
  domain: "ML Fundamentals",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["metrics", "precision", "recall", "roc", "auc", "imbalance"],
  related: ["bias-variance", "cross-validation", "logistic-regression"],
  body: `
## TL;DR
Accuracy lies on imbalanced data. Pick metrics from the **confusion matrix** that match the cost of each error type: precision/recall/F1 for thresholded decisions, ROC-AUC / PR-AUC for ranking quality.

## Confusion matrix
|  | Predicted + | Predicted \u2212 |
|---|---|---|
| **Actual +** | TP | FN |
| **Actual \u2212** | FP | TN |

- **Precision** = TP / (TP + FP) \u2014 of those we flagged, how many were right? *Cost of false alarms.*
- **Recall (sensitivity, TPR)** = TP / (TP + FN) \u2014 of all real positives, how many did we catch? *Cost of misses.*
- **F1** = harmonic mean of precision & recall. Use when you need one number and care about both.
- **Specificity (TNR)** = TN / (TN + FP).

## Precision vs recall \u2014 which matters?
- **Cancer screening / fraud** \u2192 recall (missing a positive is catastrophic).
- **Spam filter / search results** \u2192 precision (false positives annoy users).
- They trade off via the decision **threshold**.

## Threshold-free metrics
- **ROC curve** \u2014 TPR vs FPR across all thresholds. **AUC** = probability a random positive ranks above a random negative. 0.5 = chance.
- **PR curve / PR-AUC** \u2014 precision vs recall. **Far more informative than ROC on heavy class imbalance** because it ignores the huge TN count.

## Say it out loud
> "First I'd check class balance. On a 99/1 split I'd ignore accuracy, look at PR-AUC for ranking, then pick an operating threshold from the precision/recall curve based on the business cost of FP vs FN."

## Pitfalls
- Reporting accuracy on imbalanced data (99% accuracy by always predicting the majority).
- Using ROC-AUC when positives are rare \u2014 prefer PR-AUC.
- Forgetting that AUC measures *ranking*, not calibration. If you need real probabilities, check calibration / Brier score.

## Likely questions
- *Precision vs recall, and a scenario for each.*
- *Why is accuracy bad for imbalance? What instead?*
- *What does AUC actually mean?* (Ranking probability above.)
`,
},

{
  id: "gradient-descent",
  title: "Gradient Descent & Optimizers",
  domain: "ML Fundamentals",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["optimization", "sgd", "adam", "learning-rate"],
  related: ["backpropagation", "loss-functions", "overfitting-regularization", "optimization-convexity"],
  body: `
## TL;DR
Gradient descent iteratively steps parameters **downhill** along the negative gradient of the loss. The variants differ in how much data each step uses (batch / mini-batch / stochastic) and how they adapt the step size (momentum, RMSProp, Adam).

## The update
<pre><code>theta = theta - eta * grad(L)</code></pre>
where <code>eta</code> is the learning rate \u2014 the single most important hyperparameter.

## Batch size flavors
- **Batch GD** \u2014 full dataset per step. Stable gradient, slow, memory-heavy.
- **SGD** \u2014 one example per step. Noisy (the noise can help escape sharp minima) but cheap.
- **Mini-batch** \u2014 32\u2013512 examples. The practical default; uses vectorized hardware well.

## Improving plain SGD
- **Momentum** \u2014 accumulate a velocity of past gradients; dampens oscillation in ravines, speeds along consistent directions.
- **RMSProp / AdaGrad** \u2014 per-parameter learning rates scaled by recent gradient magnitude.
- **Adam** \u2014 momentum + RMSProp. Robust default for deep nets. Use **AdamW** (decoupled [[Overfitting & Regularization|weight decay]]) in practice.

## Learning-rate schedules
Warmup (ramp up early to stabilize), then decay (cosine / step / linear). Too high \u2192 diverge / oscillate; too low \u2192 crawl and get stuck.

## Say it out loud
> "I'd default to AdamW with a warmup + cosine schedule, batch size as large as memory allows, and tune the learning rate first \u2014 by orders of magnitude (1e-3, 1e-4)."

## Pitfalls
- Forgetting to shuffle data \u2192 biased mini-batches.
- LR too high: loss explodes to NaN. Too low: looks 'stuck'.
- Not scaling/normalizing features \u2192 elongated loss surface, slow convergence (see [[Dropout & Normalization|normalization]]).

## Likely questions
- *SGD vs batch GD \u2014 tradeoffs?*
- *Why Adam over SGD, and when is plain SGD+momentum better?* (Often generalizes better in vision; Adam converges faster.)
- *What does momentum do geometrically?*
`,
},

{
  id: "loss-functions",
  title: "Loss Functions",
  domain: "ML Fundamentals",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["loss", "cross-entropy", "mse", "objective"],
  related: ["gradient-descent", "logistic-regression", "evaluation-metrics"],
  body: `
## TL;DR
The loss is the objective you minimize \u2014 it encodes what "wrong" costs. Match it to the task: MSE/MAE for regression, cross-entropy for classification.

## Regression
- **MSE (L2)** \u2014 <code>mean((y - y_hat)^2)</code>. Smooth, penalizes large errors heavily \u2192 sensitive to outliers.
- **MAE (L1)** \u2014 <code>mean(|y - y_hat|)</code>. Robust to outliers; gradient is constant (harder near the minimum).
- **Huber** \u2014 quadratic for small errors, linear for large. Best of both.

## Classification
- **Binary cross-entropy** \u2014 pairs with a sigmoid output:
<pre><code>L = -[ y*log(p) + (1-y)*log(1-p) ]</code></pre>
- **Categorical cross-entropy** \u2014 pairs with softmax over K classes; equivalent to maximizing log-likelihood of the true class.

> Why cross-entropy over MSE for classification? With a sigmoid, MSE's gradient contains a <code>sigma'(z)</code> term that vanishes when the model is confidently wrong \u2192 learning stalls. Cross-entropy cancels it, giving a clean, large gradient exactly when you're most wrong.

## Specialized
- **Hinge** \u2014 SVMs (margin maximization).
- **Focal loss** \u2014 down-weights easy examples; great for extreme [[Evaluation Metrics (Classification)|class imbalance]] (dense object detection).
- **Contrastive / triplet / InfoNCE** \u2014 representation & embedding learning.

## Say it out loud
> "Loss is what you optimize; the [[Evaluation Metrics (Classification)|metric]] is what you report. They differ: I optimize cross-entropy but the business cares about F1 at a chosen threshold."

## Pitfalls
- Using MSE for classification \u2192 slow, badly-calibrated learning.
- Numerical instability: use <code>log-sum-exp</code> / "from logits" implementations rather than computing softmax then log.
- Confusing the loss with the metric.

## Likely questions
- *Why cross-entropy not MSE for classification?*
- *MAE vs MSE under outliers?*
- *What problem does focal loss solve?*
`,
},

{
  id: "cross-validation",
  title: "Cross-Validation & Data Splits",
  domain: "ML Fundamentals",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["validation", "k-fold", "leakage", "splits"],
  related: ["bias-variance", "overfitting-regularization", "evaluation-metrics"],
  body: `
## TL;DR
Split data into **train / validation / test**. Tune on validation, touch test exactly once at the end. k-fold cross-validation reuses data efficiently and gives a variance estimate of your score.

## The three splits
- **Train** \u2014 fit parameters.
- **Validation** \u2014 tune hyperparameters / pick models / early stop.
- **Test** \u2014 final, untouched estimate of generalization. Look once.

## k-fold cross-validation
Partition into k folds; train on k\u22121, validate on the held-out fold; rotate; average. Typical k = 5 or 10.
- **Stratified k-fold** \u2014 preserve class ratios per fold (essential for [[Evaluation Metrics (Classification)|imbalanced]] data).
- **Leave-one-out** \u2014 k = N; low bias, high variance, expensive.

## Leakage \u2014 the silent killer
Information from outside the training fold sneaking in:
- Fitting the scaler/imputer/encoder on the **full** dataset before splitting. *Fit only on train, transform val/test.*
- Target leakage: a feature that encodes the label (or future information).
- Duplicates / near-duplicates spanning train and test.

## Special cases
- **Time series** \u2192 never shuffle. Use forward-chaining splits (train on past, validate on future).
- **Grouped data** (multiple rows per user/patient) \u2192 GroupKFold so the same entity isn't in both splits.

## Say it out loud
> "I always split first, then fit preprocessing inside the training fold only. For time series I use forward-chaining. I report mean \u00b1 std across folds, and only run on the test set once."

## Pitfalls
- Tuning until test looks good = overfitting the test set.
- Shuffling time-series data \u2192 leakage from the future.
- Standardizing before splitting.

## Likely questions
- *Why three splits, not two?*
- *Give three examples of data leakage.*
- *How do you cross-validate time series?*
`,
},

{
  id: "logistic-regression",
  title: "Logistic Regression",
  domain: "ML Fundamentals",
  difficulty: "warm-up",
  updated: "2026-05-29",
  tags: ["linear-model", "classification", "sigmoid", "interview-staple"],
  related: ["loss-functions", "evaluation-metrics", "gradient-descent", "overfitting-regularization"],
  body: `
## TL;DR
A linear model for classification: it computes a weighted sum of features, squashes it through a **sigmoid** to get a probability, and is trained with **cross-entropy**. Simple, fast, interpretable, hard to beat as a baseline.

## The model
<pre><code>z = w\u00b7x + b
p = sigmoid(z) = 1 / (1 + e^(-z))</code></pre>
Predict class 1 if <code>p &gt; threshold</code> (default 0.5, but tune it for your [[Evaluation Metrics (Classification)|precision/recall]] needs).

## Why a sigmoid?
It maps any real number to (0,1) so the output reads as a probability, and it makes the log-odds linear in the features: <code>log(p/(1-p)) = w\u00b7x + b</code>. So a unit change in a feature shifts the **log-odds** by its weight \u2014 that's the interpretability win.

## Training
Minimize binary [[Loss Functions|cross-entropy]] via [[Gradient Descent & Optimizers|gradient descent]]. The loss is convex \u2192 a single global optimum. Add L1/L2 [[Overfitting & Regularization|regularization]] to control overfitting.

## Strengths / limits
- Fast, interpretable, calibrated-ish probabilities, great baseline.
- Only learns **linear** decision boundaries \u2014 needs feature engineering or kernels/nets for nonlinear problems.
- Sensitive to feature scaling and to correlated features.

## Say it out loud
> "Linear combination \u2192 sigmoid \u2192 probability, trained on convex cross-entropy. It's my first baseline before reaching for trees or nets, because it's interpretable and tells me if the signal is even linearly separable."

## Likely questions
- *Why sigmoid + cross-entropy, not a linear output + MSE?*
- *Is logistic regression convex?* (Yes.)
- *How do you extend to multiclass?* (Softmax / one-vs-rest.)
`,
},

{
  id: "trees-ensembles",
  title: "Trees, Bagging & Boosting",
  domain: "ML Fundamentals",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["decision-trees", "random-forest", "xgboost", "ensembles"],
  related: ["bias-variance", "overfitting-regularization", "evaluation-metrics"],
  body: `
## TL;DR
A decision tree splits feature space into axis-aligned regions \u2014 interpretable but high [[Bias\u2013Variance Tradeoff|variance]]. Ensembles fix that two ways: **bagging** (Random Forest) averages many independent trees to cut variance; **boosting** (XGBoost/LightGBM) builds trees sequentially, each fixing the last's errors, to cut bias.

## Single tree
Greedily split on the feature/threshold that most reduces impurity (**Gini** or **entropy** for classification, variance for regression). Deep trees overfit; prune or cap depth.

## Bagging \u2192 Random Forest
- Train many trees on **bootstrap** samples (sample rows with replacement).
- At each split consider a **random subset of features** \u2192 decorrelates the trees.
- Average their votes. Variance drops, bias roughly unchanged.
- Parallelizable; robust; minimal tuning.

## Boosting \u2192 Gradient Boosted Trees
- Trees added **sequentially**; each new tree fits the **residual / gradient** of the current ensemble.
- Lowers bias \u2192 often the top performer on tabular data.
- More tuning, sequential (slower), can overfit if learning rate too high / too many trees.

| | Random Forest | Gradient Boosting |
|---|---|---|
| Builds trees | In parallel, independent | Sequentially, on residuals |
| Attacks | Variance | Bias |
| Tuning | Easy | Sensitive |
| Overfit risk | Low | Higher (needs early stopping) |

## Say it out loud
> "Bagging reduces variance by averaging decorrelated trees; boosting reduces bias by fitting residuals stage-wise. For tabular data my default is gradient boosting with early stopping; Random Forest when I want a low-effort, robust baseline."

## Likely questions
- *Bagging vs boosting \u2014 what does each reduce?*
- *Why random feature subsets in RF?* (Decorrelate trees.)
- *Why do GBTs usually beat a single tree?*
`,
}

);
