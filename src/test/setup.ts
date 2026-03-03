import '@testing-library/jest-dom'

// Mock localStorage to avoid Node 22+ warning about --localstorage-file
const mockStorage = {
  store: new Map<string, string>(),
  getItem(key: string) {
    return this.store.get(key) || null;
  },
  setItem(key: string, value: string) {
    this.store.set(key, value.toString());
  },
  removeItem(key: string) {
    this.store.delete(key);
  },
  clear() {
    this.store.clear();
  },
  get length() {
    return this.store.size;
  },
  key(index: number) {
    return Array.from(this.store.keys())[index] || null;
  }
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  configurable: true,
  writable: true,
});

Object.defineProperty(globalThis, 'sessionStorage', {
  value: mockStorage,
  configurable: true,
  writable: true,
});
