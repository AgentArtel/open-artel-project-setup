## TASK-002: Explore multi-agent Git workflow and Kimi Code integration

- **Status**: PENDING
- **Priority**: P1-High
- **Type**: Research
- **Depends on**: TASK-001
- **Blocks**: Future automation and scaling tasks

### Context

The current system uses manual coordination via markdown files. To scale this framework across multiple projects and enable true multi-agent collaboration, we need to explore:

1. **Git-based agent workflow**: Each agent/subagent operates on dedicated branches with commit-triggered handoffs in specific sequence (agent → agent branch → agent branch)
2. **Kimi Code integration**: Persistent development assistant that tracks project lifetime and coordinates agent work; agents can open terminal connections to Kimi Code agent
3. **Conversational Git operations**: Making Git operations more accessible and agent-friendly; integrate Git with Claude Code
4. **Agent communication channels**: Structured folders for agent-to-agent chats, reports, and reviews (literal folders for chats where agents talk to each other)
5. **Commit message routing**: Using commit message headers to automatically route work between agents; commit message header determines routing
6. **Automated commit workflow**: Commit → triggers review commit → project updates → commit message for report and assigned task → agent does work → pushes to branch for review → commits back with response report and log of fixes applied → next steps → push to next branch → repeat until task sprint completed
7. **Project evaluation**: System to assess how well project configurations performed from agent level
8. **Project templates**: Templates for specific projects (not just generic starter kits)
9. **Mono-repo oversight**: Higher-tier coordination for managing multiple connected projects; oversees multiple connected projects
10. **Work delegation**: Agents taking on work for the human and passing tasks between each other

Current system is pure markdown with manual coordination. This exploration will determine feasibility and design patterns for automation while maintaining simplicity.

### Objective

Research and design a scalable multi-agent coordination system that:
- Uses Git branches and commits as the coordination mechanism
- Integrates Kimi Code as a persistent project overseer
- Enables automated handoffs between agents via commit triggers
- Maintains the simplicity and markdown-first approach where possible
- Supports both single-project and mono-repo configurations

Deliverable: Comprehensive design document exploring how these components work together, with recommendations for implementation phases.

### Scope

**In scope:**
- Research Kimi Code API capabilities and integration patterns
- Design Git workflow for multi-agent branch coordination with specific handoff sequence
- Explore commit message header routing system (header determines routing)
- Design agent communication folder structure (`.ai/chats/`, `.ai/reports/`, `.ai/instructions/`, `.ai/reviews/`, etc.)
- Research Claude Code CLI and how it could integrate with Kimi Code
- Design terminal connection mechanism (agents opening terminal connected to Kimi Code agent)
- Design automated commit workflow (commit → review → work → push → response report → next branch)
- Design project evaluation/metrics system (evaluate from agent level)
- Design project templates for specific project types
- Explore mono-repo coordination patterns (oversees multiple connected projects)
- Consider integration with Cursor, Claude Code, and Lovable agents
- Design work delegation system (agents taking on work for human, passing tasks)
- Document technical feasibility and implementation approach

**Out of scope:**
- Actual implementation (this is research/design phase)
- Breaking existing markdown-based coordination
- Adding runtime dependencies to this repo (research docs only)

### Acceptance Criteria

