# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal Finance Dashboard Interface - A React-based financial management application built from a Figma design. This is a single-page application that displays various financial views including dashboard, spending analysis, budgets, goals, investments, and financial education.

## Plan & Review

### Before starting work
•⁠  ⁠Always in plan mode to make a plan
•⁠  ⁠After get the plan, make sure you Write the plan to .claude/tasks/TASK_NAME.md.
•⁠  ⁠The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
•⁠  ⁠If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
•⁠  ⁠Don't over plan it, always think MVP.
•⁠  ⁠Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing
•⁠  ⁠You should update the plan as you work.
•⁠  ⁠After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.
•⁠  ⁠After you complete the task, you should update the plan to mark the task as completed.

## Development Commands

```bash
npm i                # Install dependencies
npm run dev          # Start development server (runs on port 3000)
npm run build        # Build for production (outputs to 'build' directory)
```

## Architecture & Technology Stack

**Core Technologies:**
- React 18 with TypeScript (TSX)
- Vite for build tooling with SWC plugin for fast compilation
- Extensive Radix UI component library for accessible primitives
- Recharts for data visualization
- Lucide React for icons
- Class Variance Authority + clsx for component styling utilities

**Project Structure:**
- Single-page application with client-side routing via state management
- Main navigation handled in `App.tsx` with page switching based on `currentPage` state
- Component-based architecture with dedicated page components (`Dashboard.tsx`, `SpendingPage.tsx`, etc.)
- Comprehensive UI component library in `src/components/ui/` built on Radix UI primitives
- Custom Figma-imported components in `src/components/figma/`

**Key Architectural Patterns:**
- No external routing library - uses simple state-based page switching in main App component
- Extensive alias configuration in Vite for package versioning
- UI components follow consistent patterns using Radix UI + styling utilities
- Mock data and static content (no backend integration currently)

**Component Organization:**
- `src/components/ui/` - Reusable UI primitives (buttons, inputs, cards, etc.)
- `src/components/` - Page-level components for each financial view
- `src/components/figma/` - Components imported from Figma design

The application uses a sidebar navigation pattern with a main content area that renders different page components based on the selected navigation item.