---
title: Teaching my notes to talk back
date: 2026-05-18
summary: What I learned building a local-first RAG over five years of markdown - and why vector similarity kept lying to me.
---

I have about five years of markdown notes. Meeting notes, half-finished ideas, debugging diaries, trek packing lists. The problem with a second brain is that it has no recall - *I* had to remember which note to open. So I built **recall**: a local RAG pipeline that lets me ask my own notes questions.

The stack is deliberately boring: Ollama for embeddings and generation, ChromaDB for storage, FastAPI in between. Everything runs on the homelab. No API keys, no cloud, no telemetry. My notes stay mine.

## What actually mattered

**Chunking is the product.** I started with naive 500-token chunks and got answers that were technically retrieved and practically useless. Notes have structure - headings, lists, dates - and splitting along that structure instead of token counts improved answers more than any model swap.

**Vector similarity is not relevance.** The embedding space thinks "kafka consumer lag" and "kafka topic naming" are neighbours. They are - semantically. But when I ask about a production incident, I want the incident note, not the style guide. A small reranking pass fixed what better embeddings couldn't.

**Citations or it didn't happen.** The single best feature was making every answer link back to the source note. Not because the model hallucinates often - because *trust* is the entire product. An answer I have to verify manually is slower than grep.

## What surprised me

The pipeline made me a better note-taker. Once my notes had a reader other than future-me, I started writing them differently: more context, fewer pronouns, actual dates instead of "yesterday". The tool trained the user.

That's the part I keep coming back to. You build the system, then the system quietly rebuilds you.
