/* LLMs / GenAI — pushes notes into window.WIKI_NOTES */
window.WIKI_NOTES = window.WIKI_NOTES || [];
window.WIKI_NOTES.push(

{
  id: "tokenization",
  title: "Tokenization",
  domain: "LLMs / GenAI",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["tokenizer", "bpe", "subword", "vocab"],
  related: ["transformers", "embeddings", "decoding-strategies"],
  body: `
## TL;DR
LLMs don't see characters or words \u2014 they see **tokens**, integer IDs for subword chunks produced by an algorithm like **Byte-Pair Encoding (BPE)**. Subwords balance vocabulary size against sequence length and gracefully handle rare/unknown words.

## Why subwords (not words or characters)?
- **Word-level** \u2014 huge vocab, can't handle out-of-vocabulary words.
- **Character-level** \u2014 tiny vocab but very long sequences \u2192 expensive [[Attention Mechanism|attention]].
- **Subword (BPE/WordPiece/Unigram)** \u2014 frequent words stay whole, rare words split into pieces. Best of both. No true OOV (worst case: bytes).

## How BPE works
Start from characters/bytes; repeatedly merge the most frequent adjacent pair into a new token; stop at the target vocab size. Common strings become single tokens; rare ones stay fragmented.

## Practical consequences
- **Cost & context** are measured in tokens. ~1 token \u2248 4 chars / 0.75 words of English.
- **Non-English / code / numbers** often tokenize less efficiently \u2192 more tokens, higher cost, less effective context.
- Tokenization quirks explain failures like miscounting letters ("how many r's in strawberry") \u2014 the model sees tokens, not letters.

## Say it out loud
> "LLMs operate on subword tokens, usually via BPE: it merges frequent character pairs up to a fixed vocab. That avoids OOV, keeps sequences shorter than char-level, and is why cost and context limits are counted in tokens."

## Likely questions
- *Why subword tokenization over word/char?*
- *Roughly how many characters per token?*
- *Why might a model fail to count characters in a word?*
`,
},

{
  id: "embeddings",
  title: "Embeddings & Vector Search",
  domain: "LLMs / GenAI",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["embeddings", "cosine", "ann", "semantic-search"],
  related: ["rag", "tokenization", "rec-system-design"],
  body: `
## TL;DR
An embedding maps text (or images) to a dense vector so that **semantic similarity becomes geometric proximity**. Compare with cosine similarity; search billions of them fast with approximate nearest-neighbor (ANN) indexes. The backbone of [[Retrieval-Augmented Generation (RAG)|RAG]] and semantic search.

## Key ideas
- **Dense vectors** \u2014 e.g. 768\u20134096 dims; learned so related meanings sit close together.
- **Similarity** \u2014 **cosine similarity** (angle) is standard; dot product if vectors are normalized; Euclidean less common for text.
- **Contrastive training** \u2014 pull related pairs together, push unrelated apart (InfoNCE).

## Vector search at scale
Exact nearest-neighbor over millions of vectors is too slow, so use **ANN** indexes:
- **HNSW** \u2014 graph-based; great recall/latency, memory-heavy. The common default.
- **IVF / IVF-PQ** \u2014 cluster then search a few cells; product quantization compresses vectors.
- Trade **recall vs latency vs memory** by tuning index params.

## Chunking matters
For retrieval you embed **chunks** of documents. Too large \u2192 diluted meaning, irrelevant context; too small \u2192 lost context. Overlapping windows + semantic/heading-aware splitting help a lot.

## Say it out loud
> "Embeddings turn meaning into geometry; cosine similarity ranks relevance. For scale I use an ANN index like HNSW to trade a little recall for big latency wins. Retrieval quality hinges on chunking strategy as much as the model."

## Likely questions
- *Why cosine over Euclidean for text?*
- *Why approximate NN instead of exact?*
- *How does chunk size affect retrieval?*
`,
},

{
  id: "rag",
  title: "Retrieval-Augmented Generation (RAG)",
  domain: "LLMs / GenAI",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["rag", "retrieval", "grounding", "hallucination"],
  related: ["embeddings", "fine-tuning", "hallucination-eval", "rec-system-design"],
  body: `
## TL;DR
RAG grounds an LLM in external knowledge: **retrieve** relevant documents at query time, **inject** them into the prompt, and let the model answer from them. It reduces hallucination, adds fresh/private knowledge without retraining, and provides citations.

## The pipeline
1. **Ingest** \u2014 chunk documents, [[Embeddings & Vector Search|embed]] them, store in a vector DB.
2. **Retrieve** \u2014 embed the query, fetch top-k similar chunks (often + keyword/BM25 = **hybrid search**).
3. **Rerank** (optional) \u2014 a cross-encoder reorders candidates for precision.
4. **Generate** \u2014 stuff retrieved context into the prompt; the model answers grounded in it, ideally with citations.

## RAG vs fine-tuning
| | RAG | [[Fine-Tuning vs Prompting|Fine-tuning]] |
|---|---|---|
| Adds **knowledge** | Yes (swap the index) | Poorly / costly |
| Adds **behavior/format/style** | Limited | Yes |
| Fresh / changing data | Easy | Needs retraining |
| Citations / provenance | Natural | No |
| Inference cost | Higher (longer prompts) | Lower |

**Rule of thumb:** RAG for *what the model knows*, fine-tuning for *how it behaves*. They compose.

## Where RAG breaks
- Retrieval misses the relevant chunk \u2192 the model can't answer (or hallucinates). Retrieval quality is usually the bottleneck, not the LLM.
- Bad chunking, no reranking, pure-semantic search missing exact keywords.
- Context stuffed but answer buried \u2192 "lost in the middle".

## Say it out loud
> "RAG retrieves relevant chunks and injects them so the model answers from grounded context with citations. I'd use hybrid search plus a reranker, and remember the failure mode is almost always retrieval, not generation. RAG adds knowledge; fine-tuning changes behavior."

## Likely questions
- *RAG vs fine-tuning \u2014 when each?*
- *Most common failure mode of a RAG system?* (Retrieval.)
- *What is hybrid search and reranking?*
`,
},

{
  id: "fine-tuning",
  title: "Fine-Tuning vs Prompting",
  domain: "LLMs / GenAI",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["fine-tuning", "lora", "peft", "rlhf", "prompting"],
  related: ["rag", "prompt-engineering", "quantization"],
  body: `
## TL;DR
Adapt an LLM along a spectrum of cost/effort: **prompting** (no training) \u2192 **RAG** (add knowledge) \u2192 **fine-tuning** (change behavior). Modern fine-tuning is usually **parameter-efficient (LoRA)** rather than updating all weights.

## The ladder (try in order)
1. **Prompting / few-shot** \u2014 instructions + examples. Zero training, instant iteration. Try this first.
2. **[[Retrieval-Augmented Generation (RAG)|RAG]]** \u2014 inject external knowledge at runtime.
3. **Fine-tuning** \u2014 update weights to bake in behavior, style, format, or a narrow skill.

## Full vs parameter-efficient fine-tuning
- **Full FT** \u2014 update all weights. Powerful but expensive, needs lots of data, risks **catastrophic forgetting**, one big checkpoint per task.
- **LoRA / PEFT** \u2014 freeze the base model; train tiny low-rank adapter matrices injected into the weights. ~0.1\u20131% of params trained \u2192 cheap, fast, swappable adapters per task. **QLoRA** = LoRA on a [[Quantization|quantized]] base to fit on one GPU.

## Alignment stages (how chat models are made)
1. **Pretraining** \u2014 next-token prediction on web-scale text.
2. **SFT** \u2014 supervised fine-tuning on instruction\u2013response pairs.
3. **RLHF / DPO** \u2014 align to human preferences (helpful, harmless, honest).

## When to fine-tune
- Consistent **format/style/tone** you can't reliably prompt.
- A **narrow, repeated** task where you want lower latency/cost than long prompts.
- **Not** for adding factual knowledge \u2014 use RAG.

## Say it out loud
> "Start with prompting, add RAG for knowledge, fine-tune only to change behavior or format. And I'd reach for LoRA, not full fine-tuning \u2014 train ~1% of params as adapters, cheap and swappable, QLoRA if GPU memory is tight."

## Likely questions
- *RAG vs fine-tuning vs prompting \u2014 decision tree?*
- *What is LoRA and why is it efficient?*
- *Outline RLHF.*
`,
},

{
  id: "prompt-engineering",
  title: "Prompting & In-Context Learning",
  domain: "LLMs / GenAI",
  difficulty: "warm-up",
  updated: "2026-05-29",
  tags: ["prompting", "cot", "few-shot", "icl"],
  related: ["fine-tuning", "decoding-strategies", "hallucination-eval"],
  body: `
## TL;DR
**In-context learning**: an LLM adapts to a task purely from the prompt \u2014 instructions and a few examples \u2014 with no weight updates. Good prompting (clear instructions, few-shot examples, chain-of-thought) often beats fine-tuning for a fraction of the effort.

## Core techniques
- **Zero-shot** \u2014 just the instruction.
- **Few-shot** \u2014 include a handful of input\u2192output examples; the model infers the pattern.
- **Chain-of-thought (CoT)** \u2014 ask it to reason step by step; big gains on math/logic by spending more "thinking" tokens.
- **Structured output** \u2014 specify a schema (JSON), provide a template, constrain decoding.
- **Role / system prompts** \u2014 set persona, constraints, and guardrails up front.

## Why few-shot works
The examples condition the model's distribution toward the task without changing parameters \u2014 it pattern-matches from context. More/clearer examples \u2192 better, up to context limits.

## Practical tips
- Be explicit about format and constraints; show, don't just tell (examples).
- Put the most important instructions at the **start and end** (recency + primacy; mitigates "lost in the middle").
- Decompose hard tasks into steps or multiple calls.

## Say it out loud
> "In-context learning means the model adapts from the prompt alone. I'd start zero-shot, add few-shot examples to pin the format, and use chain-of-thought for reasoning tasks. It's the cheapest adaptation lever before [[Fine-Tuning vs Prompting|fine-tuning]]."

## Likely questions
- *What is in-context learning \u2014 does it change weights?* (No.)
- *Why does chain-of-thought help?*
- *Few-shot vs fine-tuning tradeoffs?*
`,
},

{
  id: "decoding-strategies",
  title: "Decoding Strategies",
  domain: "LLMs / GenAI",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["sampling", "temperature", "top-p", "greedy", "beam"],
  related: ["tokenization", "prompt-engineering", "hallucination-eval"],
  body: `
## TL;DR
Decoding turns the model's next-token probability distribution into actual text. The choice \u2014 greedy, sampling with temperature, top-k/top-p \u2014 controls the determinism vs creativity tradeoff.

## The methods
- **Greedy** \u2014 always take the argmax token. Deterministic, but repetitive and can get stuck.
- **Beam search** \u2014 keep the top-b partial sequences. Good for closed-ended tasks (translation); bland/repetitive for open-ended text.
- **Temperature sampling** \u2014 divide logits by <code>T</code> before softmax. <code>T&lt;1</code> sharpens (safer, more deterministic); <code>T&gt;1</code> flattens (more random). <code>T=0</code> \u2248 greedy.
- **Top-k** \u2014 sample only from the k most likely tokens.
- **Top-p (nucleus)** \u2014 sample from the smallest set whose cumulative probability \u2265 p. Adapts the candidate set to the distribution's shape \u2014 the common default.

## Choosing
| Goal | Setting |
|---|---|
| Factual / deterministic (code, extraction) | Low temp (0\u20130.3), or greedy |
| Balanced assistant | temp ~0.7, top-p ~0.9 |
| Creative / brainstorming | Higher temp, higher top-p |

## Repetition controls
Repetition/frequency/presence penalties discourage loops; helpful with greedy/low-temp decoding.

## Say it out loud
> "Decoding samples from the next-token distribution. Temperature scales how peaked it is; top-p keeps the smallest mass-p nucleus. Low temp for code and extraction, ~0.7 with top-p 0.9 for chat. Greedy is deterministic but repetitive."

## Likely questions
- *What does temperature do to the logits?*
- *Top-k vs top-p?*
- *Why is beam search bad for open-ended generation?*
`,
},

{
  id: "quantization",
  title: "Quantization & Efficient Inference",
  domain: "LLMs / GenAI",
  difficulty: "advanced",
  updated: "2026-05-29",
  tags: ["quantization", "int8", "inference", "kv-cache"],
  related: ["fine-tuning", "llm-attention-scaling", "model-serving"],
  body: `
## TL;DR
Quantization stores/computes model weights (and sometimes activations) in lower precision \u2014 FP16 \u2192 INT8 \u2192 INT4 \u2014 shrinking memory and speeding inference with small accuracy loss. The main lever for running big models on modest hardware.

## Why it works / why it matters
LLM inference is **memory-bandwidth bound**: most time is spent moving weights, not multiplying. Halving the bits roughly halves memory traffic \u2192 faster + fits bigger models. INT4 can cut a 70B model to run on a single high-memory GPU.

## Types
- **Post-training quantization (PTQ)** \u2014 quantize a trained model directly (GPTQ, AWQ). Fast, no retraining; slight quality drop.
- **Quantization-aware training (QAT)** \u2014 simulate quantization during training for better accuracy; more expensive.
- **Weight-only vs weight+activation** \u2014 weight-only (e.g. INT4 weights, FP16 compute) is the common sweet spot.

## Related inference levers
- **KV cache** \u2014 cache past keys/values so each new token doesn't recompute [[Attention Mechanism|attention]] over the whole sequence. Memory grows with context length \u2192 a major serving cost (quantize it too).
- **Batching / continuous batching** \u2014 pack many requests to keep the GPU busy.
- **Speculative decoding** \u2014 a small draft model proposes tokens a big model verifies in parallel.

## Say it out loud
> "Inference is memory-bandwidth bound, so quantizing weights to INT8/INT4 cuts memory traffic and lets big models fit on small hardware with minor quality loss. PTQ like AWQ is the quick path; pair it with KV-cache management and batching for throughput."

## Likely questions
- *Why does quantization speed up inference?* (Bandwidth bound.)
- *PTQ vs QAT?*
- *What is the KV cache and why does it grow with context?*
`,
},

{
  id: "llm-attention-scaling",
  title: "Attention Scaling & Efficient Attention",
  domain: "LLMs / GenAI",
  difficulty: "advanced",
  updated: "2026-05-29",
  tags: ["flash-attention", "context", "o-n-squared", "kv-cache"],
  related: ["attention", "transformers", "quantization"],
  body: `
## TL;DR
Self-attention is **O(n\u00b2)** in sequence length \u2014 the central obstacle to long context. The fixes are either smarter exact computation (**FlashAttention**), cheaper approximate attention (sparse/linear), or memory tricks (**KV cache**, GQA).

## The bottleneck
Every token attends to every token \u2192 the score matrix is n\u00d7n. Double the context, quadruple the attention compute and the activation memory. This drives both training cost and the practical context-length ceiling.

## Approaches
- **FlashAttention** \u2014 *exact* attention, but computed in a memory-aware, tiled way that never materializes the full n\u00d7n matrix in slow memory. Big speed/memory win; now standard.
- **Sparse attention** \u2014 each token attends to a subset (local window + a few global tokens), e.g. Longformer/BigBird. O(n) or O(n log n).
- **Linear attention** \u2014 reformulate to avoid the explicit softmax matrix; O(n).
- **Multi-Query / Grouped-Query Attention (MQA/GQA)** \u2014 share key/value heads across query heads to shrink the [[Quantization & Efficient Inference|KV cache]] \u2192 cheaper long-context inference. Used by most modern LLMs.

## RoPE & context extension
Rotary position embeddings (RoPE) plus tricks like position interpolation / YaRN let models extend context beyond their training length.

## Say it out loud
> "Attention is O(n\u00b2) in length, which caps context. FlashAttention keeps it exact but tiles the computation to avoid materializing the big matrix; sparse/linear variants approximate it for O(n); and GQA shrinks the KV cache so long-context inference stays affordable."

## Likely questions
- *Why is attention O(n\u00b2)? What does that limit?*
- *Is FlashAttention an approximation?* (No \u2014 exact, memory-efficient.)
- *What problem does Grouped-Query Attention solve?*
`,
},

{
  id: "hallucination-eval",
  title: "Hallucination & LLM Evaluation",
  domain: "LLMs / GenAI",
  difficulty: "core",
  updated: "2026-05-29",
  tags: ["hallucination", "evaluation", "llm-as-judge", "grounding"],
  related: ["rag", "prompt-engineering", "decoding-strategies"],
  body: `
## TL;DR
LLMs hallucinate because they're trained to produce **plausible** text, not verified truth \u2014 they're probabilistic next-token predictors with no built-in fact-checker. Mitigate with grounding ([[Retrieval-Augmented Generation (RAG)|RAG]]), and evaluate with a mix of references, human review, and **LLM-as-judge**.

## Why hallucinations happen
- The objective rewards fluent continuations, not factual ones.
- Knowledge is lossy/compressed in weights; gaps get confidently filled.
- High [[Decoding Strategies|temperature]] and out-of-distribution prompts increase it.

## Mitigations
- **Grounding (RAG)** \u2014 give the model the facts and ask it to cite them.
- **Lower temperature** for factual tasks.
- **Ask for citations / "say I don't know"** \u2014 instructions + few-shot.
- **Self-consistency / verification** \u2014 sample multiple answers, check agreement; tool use for facts/math.

## Evaluation methods
- **Reference-based** \u2014 exact match / F1 / BLEU / ROUGE. Cheap but brittle for open-ended text.
- **Human eval** \u2014 gold standard, slow and costly.
- **LLM-as-judge** \u2014 a strong model scores outputs against a rubric. Scalable; watch for biases (position, verbosity, self-preference) \u2014 randomize order, use rubrics.
- **Task-specific** \u2014 pass@k for code, faithfulness/groundedness for RAG, win-rate vs a baseline.

## Say it out loud
> "Hallucination is inherent \u2014 the model optimizes plausibility, not truth. I'd ground it with RAG and citations, lower the temperature, and let it abstain. For eval I combine reference metrics, targeted human review, and LLM-as-judge with rubrics, knowing the judge has its own biases."

## Likely questions
- *Why do LLMs hallucinate?*
- *How would you evaluate a summarization/RAG system?*
- *Pros and cons of LLM-as-judge?*
`,
}

);