- [ ] Research document covers all 10 idea areas listed in context
- [ ] Kimi Code API capabilities documented with relevant endpoints
- [ ] **Kimi Code CLI features comprehensively documented** (Agent Skills, Subagents, Print Mode, Wire Mode)
- [ ] **Subagent architecture design** for modeling Claude Code, Cursor, Lovable as subagents
- [ ] **Agent Skills strategy** for codifying Open Artel conventions
- [ ] **Flow Skills design** for multi-step agent handoff workflows
- [ ] Git workflow diagram/description for agent branch handoffs with specific sequence (agent → agent branch → agent branch)
- [ ] Detailed automated commit workflow specification (commit → review commit → project updates → work → push → response report → next branch → repeat until sprint complete)
- [ ] Commit message routing specification (header format, routing rules; header determines routing)
- [ ] Agent communication folder structure proposed (literal folders for chats, reports, instructions, reviews)
- [ ] Terminal connection mechanism design (agents opening terminal connected to Kimi Code agent)
- [ ] Work delegation system design (agents taking on work for human, passing tasks)
- [ ] Project template system design (templates for specific project types)
- [ ] Integration patterns for Claude Code CLI + Kimi Code explored
- [ ] **Print Mode integration** for Git hooks and automation
- [ ] **Wire Mode architecture** for custom coordination layer
- [ ] **Session management strategy** for persistent project overseer
- [ ] Project evaluation approach defined
- [ ] Mono-repo coordination pattern described
- [ ] Phased implementation plan (what to build first, dependencies) - **expanded to 8 phases**
- [ ] Technical feasibility assessment for each component
- [ ] **Cost/performance analysis** (token budgets, API call limits, speed considerations)
- [ ] Recommendations on what to keep markdown-only vs. what to automate
- [ ] Document follows markdown conventions and is stored in `.ai/tasks/`

### Notes

**Key questions to explore:**
1. Can Kimi Code API be used programmatically to create a persistent agent that monitors Git commits?
2. How do commit hooks/triggers work with agent handoffs? (GitHub Actions? Local hooks?)
3. What commit message format enables reliable routing? (e.g., `[AGENT: Claude Code] [ACTION: review] [TASK: TASK-002]`)
4. How do agent "chats" work? Are these markdown files, API calls, or both?
5. Can Claude Code CLI be extended or wrapped to add Kimi Code integration?
6. How do we evaluate project configurations? Metrics? Success criteria?
7. What's the relationship between single-project `.ai/` and mono-repo coordination?
8. **NEW**: What is the exact sequence for agent branch handoffs? (agent → agent branch → agent branch)
9. **NEW**: How does the automated commit workflow work step-by-step? (commit → triggers review commit → project updates → commit message for report → work → push → commit back with response report and log → next steps → push to next branch → repeat until sprint complete)
10. **NEW**: How do agents open terminal connections to Kimi Code agent? What's the mechanism?
11. **NEW**: How do agents take on work for the human and pass tasks between each other?
12. **NEW**: What are project templates for specific projects? How do they differ from generic starter kits?
13. **NEW**: How does the commit message header determine routing? What's the parsing and routing logic?
8. **NEW**: Can we use Kimi Code's subagent system to model Claude Code, Cursor, and Lovable as subagents?
9. **NEW**: How can Agent Skills be used to codify Open Artel conventions (task format, boundaries, Git workflow)?
10. **NEW**: Can Flow Skills define the multi-step agent handoff workflow (commit → review → merge → next agent)?
11. **NEW**: How can Print Mode be integrated into Git hooks for automated commit message generation and routing?
12. **NEW**: Can Wire Mode be used to build a custom coordination layer that bridges Git events and agent actions?
13. **NEW**: How can session management enable a persistent "project overseer" that tracks project lifetime?
14. **NEW**: Can the Task tool be used for agent-to-agent delegation (e.g., Claude Code → Cursor for implementation)?
15. **NEW**: How can approval workflows integrate with Git commit review process?
16. **NEW**: Can context compression/summarization help maintain long project histories without token bloat?

**Resources to review:**
- Kimi Code API docs: https://platform.moonshot.ai/docs/overview
- Kimi Code agent support: https://platform.moonshot.ai/docs/guide/agent-support
- Kimi Code multi-turn conversations: https://platform.moonshot.ai/docs/guide/engage-in-multi-turn-conversations-using-kimi-api
- Kimi Code K2 setup: https://platform.moonshot.ai/docs/guide/use-kimi-k2-to-setup-agent
- Claude Code Git integration: https://code.claude.com/docs/en/quickstart#step-6-use-git-with-claude-code
- Claude Code CLI docs: https://code.claude.com/docs/en/quickstart
- Kimi Code CLI documentation: https://www.kimi.com/code/docs/en/

