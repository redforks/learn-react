# CLAUDE.md

## Project Overview

This is a React application built with modern tooling.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime and package manager
- **Build Tool**: [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Linting/Formatting**: [Biome](https://biomejs.dev/) - Fast formatter and linter

## Common Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run tests
bun test

# Run tests once
bun run test:run

# Format code with Biome
bunx biome format --write .

# Lint with Biome
bunx biome lint --write .

# Check with Biome (format + lint)
bunx biome check --write .
```

## Project Structure

```
src/
├── App.tsx        # Main application component
├── main.tsx       # Application entry point
└── test/
    └── setup.ts   # Test configuration
```

## Notes

- Use `bun` instead of `npm` for all package management
- Tailwind CSS v4 is used with the `@tailwindcss/postcss` plugin
- Vitest is configured with happy-dom for component testing
