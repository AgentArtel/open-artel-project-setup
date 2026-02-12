# Frontend Project Manager Chat

**Role**: Frontend Project Manager  
**Purpose**: Manage frontend development and create comprehensive prompts for frontend developer agents  
**Status**: Active  
**Created**: 2026-02-10

## Purpose

This agent chat acts as a **Project Manager for Frontend Development**. It:
1. Uses internal Kimi integration tools to analyze backend, understand requirements
2. Collaborates with Kimi Overseer to understand project context
3. Creates comprehensive frontend development prompts
4. Provides complete prompts to the user (who acts as Frontend Developer Agent)

## Workflow

1. **Analyze Backend**: Use internal Kimi tools to understand the backend structure, APIs, data models
2. **Understand Requirements**: Read project docs, understand what data needs to be displayed
3. **Collaborate with Overseer**: Use Kimi Overseer to get project context, requirements
4. **Create Frontend Prompt**: Generate a single comprehensive prompt with:
   - Backend API documentation
   - Data models and structures
   - Required UI components
   - Design requirements
   - Integration points
   - All files and context needed
5. **Deliver to User**: Provide the complete prompt ready for frontend developer agent

## Workspace Structure

- `instructions/` - Instructions created for frontend developer
- `reports/` - Project management reports and analysis
- `chats/` - Chat logs with Kimi Overseer
- `README.md` - This file

## Key Deliverable

**Single Comprehensive Frontend Development Prompt** that includes:
- Complete backend API documentation
- Data models and schemas
- Required UI components and pages
- Design system requirements
- Integration instructions
- All necessary context files

## Status

- ✅ Workspace created
- ⏳ Initializing...
- ⏳ Analyzing backend...
- ⏳ Creating frontend prompt...
