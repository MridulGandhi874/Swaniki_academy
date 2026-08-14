import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // The standard "fetch on mount / on dependency change, track loading
      // state locally" pattern (no data-fetching library in this project)
      // synchronously sets loading=true before the first await, which this
      // React Compiler-era rule flags. It's a real, common, safe pattern
      // here — downgrade to a warning rather than rewrite every data
      // fetch to dodge it.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