**Kimi Code advanced features to explore:**

**Kimi Code Membership & Performance:**
- Elite performance: Up to 100 Tokens/s output speed
- 5-hour token budget handles 300-1,200 API calls for continuous workloads
- Seamless integration with Kimi Code CLI, Claude Code, and Roo Code
- One-click authentication via `/login` command
- Device and session management via Kimi Code Console
- Session security: Auto-expire after 30 days inactivity

**Kimi Code CLI Core Capabilities:**
- **Agent mode vs Shell mode**: Switch with Ctrl-X, agent mode for AI processing, shell mode for direct command execution
- **Thinking mode**: Deep reasoning for complex problems (`--thinking` flag or `/model` command)
- **Multi-line input**: Ctrl-J or Alt-Enter for pasting code snippets/error logs
- **Clipboard/image paste**: Ctrl-V for text/images (requires `image_in` capability)
- **Path completion**: `@` prefix for file/directory auto-completion
- **Approval system**: Request confirmation for file writes, shell commands, MCP calls
- **YOLO mode**: Auto-approve all operations (`--yolo` flag or `/yolo` command)

**Session & Context Management:**
- **Session resuming**: `--continue` for most recent, `--session <id>` for specific session
- **Session switching**: `/sessions` command to view and switch between sessions
- **Startup replay**: Automatically replays conversation history when resuming
- **Context compression**: Auto-compress when context grows too long
- **Manual context control**: `/clear` to reset, `/compact` to summarize and replace

**Agent Skills System:**
- **Skill discovery**: Layered loading (built-in → user-level → project-level)
- **Skill locations**: `~/.config/agents/skills/`, `.agents/skills/`, etc.
- **Skill format**: YAML frontmatter + Markdown content in `SKILL.md`
- **Flow skills**: Special skills with Mermaid/D2 diagrams for multi-step workflows
- **Skill invocation**: `/skill:<name>` for standard skills, `/flow:<name>` for flow skills
- **Use cases**: Code style guidelines, security audits, Git commit conventions, project standards

**Agents and Subagents Architecture:**
- **Custom agent files**: YAML format with system prompts, tools, and subagents
- **Agent inheritance**: `extend: default` to inherit and override
- **Built-in agents**: `default` (general use) and `okabe` (experimental)
- **Subagent system**: Main agent can launch subagents via `Task` tool
- **Isolated context**: Subagents run independently, return results to main agent
- **Parallel processing**: Multiple subagents can work simultaneously
- **Dynamic subagents**: `CreateSubagent` tool for runtime subagent creation
- **System prompt variables**: `${KIMI_NOW}`, `${KIMI_WORK_DIR}`, `${KIMI_AGENTS_MD}`, `${KIMI_SKILLS}`

**Built-in Tools (Critical for Integration):**
- **Task**: Dispatch subagent to execute task (isolated context)
- **SetTodoList**: Manage todo list, track task progress
- **Shell**: Execute shell commands (requires approval)
- **ReadFile/ReadMediaFile**: Read text/image/video files
- **Glob/Grep**: File pattern matching and content search
- **WriteFile/StrReplaceFile**: File write/edit operations (requires approval)
- **SearchWeb/FetchURL**: Web search and URL fetching
- **Think**: Record thinking process for complex reasoning
- **SendDMail**: Delayed message for checkpoint rollback
- **CreateSubagent**: Dynamically create new subagent types

**Print Mode (Automation):**
- **Non-interactive execution**: `--print` flag for scripting/automation
- **Auto-approval**: Implicitly enables `--yolo` mode
- **JSON format**: `--output-format=stream-json` for programmatic processing
- **Message format**: Unified JSON format for input/output
- **Use cases**: CI/CD integration, batch processing, tool integration

