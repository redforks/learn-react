# Development server
dev:
    bun run vite

# Build for production
build:
    bun run vite build

# Preview production build
preview:
    bun run vite preview

# Run linter
lint:
    bun tsc --noEmit
    biome lint src/

# Run tests once
test:
    bun run vitest run

# Run tests in watch mode
test-watch:
    bun run vitest
