import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://regen.engineering',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
})
