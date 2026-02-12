---
name: Plans Folder Organization
overview: "Organize the `.cursor/plans/` folder into three categories: implemented plans (completed), draft plans (pending/review), and archived plans (inactive/superseded), with documentation explaining the structure."
todos:
  - id: create-folders
    content: "Create three folder directories: implemented/, draft/, archived/"
    status: pending
  - id: create-main-readme
    content: Create .cursor/plans/README.md documenting the organization system, plan lifecycle, and folder purposes
    status: pending
    dependencies:
      - create-folders
  - id: check-phase7
    content: Check phase_7_integration_setup_e230e0f6.plan.md status and determine if it should go to implemented/, draft/, or archived/
    status: pending
  - id: move-implemented
    content: Move 6 implemented plans (complete_moonshot, f1, phase_2, phase_4_impl, phase_5_impl, upstream_update) to implemented/
    status: pending
    dependencies:
      - create-folders
  - id: move-draft
    content: Move 8 draft plans (concept_1, concept_2, f2, f3, phase_3, phase_5_moonshot, phase_6, recommendations) to draft/
    status: pending
    dependencies:
      - create-folders
  - id: handle-phase7
    content: Move phase_7 plan to appropriate folder based on status check
    status: pending
    dependencies:
      - check-phase7
      - create-folders
  - id: verify-organization
    content: Verify all plans are organized correctly and no files remain in root plans/ directory
    status: pending
    dependencies:
      - move-implemented
      - move-draft
      - handle-phase7
isProject: false
---

# Plans Folder Organization

## Overview

Reorganize the `.cursor/plans/` folder into a structured system with three categories:

1. `**implemented/**` - Plans that were fully executed (all todos completed)
2. `**draft/**` - Plans pending implementation or needing review
3. `**archived/**` - Plans that are no longer active (superseded, abandoned, or obsolete)

## Current State Analysis

Based on plan file status checks:

### Implemented Plans (All todos completed)

- `complete_moonshot_kimi_feature_integration_407e4d47.plan.md` - 7 phases completed
- `f1_learn_from_past_configurations_implementation_9202f570.plan.md` - All 11 tasks completed
- `phase_2_session_management_41bb1321.plan.md` - All tasks completed
- `phase_4_implementation_728a6100.plan.md` - All tasks completed
- `phase_5_implementation_d4390577.plan.md` - All tasks completed
- `upstream_update_workflow_3fe91ef7.plan.md` - All tasks completed

### Draft Plans (Pending or in review)

- `concept_1_open_artel_dashboard_ebdb6620.plan.md` - All todos pending
- `concept_2_task_lifecycle_documentation_f3855a65.plan.md` - All todos pending
- `f2_self-improvement_loop_implementation_8e49988c.plan.md` - All todos pending
- `f3_context-aware_task_assignment_implementation_e15541c1.plan.md` - All todos pending
- `phase_3_dynamic_subagent_patterns_dd8050e4.plan.md` - All todos pending
- `phase_5_moonshot_api_integration_104c5cf1.plan.md` - All todos pending
- `phase_6_advanced_features_b5e25469.plan.md` - All todos pending
- `recommendations_and_enhancements_33b6b15a.plan.md` - All todos pending

### Special Cases

- `phase_7_integration_setup_e230e0f6.plan.md` - Needs status check (file is very small, may be incomplete)

## Implementation Tasks

### Task 1: Create Folder Structure

- Create `.cursor/plans/implemented/` directory
- Create `.cursor/plans/draft/` directory
- Create `.cursor/plans/archived/` directory

### Task 2: Create Documentation

- Create `.cursor/plans/README.md` explaining:
- Purpose of each folder
- When to use each folder
- How to move plans between folders
- Plan lifecycle (draft → implemented, draft → archived)
- Naming conventions
- Status tracking guidelines

### Task 3: Move Implemented Plans

Move plans with all todos completed to `implemented/`:

- `complete_moonshot_kimi_feature_integration_407e4d47.plan.md`
- `f1_learn_from_past_configurations_implementation_9202f570.plan.md`
- `phase_2_session_management_41bb1321.plan.md`
- `phase_4_implementation_728a6100.plan.md`
- `phase_5_implementation_d4390577.plan.md`
- `upstream_update_workflow_3fe91ef7.plan.md`

### Task 4: Move Draft Plans

Move plans with pending todos to `draft/`:

