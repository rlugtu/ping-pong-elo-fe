import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Ping Pong',
                short_name: 'PingPong',
                description: 'Ping Pong Elo System',
                theme_color: '#FFFFFF',
                icons: [
                    {
                        src: '/img/icons/192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/img/icons/512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/img/icons/512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/img/icons/512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
