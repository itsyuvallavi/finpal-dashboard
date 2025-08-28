# Claude Code Project Initialization

## Initial Analysis Commands

Use the command `tree` to get an understanding of the project structure.

Start by reading the following files in order to understand the project:

1. **Read CLAUDE.md** if it exists to get project-specific development context
2. **Read README.md** to understand the project overview, setup, and usage
3. **Read package.json** (or requirements.txt for Python) to understand dependencies and scripts
4. **Read key configuration files** such as:
   - `.env.example` or `.env.local` - environment variables and API configurations
   - `next.config.js` or similar framework config files
   - Database configuration files (e.g., `prisma/schema.prisma`, `knexfile.js`)
   - `tailwind.config.js` or other styling configurations

## Key Directories and Files to Analyze

### Frontend Structure
Read key files in these directories:
- `src/` or root directory - main application code
- `pages/` or `app/` - routing and page components
- `components/` - reusable UI components
- `lib/` or `utils/` - utility functions and helpers
- `styles/` - CSS and styling files
- `public/` - static assets

### Backend Structure (if applicable)
Read key files in:
- `api/` or `server/` - API routes and server logic
- `models/` - database models and schemas
- `middleware/` - authentication, validation, error handling
- `services/` - external API integrations (Plaid, OpenAI, etc.)
- `database/` - migrations, seeds, connection setup

### Key Files to Prioritize
1. **Main application entry points**:
   - `src/app.js`, `pages/_app.js`, or `index.js`
   - Main layout components
   - Authentication setup files

2. **Core feature implementations**:
   - User authentication logic
   - Database connection and models
   - API integration files (Plaid, financial data)
   - AI/ML processing files

3. **Configuration and setup**:
   - Environment variable examples
   - Database schema or migration files
   - API route definitions
   - Security and middleware setup

## Analysis and Reporting

After reading the above files, explain back to me:

### 1. Project Structure
- Overall organization and architecture pattern
- Frontend framework and structure (React, Next.js, etc.)
- Backend setup (if full-stack)
- Database structure and ORM/query builder used
- Key directories and their purposes

### 2. Project Purpose and Goals
- Main functionality and features
- Target users and use cases
- Core value proposition
- Current development phase or version

### 3. Key Files and Their Purposes
- **Entry points**: Main app files that bootstrap the application
- **Core components**: Essential UI components and their functionality
- **API integration**: Files handling external services (Plaid, OpenAI, etc.)
- **Database**: Schema, models, and data access patterns
- **Authentication**: User management and security implementation
- **AI/ML features**: Behavioral analysis, categorization, predictions

### 4. Important Dependencies
- **Frontend libraries**: UI frameworks, state management, styling
- **Backend dependencies**: Server frameworks, databases, authentication
- **External APIs**: Plaid, OpenAI, financial data providers
- **Development tools**: Testing, linting, build tools
- **Security packages**: Encryption, validation, rate limiting

### 5. Configuration Files and Environment Setup
- **Environment variables**: Required API keys, database URLs, secrets
- **Build configuration**: Framework-specific config files
- **Database setup**: Connection strings, migration setup
- **Deployment config**: Hosting platform configurations
- **Development scripts**: Available npm/yarn scripts for development

### 6. Current Implementation Status
Based on the code analysis, determine:
- **Completed features**: What's fully implemented and working
- **In-progress features**: Partial implementations or placeholder code
- **Missing features**: Core functionality that still needs to be built
- **Code quality**: Organization, documentation, error handling
- **Security implementation**: How financial data and user auth are protected

### 7. Immediate Development Context
- **What can be run**: Current state of the application
- **Setup requirements**: What's needed to run the project locally
- **Next logical steps**: What should be implemented or fixed next
- **Potential issues**: Any obvious bugs, security concerns, or missing pieces

### 8. AI/ML and Financial Features Specific Analysis
If present, analyze:
- **Transaction processing**: How bank data is imported and categorized
- **AI implementations**: Pattern recognition, predictions, coaching features
- **Investment education**: Learning modules, risk assessment, recommendations
- **Data models**: How financial data, user behavior, and goals are structured
- **Security measures**: Encryption, data protection, compliance considerations

## Development Readiness Check

After the analysis, confirm:
- [ ] Can the project be run locally?
- [ ] Are all required environment variables documented?
- [ ] Is the database set up and accessible?
- [ ] Are external API integrations configured?
- [ ] Is there clear documentation for contributing?

## Questions to Address

Based on your analysis, ask any clarifying questions about:
- Unclear or missing configuration
- Incomplete features or TODO items
- Development environment setup issues
- Missing documentation or context
- Architectural decisions that need explanation

This analysis will provide the foundation for continuing development work on the AI personal finance platform efficiently and effectively.