import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "**/*.ts", "**/*.tsx"],
  },
]);

export default eslintConfig;
