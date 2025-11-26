import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    clean: true,
    minify: true,
    // Don't bundle OpenTUI - it requires Bun runtime
    external: [
        "@opentui/core",
        "@opentui/react",
    ],
    banner: {
        js: "#!/usr/bin/env bun",
    },
})