- `concept_1_open_artel_dashboard_ebdb6620.plan.md`
- `concept_2_task_lifecycle_documentation_f3855a65.plan.md`
- `f2_self-improvement_loop_implementation_8e49988c.plan.md`
- `f3_context-aware_task_assignment_implementation_e15541c1.plan.md`
- `phase_3_dynamic_subagent_patterns_dd8050e4.plan.md`
- `phase_5_moonshot_api_integration_104c5cf1.plan.md`
- `phase_6_advanced_features_b5e25469.plan.md`
- `recommendations_and_enhancements_33b6b15a.plan.md`

### Task 5: Handle Special Cases

- Check `phase_7_integration_setup_e230e0f6.plan.md` status:
- If incomplete/empty: Move to `archived/` or `draft/` based on intent
- If completed: Move to `implemented/`
- If superseded: Move to `archived/` with note

### Task 6: Create Folder READMEs (Optional)

- Create `.cursor/plans/implemented/README.md` - Brief description of implemented plans
- Create `.cursor/plans/draft/README.md` - Guidelines for draft plans
- Create `.cursor/plans/archived/README.md` - Guidelines for archiving plans

## Folder Structure After Organization

```javascript
.cursor/plans/
├── README.md                    # Main documentation
├── implemented/                 # Fully executed plans
│   ├── complete_moonshot_kimi_feature_integration_407e4d47.plan.md
│   ├── f1_learn_from_past_configurations_implementation_9202f570.plan.md
│   ├── phase_2_session_management_41bb1321.plan.md
│   ├── phase_4_implementation_728a6100.plan.md
│   ├── phase_5_implementation_d4390577.plan.md
│   └── upstream_update_workflow_3fe91ef7.plan.md
├── draft/                       # Plans pending implementation or review
│   ├── concept_1_open_artel_dashboard_ebdb6620.plan.md
│   ├── concept_2_task_lifecycle_documentation_f3855a65.plan.md
│   ├── f2_self-improvement_loop_implementation_8e49988c.plan.md
│   ├── f3_context-aware_task_assignment_implementation_e15541c1.plan.md
│   ├── phase_3_dynamic_subagent_patterns_dd8050e4.plan.md
│   ├── phase_5_moonshot_api_integration_104c5cf1.plan.md
│   ├── phase_6_advanced_features_b5e25469.plan.md
│   └── recommendations_and_enhancements_33b6b15a.plan.md
└── archived/                    # Inactive/superseded plans
    └── (empty initially, or phase_7 if superseded)
```

## Documentation Content for README.md

The main README should include:

1. **Purpose**: Explain the three-folder organization system
2. **Folder Descriptions**:

- `implemented/` - Plans that were fully executed (all todos marked completed)
- `draft/` - Plans pending implementation, under review, or ready for execution
- `archived/` - Plans that are no longer active (superseded, abandoned, obsolete)

1. **Plan Lifecycle**:

- New plans start in `draft/`
- When all todos are completed, move to `implemented/`
- If a plan is superseded or abandoned, move to `archived/`

1. **Naming Conventions**: Keep existing naming (descriptive-name-hash.plan.md)
2. **Status Tracking**: Plans should have todos with status (pending/completed)
3. **Moving Plans**: Guidelines for when and how to move plans between folders

## Files to Create

1. `.cursor/plans/README.md` - Main documentation
2. `.cursor/plans/implemented/` - Directory (with optional README)
3. `.cursor/plans/draft/` - Directory (with optional README)
4. `.cursor/plans/archived/` - Directory (with optional README)

## Files to Move

### To `implemented/`:

- `complete_moonshot_kimi_feature_integration_407e4d47.plan.md`
- `f1_learn_from_past_configurations_implementation_9202f570.plan.md`
- `phase_2_session_management_41bb1321.plan.md`
- `phase_4_implementation_728a6100.plan.md`
- `phase_5_implementation_d4390577.plan.md`
- `upstream_update_workflow_3fe91ef7.plan.md`

### To `draft/`:

- `concept_1_open_artel_dashboard_ebdb6620.plan.md`
- `concept_2_task_lifecycle_documentation_f3855a65.plan.md`
- `f2_self-improvement_loop_implementation_8e49988c.plan.md`
- `f3_context-aware_task_assignment_implementation_e15541c1.plan.md`
- `phase_3_dynamic_subagent_patterns_dd8050e4.plan.md`
- `phase_5_moonshot_api_integration_104c5cf1.plan.md`
- `phase_6_advanced_features_b5e25469.plan.md`
- `recommendations_and_enhancements_33b6b15a.plan.md`

### To `archived/` or `draft/` (needs review):

- `phase_7_integration_setup_e230e0f6.plan.md` - Check status first

## Verification

- Verify all implemented plans are in `implemented/`
- Verify all draft plans are in `draft/`

