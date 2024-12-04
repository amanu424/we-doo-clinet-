import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from 'vite-plugin-web-extension';
import path from 'path';
import process from 'process';

// Log the manifest path to make sure it resolves correctly
console.log('Manifest Path:', path.resolve(__dirname, 'manifest.json'));

// Define the manifest object for the Firefox extension
const manifest = path.resolve(__dirname, 'manifest.json');  // This should point to the root manifest.json

export default defineConfig({
  plugins: [react(), webExtension({ manifest })],
  build: {
    outDir: 'dist',  // Output directory for the build files
    rollupOptions: {
      input: 'index.html',  // Entry point for the build
    }
  },
  server: {
    port: 3003,
    open: false
  },
  define: {
    'process.env': process.env,  // Polyfill process
  }
});
