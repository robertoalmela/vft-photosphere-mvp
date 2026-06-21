import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = '/vft-photosphere-mvp/';

export default defineConfig({
  base,
  plugins: [
    VitePWA({
      base,
      registerType: 'autoUpdate',
      includeAssets: ['**/*'],
      manifest: {
        name: 'VFT Photosphere',
        short_name: 'VFT Photo',
        description: 'Capture 360 photos with your phone',
        theme_color: '#121212',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
});
