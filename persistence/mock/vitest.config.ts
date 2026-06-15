import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    // Sin jsdom — MockStore detecta window===undefined y usa arrays en memoria
    environment: "node",
  },
});
