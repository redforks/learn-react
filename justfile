# Development server
dev:
    pnpm exec vite

# Build for production
build:
    pnpm exec vite build

# Preview production build
preview:
    pnpm exec vite preview

# Run linter
lint:
    pnpm exec tsc --noEmit
    biome lint src/

# Run tests once
test:
    pnpm exec vitest run

# Run tests in watch mode
test-watch:
    pnpm exec vitest

outdated:
    pnpm outdated
