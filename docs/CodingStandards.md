# Coding Standards & Best Practices - Geek Hell

## Strict Rules
1. **TypeScript**: `strict: true` mode enabled. Avoid `any` types; define explicit interfaces in `types/`.
2. **Formatting**: Automatic formatting on save via Prettier (2 space indentation, double quotes for strings, semicolons).
3. **Import Ordering**:
   - 1. Core React & External Libraries (`react`, `react-router`, `zustand`, `gsap`)
   - 2. Internal Components & Hooks (`@/components`, `@/hooks`)
   - 3. Types, Utilities & Styles (`@/types`, `@/utils`, `@/styles`)
4. **Component Architecture**: Atomic functional components with explicit React TypeScript typing.
