import { defineConfig } from 'vitest/config'

// The Worker code uses only web-standard APIs (fetch, Request, Response),
// so its tests run in plain Node without the Workers runtime.
export default defineConfig({
  test: {
    environment: 'node',
  },
})
