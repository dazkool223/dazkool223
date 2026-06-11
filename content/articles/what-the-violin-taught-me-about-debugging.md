---
title: What the violin taught me about debugging
date: 2026-03-02
summary: Slow it down, isolate the bar, listen before you fix. Practice rooms and production incidents have more in common than they should.
---

I've played violin far longer than I've written code, and I keep noticing that the practice room taught me half of what I know about debugging.

## Slow it down

No violinist fixes a fast passage by playing it fast. You drop to half tempo, where the mistake has nowhere to hide. Debugging is the same: the bug that's invisible at production speed is obvious when you step through one request, one frame, one message at a time. Speed is where errors live; slowness is where they're caught.

## Isolate the bar

You don't re-practice the whole concerto because measure 37 is broken. You play measure 37. Alone. Forty times. The programming equivalent is the minimal reproduction - and it's the discipline I see skipped most often, by myself included. The urge to rerun the whole symphony is strong. Resist it.

## Listen before you fix

The hardest practice skill is honest listening: hearing what you actually played, not what you intended to play. Code has the same gap. The log says what the system actually did; my mental model says what I intended it to do. Every real bug lives in the space between those two, and the log is always the more honest witness.

## The part that doesn't transfer

Here's the difference, though. When a passage finally sings, it's done - until tomorrow, when your hands have forgotten half of it. Code stays fixed. The violin made me grateful for version control in a way no incident ever did.

There's no `git commit` for muscle memory. You just show up again tomorrow.
