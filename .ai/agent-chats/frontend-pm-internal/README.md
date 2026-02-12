# Frontend PM Internal — Frontend Development (Internal System)

**Role**: Frontend Project Manager (Internal Development)  
**Purpose**: Build the frontend using internal Kimi integration, tools, and agent swarms  
**Status**: Active  
**Created**: 2026-02-10

## Purpose

This agent chat builds the frontend using our internal system:
- **This is a Cursor Chat** that coordinates and implements frontend development
- Uses Cursor's file tools to read backend and create frontend code
- Submits work via commits for Kimi Overseer review
- Coordinates with Kimi Overseer via instructions when needed
- Plans parallel development and implements components

## Workflow

1. **Read Frontend Dev Prompt**: Use the prompt created by Frontend PM (external)
2. **Plan Development**: Break down into components, pages, features
3. **Implement Frontend**: Build React components, API clients, WebSocket integration
4. **Submit for Review**: Commit with `[AGENT:cursor] [ACTION:submit] [TASK:FRONTEND-DEV]`
5. **Track Progress**: Create reports and track in workspace

## Workspace Structure

- `instructions/` - Instructions for Cursor and subagents
- `reports/` - Development progress reports
- `chats/` - Collaboration logs with Kimi Overseer
- `README.md` - This file

## Key Reference Files

- **Frontend dev prompt**: `.ai/agent-chats/frontend-pm/instructions/frontend-dev-prompt.md` (complete frontend requirements)
- **Backend analysis**: `.ai/agent-chats/frontend-pm/reports/backend-analysis.md` (backend API documentation)
- **Agent swarm patterns**: `.ai/patterns/agent-swarm-*.md` (parallel development patterns)
- **Subagent templates**: `.agents/subagents/*-template.md` (subagent creation templates)

## Status

- ✅ Workspace created
- ✅ Initialization complete
- ✅ Frontend dev prompt reviewed
- ✅ Backend analysis reviewed
- ✅ Backend types reviewed
- ✅ Development plan created (see `reports/development-plan.md`)
- ✅ **Phase 1.1 Complete** - Project setup finished (see `reports/phase-1.1-completion.md`)
- ✅ **Phase 1.2 Complete** - Type definitions copied (see `reports/phase-1.2-completion.md`)
- ⏳ **Phase 1.3 Next** - Create API client (see `instructions/phase-1.3-api-client.md`)

