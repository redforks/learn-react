# CLAUDE.md

## Project Overview

This is a React application built with modern tooling.

## Tech Stack

- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- **Build Tool**: [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Common Commands

**IMPORTANT: Use `just` commands instead of `pnpm run`.**

```bash
# Start development server
just dev

# Build for production
just build

# Preview production build
just preview

# Run tests once
just test

# Run linter
just lint
```

## Project Structure

```
src/
├── App.tsx        # Main application component
├── main.tsx       # Application entry point
└── test/
    └── setup.ts   # Test configuration
justfile           # Task runner commands
```

## Notes

- Use pnpm
- Tailwind CSS v4 is used with the `@tailwindcss/postcss` plugin
- Vitest is configured with happy-dom for component testing
