---
name: verification-before-completion
description: The iron law of verification. No completion claims without fresh evidence. Three-level verification framework. Stub detection. Rationalization prevention.
---

## The Iron Law

**No completion claims without fresh verification evidence.**

Not "it should work." Not "I'm confident." Not "I just tested it mentally." Run the actual command, read the actual output, confirm it actually passes.

## Three-Level Verification

Before claiming any feature, task, or change is complete, verify at all three levels:

### Level 1: Exists

Does the thing actually exist?

- File was created and is in the expected path
- Function/component was defined
- Route/endpoint was added
- Configuration entry is present

**How to check**: `ls`, `grep`, read the file.

### Level 2: Substantive

Is it real implementation, not a stub or placeholder?

- Component renders actual content (not `<div>Placeholder</div>`)
- API route queries the database (not `return { ok: true }`)
- Function contains actual logic (not `// TODO: implement`)
- Form handler does something (not just `e.preventDefault()`)

**How to check**: Read the implementation. Look for stub patterns (see below).

### Level 3: Wired

Is it connected to the rest of the system?

- Component is imported and rendered somewhere
- API route is called by the frontend
- Function is invoked (not just defined)
- State is both set and displayed

**How to check**: Search for imports, references, and usage beyond the definition.

### Stub Detection Patterns

These are the most common ways "done" work is actually incomplete:

**UI stubs**:
- `return <div>Component Name</div>` — placeholder render
- `return null` or `return <></>` — empty render
- `onClick={() => {}}` — empty handler
- `onChange={() => console.log('clicked')}` — log-only handler

**API stubs**:
- `return Response.json({ message: "Not implemented" })` — static response
- `return Response.json([])` — empty array with no actual query
- Handler only logs the request without processing it

**Wiring gaps**:
- `fetch('/api/endpoint')` with no `await`, no `.then`, no error handling
- State declared (`useState`) but never rendered in JSX
- Database query result not returned in the response
- Component exists but is never imported anywhere

## The Gate

Before claiming ANY task, step, or feature is done:

1. **Identify** what command or check proves the claim
2. **Execute** the command freshly (not from memory, not from a previous run)
3. **Read** the complete output and exit code
4. **Verify** the output actually confirms the claim — at all three levels
5. **Only then** mark it done

## Common Claims and Their Verification

| Claim | Insufficient | Required |
|-------|-------------|----------|
| "Tests pass" | "I ran them earlier" | Run `npm test` NOW, show output |
| "Build succeeds" | "It built before my change" | Run `npm run build` NOW |
| "No regressions" | "I only changed one file" | Run the full test suite |
| "Linter is clean" | "I followed the patterns" | Run `npm run lint` NOW |
| "Feature works" | "I created the component" | Check all 3 levels: exists, substantive, wired |
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
