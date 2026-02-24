---
name: verification-before-completion
description: The iron law of verification. No completion claims without fresh evidence. Includes rationalization prevention.
---

## The Iron Law

**No completion claims without fresh verification evidence.**

Not "it should work." Not "I'm confident." Not "I just tested it mentally." Run the actual command, read the actual output, confirm it actually passes.

## The Gate

Before claiming ANY task, step, or feature is done:

1. **Identify** what command proves the claim
2. **Execute** the command freshly (not from memory, not from a previous run)
3. **Read** the complete output and exit code
4. **Verify** the output actually confirms the claim
5. **Only then** mark it done

## Common Claims and Their Verification

| Claim | Insufficient | Required |
|-------|-------------|----------|
| "Tests pass" | "I ran them earlier" | Run `npm test` NOW, show output |
| "Build succeeds" | "It built before my change" | Run `npm run build` NOW |
| "No regressions" | "I only changed one file" | Run the full test suite |
| "Linter is clean" | "I followed the patterns" | Run `npm run lint` NOW |
| "Task brief is complete" | "I filled in all sections" | Read it back, check every field |
| "Board is updated" | "I'll do it after" | Do it NOW, before claiming done |

For markdown-only repos (like this one): verify by reading back what you wrote, checking cross-references, and confirming file paths exist.

## Rationalization Prevention

These are the ways agents skip verification. If you catch yourself thinking any of these — that's the signal to verify MORE, not less.

| Rationalization | Counter |
|----------------|---------|
| "I'm confident it works" | Confidence is not evidence. Run it. |
| "It's just a small change" | Small changes break things too. Verify. |
| "I'll verify at the end" | Verify NOW. Bugs compound. |
| "The tests probably pass" | "Probably" means "I don't know." Run them. |
| "I just need to commit" | Committing broken work helps nobody. |
| "This is taking too long" | Shipping broken work takes longer to fix. |
| "I already tested something similar" | Similar is not identical. Test THIS. |
| "It's obvious it works" | If it's obvious, verification takes 5 seconds. Do it. |

## Red Flags in Language

These words in a completion claim mean verification was skipped:

- "should" → didn't verify
- "probably" → didn't verify
- "I believe" → didn't verify
- "seems to" → didn't verify
- "I'm fairly sure" → didn't verify
- Expressing satisfaction before running verification → **critical violation**

## When This Applies

- Before marking any task DONE
- Before committing with `[ACTION:submit]`
- Before reporting completion to another agent
- Before updating `.ai/board.md` status
- Before telling the human "it's done"

Every single time. No exceptions. No "just this once."
