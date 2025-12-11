import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'site.webmanifest',
      ],
      manifest: {
        name: 'Iuran Krama Desa Adat Sangket',
        short_name: 'Iuran Sangket',
        description: 'Sistem Informasi Manajemen Iuran & Peturunan Krama Desa Adat Sangket.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false, // Security: Disable source maps in production
    chunkSizeWarningLimit: 1000, // Adjust warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            'lucide-react',
            'sonner',
            'cmdk',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
          ],
          'map-vendor': ['leaflet', 'react-leaflet'],
          'utils-vendor': ['axios', 'zustand', 'date-fns', 'crypto-js'],
        },
      },
    },
  },
  esbuild: {
    // Security: Remove console logs and debugger ONLY in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
