/* Deep Learning — pushes notes into window.WIKI_NOTES */
window.WIKI_NOTES = window.WIKI_NOTES || [];
window.WIKI_NOTES.push(

{
  id: "backpropagation",
  title: "Backpropagation",
  domain: "Deep Learning",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["backprop", "chain-rule", "gradients", "autodiff"],
  related: ["gradient-descent", "activation-functions", "vanishing-gradients", "dropout-normalization"],
  body: `
## TL;DR
Backprop is just the **chain rule** applied efficiently over a computation graph. A forward pass computes the loss; a backward pass propagates the gradient of the loss w.r.t. every parameter, reusing intermediate results so the whole thing costs about the same as one forward pass.

## The two passes
1. **Forward** \u2014 feed input through the layers, cache intermediate activations, compute the [[Loss Functions|loss]].
2. **Backward** \u2014 starting from the loss, apply the chain rule layer by layer to get <code>dL/dW</code> for every weight.

<pre><code>dL/dW1 = dL/da3 * da3/dz3 * dz3/da2 * ... * dz1/dW1</code></pre>

Then [[Gradient Descent & Optimizers|gradient descent]] updates each weight by its gradient.

## Why it's efficient
Naively, computing each parameter's gradient separately repeats work. Backprop caches the "upstream" gradient at each node and multiplies by the local derivative \u2014 **dynamic programming on the graph**. Cost \u2248 O(forward pass).

## What you must cache
Activations from the forward pass are needed in the backward pass \u2192 this is why training memory scales with batch size \u00d7 depth (and why activation checkpointing trades compute for memory).

## Say it out loud
> "Forward computes the loss and caches activations; backward applies the chain rule from the loss back to each weight, reusing cached upstream gradients so it's one extra pass, not one per parameter."

## Pitfalls
- **[[Vanishing & Exploding Gradients|Vanishing/exploding gradients]]** \u2014 long products of derivatives shrink or blow up.
- Forgetting to zero gradients between steps (they accumulate by default in some frameworks).
- Non-differentiable ops break the graph (use straight-through estimators / surrogates).

## Likely questions
- *Derive backprop for a 2-layer net.*
- *Why is backprop O(1) forward passes, not O(params)?*
- *What gets stored during the forward pass and why?*
`,
},

{
  id: "activation-functions",
  title: "Activation Functions",
  domain: "Deep Learning",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["relu", "sigmoid", "gelu", "nonlinearity"],
  related: ["backpropagation", "vanishing-gradients", "dropout-normalization"],
  body: `
## TL;DR
Activations inject **nonlinearity** \u2014 without them a deep net collapses into one linear layer. ReLU and its variants dominate hidden layers; sigmoid/softmax live at the output.

## The cast
- **Sigmoid** \u2014 (0,1), good for output probabilities. **Saturates** at the tails \u2192 [[Vanishing & Exploding Gradients|vanishing gradients]] in hidden layers. Avoid in deep hidden layers.
- **Tanh** \u2014 (\u22121,1), zero-centered (better than sigmoid) but still saturates.
- **ReLU** \u2014 <code>max(0, x)</code>. Cheap, non-saturating for x&gt;0, sparse activations. The default. Downside: **dead ReLUs** (neurons stuck at 0 if they only see negatives).
- **Leaky ReLU / PReLU** \u2014 small negative slope to avoid dead units.
- **GELU / SiLU(Swish)** \u2014 smooth, slightly negative for small negatives; standard in [[Transformers|transformers]].

## Why nonlinearity is mandatory
Stack of linear layers: <code>W2(W1 x) = (W2 W1) x</code> \u2014 still linear. The activation between them is what lets the network approximate arbitrary functions (universal approximation).

## Output-layer choices
- Binary classification \u2192 **sigmoid**.
- Multiclass \u2192 **softmax**.
- Regression \u2192 usually **none** (linear).

## Say it out loud
> "ReLU by default in hidden layers \u2014 cheap and non-saturating. GELU in transformers. Sigmoid/softmax only at the output. Sigmoid in hidden layers is a classic mistake because it saturates and kills gradients."

## Likely questions
- *Why does ReLU help with vanishing gradients?*
- *What is a dead ReLU and how do you fix it?*
- *What happens with no activation function?*
`,
},

{
  id: "vanishing-gradients",
  title: "Vanishing & Exploding Gradients",
  domain: "Deep Learning",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["gradients", "stability", "init", "residual"],
  related: ["backpropagation", "activation-functions", "dropout-normalization", "rnns-lstm"],
  body: `
## TL;DR
In deep nets the gradient is a long **product** of per-layer terms. If those terms are <1 the gradient vanishes (early layers stop learning); if >1 it explodes (NaNs). The fixes: better activations, normalization, residual connections, careful init, and gradient clipping.

## Why it happens
Backprop multiplies many Jacobians/derivatives together. Saturating activations like [[Activation Functions|sigmoid]] have derivatives \u2264 0.25, so a 20-layer product can be ~0.25^20 \u2248 0 \u2192 **vanishing**. Large weights \u2192 **exploding**.

## Fixes
- **Non-saturating activations** \u2014 ReLU/GELU keep derivatives near 1 on the positive side.
- **Residual / skip connections** \u2014 <code>y = x + f(x)</code> gives gradients a direct path (identity) around each block. The key enabler of very deep nets (ResNet, [[Transformers|transformers]]).
- **[[Dropout & Normalization|Normalization]]** \u2014 BatchNorm/LayerNorm keep activations well-scaled.
- **Careful initialization** \u2014 Xavier/Glorot (tanh), He (ReLU) keep variance stable across layers.
- **Gradient clipping** \u2014 cap the norm; the standard cure for *exploding* gradients (esp. [[RNNs & LSTMs|RNNs]]).

## Say it out loud
> "Gradients are a product over layers, so saturating activations or bad init make them vanish or explode. Residual connections give an identity gradient path, normalization keeps activations scaled, and clipping bounds explosions \u2014 together they're why we can train 100+ layer nets."

## Likely questions
- *Why do residual connections help training depth?*
- *Vanishing vs exploding \u2014 causes and cures.*
- *Why is sigmoid prone to vanishing gradients?*
`,
},

{
  id: "cnns",
  title: "Convolutional Neural Networks",
  domain: "Deep Learning",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["cnn", "vision", "convolution", "pooling"],
  related: ["backpropagation", "dropout-normalization", "transformers"],
  body: `
## TL;DR
CNNs exploit the structure of images with **local connectivity** and **weight sharing**: a small kernel slides across the image detecting the same feature everywhere. This gives translation equivariance and slashes parameters vs a dense net.

## Building blocks
- **Convolution** \u2014 a learned <code>k\u00d7k</code> filter convolved across the input; each filter detects one pattern (edge, texture). Many filters \u2192 many feature maps.
- **Stride / padding** \u2014 stride controls downsampling; padding preserves spatial size.
- **Pooling** \u2014 max/avg pooling downsamples and adds small translation invariance.
- **Receptive field** \u2014 deeper layers "see" larger regions; early layers learn edges, later layers learn objects (feature hierarchy).

## Why convolution beats dense for images
- **Parameter sharing** \u2014 one kernel reused across all positions \u2192 far fewer weights.
- **Local connectivity** \u2014 a pixel mostly depends on its neighbors.
- **Translation equivariance** \u2014 a cat shifted right shifts its activations right.

## Landmark ideas
- **ResNet** \u2014 [[Vanishing & Exploding Gradients|residual connections]] enabled very deep CNNs.
- **BatchNorm** \u2014 stabilized and sped up training.
- **1\u00d71 convolutions** \u2014 cheap channel mixing / dimensionality change.

## Say it out loud
> "A CNN slides shared filters over the image, so it learns translation-equivariant features with way fewer parameters than a dense net. Stacking conv + pooling builds a hierarchy from edges to objects, and residual connections let it go deep."

## Pitfalls
- Forgetting that pooling discards spatial precision (bad for segmentation \u2192 use strided/transposed convs).
- Vision Transformers now rival/beat CNNs at scale but need more data or strong augmentation.

## Likely questions
- *Why weight sharing? What invariance does it give?*
- *Conv vs fully-connected layer \u2014 parameter count?*
- *What is the receptive field?*
`,
},

{
  id: "rnns-lstm",
  title: "RNNs & LSTMs",
  domain: "Deep Learning",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["rnn", "lstm", "gru", "sequence"],
  related: ["vanishing-gradients", "transformers", "attention"],
  body: `
## TL;DR
RNNs process sequences step by step, carrying a hidden state. Vanilla RNNs struggle with long-range dependencies due to [[Vanishing & Exploding Gradients|vanishing gradients]]; **LSTMs/GRUs** add gated memory to carry information across many steps. Mostly superseded by [[Transformers|transformers]], but still asked about.

## Vanilla RNN
<pre><code>h_t = tanh(W_x x_t + W_h h_{t-1} + b)</code></pre>
The same weights are applied at every timestep. Backprop-through-time multiplies many Jacobians \u2192 long-range gradients vanish/explode.

## LSTM
Adds a **cell state** <code>c_t</code> (a gradient "highway") and three gates:
- **Forget gate** \u2014 what to drop from the cell.
- **Input gate** \u2014 what new info to write.
- **Output gate** \u2014 what to expose as the hidden state.

The additive cell-state update is the key: gradients flow through it largely unattenuated, fixing long-range learning.

## GRU
A lighter variant: merges cell/hidden state and uses two gates (reset, update). Fewer params, often comparable performance.

## Why transformers replaced them
- RNNs are **sequential** \u2192 can't parallelize across time \u2192 slow on modern hardware.
- [[Attention Mechanism|Attention]] connects any two positions in O(1) path length, capturing long-range dependencies better.

## Say it out loud
> "RNNs carry a hidden state across timesteps but vanilla ones lose long-range signal to vanishing gradients. LSTMs add a gated additive cell state \u2014 a gradient highway \u2014 so memory persists. Transformers then won because attention is parallelizable and has shorter dependency paths."

## Likely questions
- *Why do LSTMs handle long-range deps better than vanilla RNNs?*
- *What do the three gates do?*
- *Why did transformers replace RNNs?*
`,
},

{
  id: "transformers",
  title: "Transformers",
  domain: "Deep Learning",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["transformer", "attention", "architecture", "interview-staple"],
  related: ["attention", "rnns-lstm", "tokenization", "vanishing-gradients", "llm-attention-scaling"],
  body: `
## TL;DR
The transformer dropped recurrence entirely and built sequence models from **self-attention** + feed-forward layers. Because attention processes all positions in parallel and connects any two directly, transformers train faster and capture long-range structure better \u2014 the backbone of every modern LLM.

## Anatomy of a block
1. **Multi-head [[Attention Mechanism|self-attention]]** \u2014 each token attends to all others; multiple heads learn different relationships.
2. **Position-wise feed-forward** \u2014 an MLP applied to each token independently (where much of the capacity/knowledge lives).
3. **Residual connections + LayerNorm** \u2014 around each sub-layer; the [[Vanishing & Exploding Gradients|residual]] paths make deep stacks trainable.

## Positional information
Attention is **permutation-invariant**, so position must be injected \u2014 via sinusoidal encodings, learned embeddings, or rotary (RoPE) used by most modern LLMs.

## Encoder / decoder variants
- **Encoder-only** (BERT) \u2014 bidirectional; classification, embeddings, retrieval.
- **Decoder-only** (GPT/Llama) \u2014 causal masking; autoregressive generation. The dominant LLM design.
- **Encoder\u2013decoder** (T5, original) \u2014 translation, seq2seq.

## Why it won
- **Parallelism** \u2014 no sequential dependency across positions (unlike [[RNNs & LSTMs|RNNs]]).
- **Short path length** \u2014 any two tokens interact directly.
- **Scales** \u2014 performance grows predictably with params + data + compute.

## Say it out loud
> "A transformer block is self-attention to mix information across tokens, then a per-token MLP, both wrapped in residual + norm. No recurrence, so it parallelizes and connects distant tokens directly \u2014 that's why it scales and replaced RNNs."

## Likely questions
- *Walk me through a transformer block.*
- *Why do we need positional encodings?*
- *Encoder-only vs decoder-only \u2014 use cases?*
`,
},

{
  id: "attention",
  title: "Attention Mechanism",
  domain: "Deep Learning",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["attention", "qkv", "softmax", "self-attention"],
  related: ["transformers", "llm-attention-scaling", "rnns-lstm"],
  body: `
## TL;DR
Attention lets each token build a context-aware representation by **querying** all other tokens and taking a weighted average of their **values**, where weights come from query\u2013key similarity. It's a learned, content-based lookup.

## Scaled dot-product attention
<pre><code>Attention(Q,K,V) = softmax( (Q K^T) / sqrt(d_k) ) V</code></pre>
- **Query (Q)** \u2014 what this token is looking for.
- **Key (K)** \u2014 what each token offers.
- **Value (V)** \u2014 the content each token contributes.
- <code>Q K^T</code> \u2014 similarity scores; **softmax** \u2192 attention weights summing to 1; weighted sum of V \u2192 output.

## Why divide by sqrt(d_k)?
For large head dimension <code>d_k</code>, dot products grow large in magnitude, pushing softmax into saturated regions with tiny gradients. Scaling by <code>sqrt(d_k)</code> keeps variance ~1 and gradients healthy.

## Multi-head attention
Run h attention operations in parallel on projected subspaces, concatenate, project. Different heads specialize (syntax, coreference, position) \u2014 like multiple "views" of the relationships.

## Self vs cross attention
- **Self-attention** \u2014 Q, K, V all from the same sequence.
- **Cross-attention** \u2014 Q from one sequence, K/V from another (decoder attending to encoder; the basis of how generation conditions on a prompt/context).

## Complexity
O(n\u00b2) in sequence length n \u2014 the core scaling pain of long context. See [[Attention Scaling & Efficient Attention|efficient attention]].

## Say it out loud
> "Each token emits a query, every token a key and value. Query-key dot products, scaled and softmaxed, give weights; the output is the weighted sum of values. Multiple heads capture different relations. It's content-based soft lookup, and it's O(n\u00b2) in length."

## Likely questions
- *Write the attention equation; explain Q/K/V.*
- *Why the sqrt(d_k) scaling?*
- *Why multiple heads?*
`,
},

{
  id: "dropout-normalization",
  title: "Dropout & Normalization",
  domain: "Deep Learning",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["dropout", "batchnorm", "layernorm", "regularization"],
  related: ["overfitting-regularization", "vanishing-gradients", "backpropagation", "transformers"],
  body: `
## TL;DR
**Dropout** is regularization \u2014 randomly zeroing activations so the net can't rely on any single unit. **Normalization** (Batch/Layer) rescales activations to stabilize and speed training. Different goals, often confused.

## Dropout
During training, drop each activation with probability p (e.g. 0.1\u20130.5); scale the rest. At inference, use all units (no dropout). Effect: prevents co-adaptation, approximates training an **ensemble** of subnetworks \u2192 less [[Overfitting & Regularization|overfitting]].

## BatchNorm
Normalize each feature across the **batch** to zero mean / unit variance, then learn scale & shift (<code>gamma</code>, <code>beta</code>).
- Speeds training, allows higher learning rates, mild regularization.
- **Depends on batch statistics** \u2192 awkward for small batches, RNNs, and train/inference mismatch (uses running stats at test time).

## LayerNorm
Normalize across the **features** of a single example (not the batch). Batch-size independent \u2192 the standard in [[Transformers|transformers]] and RNNs.

| | BatchNorm | LayerNorm |
|---|---|---|
| Normalizes over | The batch | The features (per example) |
| Batch-size sensitive | Yes | No |
| Home turf | CNNs / vision | Transformers / NLP |

## Why normalization helps gradients
Keeping activations well-scaled across layers prevents the [[Vanishing & Exploding Gradients|vanishing/exploding]] product and smooths the loss surface.

## Say it out loud
> "Dropout regularizes by randomly muting units \u2014 an implicit ensemble. Normalization rescales activations to stabilize training: BatchNorm over the batch (vision), LayerNorm over features (transformers, batch-independent)."

## Pitfalls
- Leaving dropout on at inference.
- BatchNorm with batch size 1 or 2 \u2192 noisy stats.
- Putting BatchNorm where LayerNorm belongs (sequence models).

## Likely questions
- *BatchNorm vs LayerNorm \u2014 when each?*
- *Is dropout used at test time?* (No.)
- *Why does normalization speed up training?*
`,
}

);
