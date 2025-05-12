# Cursor AI Pair Programming Rules

**NOTE:** All development and installation must use **pnpm** as the package manager. Do not use npm, yarn, or bun.

**ALWAYS FOLLOW:** All development, code changes, and implementation decisions MUST strictly adhere to the step-by-step requirements and structure outlined in `IMPLEMENTATION_PLAN.md` unless an explicit, documented exception is made.

This document outlines the rules and best practices for our pair programming sessions to build the Customizable Multi-Client Chat Widget Platform, ensuring we adhere to the detailed planning and documentation.

---

## 1. Adherence to Documentation
- **Rule 1.1:** All implementation steps MUST align with the specifications detailed in:
    - `IMPLEMENTATION_PLAN.md` (this is the primary source of truth for all implementation steps; always follow it unless an explicit exception is documented)
    - `API_DESIGN.md`
    - `ARCHITECTURE.MD`
    - `DATABASE_SCHEMA.MD`
    - `DEPLOYMENT.MD`
    - `TECH_STACK.MD`
    - `WIREFRAMES.MD`
- **Rule 1.2:** Before implementing any feature or component, explicitly reference the relevant section(s) in these documents.
- **Rule 1.3:** If a deviation from the documentation is necessary, it must be discussed, agreed upon, and the relevant documentation MUST be updated first before proceeding with the code change.

## 2. Code Changes and Tool Usage
- **Rule 2.1:** All code changes, file creations, or modifications MUST be performed using the `edit_file` tool or other appropriate tools. Do not output code directly in messages unless it is for illustrative snippets or if the tool fails and manual intervention is requested.
- **Rule 2.2:** Always explain the purpose and scope of a code change *before* calling the tool.
- **Rule 2.3:** Ensure generated code is self-contained, includes necessary imports (if applicable for the tool's context), and is as close to production-ready as possible based on the current implementation stage.

## 3. Task Management & Step-by-Step Execution
- **Rule 3.1:** We will follow the `IMPLEMENTATION_PLAN.md` step-by-step.
- **Rule 3.2:** Each task from the `IMPLEMENTATION_PLAN.md` should be broken down into the smallest manageable sub-tasks.
- **Rule 3.3:** Confirm completion and correctness of each sub-task before moving to the next.

## 4. Communication and Clarification
- **Rule 4.1:** If any requirement or implementation detail is unclear, ask for clarification *before* writing code.
- **Rule 4.2:** Summarize complex implementations or decisions to ensure mutual understanding.

## 5. Testing and Quality (as applicable)
- **Rule 5.1:** While extensive E2E testing is out of scope per user request, consider unit tests for critical backend logic (e.g., authentication, data validation) where appropriate and if feasible within the AI's capabilities.
- **Rule 5.2:** Manually verify functionality against wireframes and API design after implementing UI components or API endpoints.

## 6. Focus on MVP and Iteration
- **Rule 6.1:** Prioritize features essential for the core functionality as outlined in the MVP stages of the `IMPLEMENTATION_PLAN.md`.
- **Rule 6.2:** Advanced features or optimizations not critical for the initial launch can be noted for future iterations.

## 7. File Management
- **Rule 7.1:** All new files created should adhere to the project structure outlined in `DEPLOYMENT.MD` and `IMPLEMENTATION_PLAN.MD`.
- **Rule 7.2:** Maintain clean and organized code with appropriate comments for non-trivial logic, aligning with the `TECH_STACK.MD` best practices. 