# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FinanceAI - Personal Finance Dashboard Interface** - A React-based financial management application with authentication and core financial tracking features. The app focuses on providing a clean, user-friendly interface for personal finance management.

## Current Project Status (as of 2025-08-26)

### ✅ **Completed Features:**

#### **Authentication System**
- Clean, professional AuthPage component with login/signup functionality
- Toggle between login and signup forms without tabs
- Google OAuth integration (mock implementation)
- Email/password authentication with form validation
- User state management and logout functionality
- Clean design matching modern auth patterns

#### **Core Application Features**
- **Dashboard Page**: Functional with recent transactions display
- **Spending Page**: Transaction tracking and category analysis
- **Goals Page**: Financial goal management with progress tracking
- **Navigation**: Sidebar with proper enabled/disabled state management

#### **UI/UX Implementation**
- Professional sidebar navigation with FinanceAI branding
- Header with search, filters, and action buttons
- Coming soon pages for disabled features (Budgets, Investments, Learn, Settings)
- Proper visual feedback for enabled vs disabled navigation items
- Responsive design with mobile support

### 🚫 **Disabled/Coming Soon Features:**
- **Budgets Page**: Grayed out, unclickable
- **Investments Page**: Grayed out, unclickable  
- **Learn Page**: Grayed out, unclickable
- **Settings Page**: Grayed out, unclickable

### 🔄 **Current State:**
- App starts with AuthPage for login/signup
- After authentication, users see the main dashboard
- Only Dashboard, Spending, and Goals pages are functional
- All demo data has been removed for clean slate
- Development server runs on port 3002

### 🎯 **Next Steps Identified:**
1. **Manual Transaction Entry**: Allow users to input transactions manually
2. **CSV Import Feature**: Enable bank statement uploads for transaction import
3. **Goal Creation**: Build functional goal-setting interface
4. **Data Visualization**: Enhance charts and graphs for spending analysis
5. **Mobile Responsiveness**: Ensure all pages work on mobile devices

## Development Commands

```bash
npm i                # Install dependencies
npm run dev          # Start development server (currently runs on port 3002)
npm run build        # Build for production
```

## Architecture & Technology Stack

**Core Technologies:**
- React 18 with TypeScript (TSX)
- Vite for build tooling with SWC plugin
- Radix UI component library (42+ components)
- Lucide React for icons
- Tailwind CSS for styling
- State-based routing (no external router)

**Authentication Architecture:**
- AuthPage component with form state management
- User authentication state in main App component
- Mock authentication with simulated login delays
- Logout functionality with state cleanup

**Navigation Architecture:**
- Sidebar navigation with enabled/disabled states
- Page switching via `currentPage` state
- Visual feedback for coming soon features
- Header buttons that adapt based on current page

**Component Structure:**
```
src/
├── components/
│   ├── AuthPage.tsx           # Login/Signup forms
│   ├── Dashboard.tsx          # Main dashboard (functional)
│   ├── SpendingPage.tsx       # Transaction tracking (functional)  
│   ├── GoalsPage.tsx          # Goal management (functional)
│   ├── BudgetsPage.tsx        # Coming soon page (disabled)
│   ├── InvestmentsPage.tsx    # Coming soon page (disabled)
│   ├── LearnPage.tsx          # Coming soon page (disabled)
│   ├── SettingsPage.tsx       # Coming soon page (disabled)
│   └── ui/                    # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       └── ... (42 total components)
└── App.tsx                    # Main app with auth & navigation
```

**Key Implementation Details:**
- No backend integration (frontend-only currently)
- Mock data for demonstration purposes
- Focus on UI/UX before feature development
- Clean separation between functional and coming soon features
- Proper TypeScript types throughout

**Security Considerations:**
- No real financial data linking yet (by design)
- Mock authentication for development
- Future: Plan for Plaid API integration with proper security measures
- Future: Backend authentication with JWT tokens

## Plan & Review Process

### Before starting new features
- Always create a plan in plan mode
- Write detailed implementation plans to `.claude/tasks/TASK_NAME.md`
- Include reasoning and task breakdown
- Research external dependencies if needed
- Focus on MVP approach
- Get plan approval before implementing

### While implementing
- Update plans as work progresses
- Document changes made for knowledge transfer
- Mark completed tasks in plans
- Test functionality thoroughly
- Ensure mobile responsiveness

### Current Priority Areas
1. **Manual Data Entry**: Enable users to input financial data without bank connections
2. **Data Import**: CSV upload functionality for bank statements  
3. **Enhanced Goals**: Better goal creation and tracking features
4. **UI Polish**: Mobile responsiveness and visual improvements
5. **Security Foundation**: Prepare for future backend integration

**Note**: The app is intentionally kept frontend-only until proper security measures can be implemented for financial data handling.