// frontend/global.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      selectFolder: () => Promise<string | null>;
    };
  }
}
