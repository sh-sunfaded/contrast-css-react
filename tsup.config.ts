import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "lib/ct.tsx" },
  format: ["esm"],
  dts: true,
  external: ["react"],
  clean: true,
});
