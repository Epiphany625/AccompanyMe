import react from "@vitejs/plugin-react"
import fs from "node:fs" // for https certificate
import * as path from "node:path"
import { defineConfig } from "vitest/config"
import packageJson from "./package.json" with { type: "json" }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    open: true,
    https: {
      key: fs.readFileSync(path.join(import.meta.dirname, "certs", "localhost-key.pem")), // for https certificate
      cert: fs.readFileSync(path.join(import.meta.dirname, "certs", "localhost.pem")), // for https certificate
    },
    host: 'localhost',
    port: 5173
  },

  test: {
    root: import.meta.dirname,
    name: packageJson.name,
    environment: "jsdom",

    typecheck: {
      enabled: true,
      tsconfig: path.join(import.meta.dirname, "tsconfig.json"),
    },

    globals: true,
    watch: false,
    setupFiles: ["./src/setupTests.ts"],
  },
})
