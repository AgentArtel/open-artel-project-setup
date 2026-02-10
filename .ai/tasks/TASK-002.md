## TASK-002: Multi-Agent Git Workflow and Kimi Code Integration Research

- **Status**: DONE
- **Priority**: P1-High
- **Type**: Research
- **Depends on**: TASK-001
- **Blocks**: All implementation tasks for agent automation

### Context

The current multi-agent starter kit uses a simple branch-per-agent model with manual handoffs. The human PM relays task briefs between agents, reviews work, and merges. This works but doesn't scale — every handoff requires human presence, there's no automated review chain, no inter-agent communication layer, and no persistent project overseer.

Kimi Code (by Moonshot AI) offers a CLI agent with subagent orchestration, agent skills, flow skills, print mode for automation, and wire mode for programmatic integration. Integrating Kimi Code as a persistent project overseer could automate the handoff chain and reduce human bottleneck.

### Objective

Produce a comprehensive research and design document covering:
1. Git-based agent branch workflow with automated handoffs
2. Commit message routing specification
3. Agent communication folder structure
4. Kimi Code API/CLI capabilities assessment
5. Kimi Code subagent architecture design
6. Agent Skills and Flow Skills strategy
7. Print/Wire mode integration for automation
8. Terminal connection and work delegation
9. Project evaluation metrics
10. Project templates and mono-repo support
11. Technical feasibility assessment
12. Phased implementation roadmap

### Deliverable

Research document: `.ai/tasks/TASK-002-research.md` — 12 sections, ~1,500 lines, covering all areas with feasibility ratings and an 8-phase implementation roadmap.

### Primary Research Sources

- **Claude Code Git Integration**: https://code.claude.com/docs/en/quickstart#step-6-use-git-with-claude-code
- **Kimi Code CLI Getting Started**: https://moonshotai.github.io/kimi-cli/en/guides/getting-started.html
- **Kimi Code Documentation**: https://www.kimi.com/code/docs/en/
- **Moonshot AI Platform**: https://platform.moonshot.ai/docs/overview
- **Kimi K2 Agent Setup**: https://platform.moonshot.ai/docs/guide/use-kimi-k2-to-setup-agent
- **Moonshot API Multi-turn**: https://platform.moonshot.ai/docs/guide/engage-in-multi-turn-conversations-using-kimi-api
- **Moonshot Streaming**: https://platform.moonshot.ai/docs/guide/utilize-the-streaming-output-feature-of-kimi-api
- **Moonshot Official Tools**: https://platform.moonshot.ai/docs/guide/use-official-tools
- **Moonshot Files API**: https://platform.moonshot.ai/docs/api/files

### Acceptance Criteria

- [x] Git branch workflow with agent-specific branches documented
- [x] Commit message routing format specified
- [x] Automated handoff chain designed (commit -> review -> merge -> next)
- [x] Agent communication folders specified (.ai/chats/, reports/, etc.)
- [x] Kimi Code CLI capabilities documented from primary sources
- [x] Kimi Code subagent architecture designed (overseer + worker agents)
- [x] Agent Skills strategy for codifying Open Artel conventions
- [x] Flow Skills with Mermaid diagrams for workflow automation
- [x] Print Mode integration for Git hooks / CI/CD
- [x] Wire Mode architecture for custom coordination
- [x] Terminal connection pattern for agent-to-overseer communication
- [x] Work delegation system (agents taking on human relay work)
- [x] Project evaluation metrics system designed
- [x] Project template system for specific project types
- [x] Mono-repo coordination pattern documented
- [x] Feasibility ratings for each component
- [x] Phased implementation roadmap (8 phases)
- [x] All primary research sources cited
- [x] Compatible with existing Even-Openclaw patterns
- [x] No new directories created outside .ai/tasks/

### Notes

This research was requested by the human PM during brainstorming. The user provided extensive Kimi Code documentation inline and identified key integration points. Cursor also generated a parallel research plan that aligns with this task's scope.

Individual ideas from this research have been tracked in `.ai/ideas/` (IDEA-001 through IDEA-018) for future prioritization.