**Wire Mode (Programmatic Integration):**
- **Low-level protocol**: JSON-RPC 2.0 based bidirectional communication
- **Protocol version**: 1.3 (current)
- **Message types**: Events (notifications) and Requests (require response)
- **Key methods**: `initialize`, `prompt`, `replay`, `cancel`
- **Event types**: `TurnBegin`, `TurnEnd`, `StepBegin`, `ContentPart`, `ToolCall`, `ToolResult`, etc.
- **Request types**: `ApprovalRequest`, `ToolCallRequest`
- **Use cases**: Custom UIs, application integration, automated testing
- **Kimi Agent (Rust)**: Lightweight Wire-only server alternative

**IDE Integration:**
- **Agent Client Protocol (ACP)**: Integration with IDEs via ACP
- **Zed support**: Configuration in `~/.config/zed/settings.json`
- **JetBrains IDEs**: Via AI Chat plugin, configure ACP agents
- **VS Code**: CLI login command supported in integrated terminal

**Key Integration Opportunities:**
1. **Persistent overseer agent**: Use Kimi Code CLI with session management to track project lifetime
2. **Subagent coordination**: Leverage subagent system for Claude Code, Cursor, Lovable coordination
3. **Agent Skills for project standards**: Create skills for Open Artel conventions, task formats, Git workflows
4. **Flow skills for workflows**: Define multi-step agent handoff workflows as flow skills
5. **Print Mode for automation**: Use print mode in Git hooks/actions for automated processing
6. **Wire Mode for custom coordination**: Build custom coordination layer using Wire protocol
7. **Task tool for agent delegation**: Use Task tool to dispatch work to specialized subagents
8. **Session persistence**: Leverage session management for long-running project oversight
9. **Context management**: Use context compression and summarization for long project histories
10. **Approval workflows**: Integrate approval system with Git commit review process

**Design principles to maintain:**
- Keep markdown-first where possible (agent chats could be markdown files)
- Don't break existing manual coordination (add automation as enhancement)
- Maintain simplicity — complex automation should be optional
- Preserve the three-agent model (Claude Code, Cursor, Lovable) as the base

**Potential implementation phases:**

**Phase 1: Foundation (Markdown-based)**
- Git branch workflow design with specific handoff sequence (agent → agent branch → agent branch)
- Commit message routing specification (header determines routing)
- Agent communication folder structure (`.ai/chats/`, `.ai/reports/`, `.ai/instructions/`, `.ai/reviews/`)
- Basic agent handoff protocol
- Detailed automated commit workflow specification (commit → review → work → push → response report → next branch)

**Phase 2: Kimi Code CLI Integration**
- Set up Kimi Code CLI with persistent session
- Create Agent Skills for Open Artel conventions
- Define custom agent file for project overseer role
- Test session management and context persistence
- Design terminal connection mechanism (agents opening terminal connected to Kimi Code agent)
- Integrate Git with Claude Code for conversational Git operations

**Phase 3: Subagent Architecture**
- Model Claude Code, Cursor, Lovable as subagents
- Create subagent definitions with specialized system prompts
- Implement Task tool delegation between agents (work delegation system)
- Test isolated context and result passing
- Design work passing mechanism (agents taking on work for human, passing tasks)

**Phase 4: Flow Skills for Workflows**
- Design Flow Skills for agent handoff workflows
- Create Mermaid/D2 diagrams for commit → review → merge → next agent
- Test automated workflow execution via `/flow:` commands
- Integrate with Git commit triggers

**Phase 5: Automation Layer**
- Git hooks integration (pre-commit, post-commit, post-merge)
- Print Mode for automated commit message generation
- Automated routing based on commit message headers
- GitHub Actions integration (if applicable)

**Phase 6: Wire Mode Coordination**
- Custom coordination layer using Wire protocol
- Real-time event handling (TurnBegin, ToolCall, etc.)
- Approval workflow integration
- Custom UI/interface for agent coordination (optional)

**Phase 7: Project Evaluation**
- Metrics collection system (evaluate from agent level)
- Success criteria definition
- Performance tracking
- Configuration comparison tools
- Project template system for specific project types

**Phase 8: Mono-repo Coordination**
- Higher-tier coordination patterns
- Multi-project oversight
- Cross-project agent coordination
- Shared skills and conventions

