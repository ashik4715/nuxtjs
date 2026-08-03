import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default createConfigForNuxt({
  features: {
    tooling: true,
  },
}).append(eslintPluginPrettier);
