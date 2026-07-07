import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function versionedImportResolver() {
  return {
    name: 'versioned-import-resolver',
    async resolveId(id: string, importer: string | undefined) {
      if (
        id.startsWith('.') ||
        id.startsWith('/') ||
        id.startsWith('figma:asset/') ||
        /^[a-z]+:/i.test(id)
      ) {
        return null
      }

      const normalized = id.replace(/@(?=\d)[^/]+$/, '')
      if (normalized === id) {
        return null
      }

      return this.resolve(normalized, importer, { skipSelf: true })
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    versionedImportResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
