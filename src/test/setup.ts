import '@testing-library/jest-dom'
import { Window } from 'happy-dom'

const window = new Window()

// Bun's native localStorage is often read-only or persistent.
// We override it with Happy DOM's in-memory version for clean tests.
Object.defineProperty(globalThis, 'localStorage', {
  value: window.localStorage,
  writable: true,
  configurable: true,
})
