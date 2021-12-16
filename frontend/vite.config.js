import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({command, mode}) => {
    if (mode === 'production') {
        return defineConfig({
            plugins: [vue()],
            build: {
                manifest: true,
            },
            base: "/static/",
            server: {
                port: 8001
            }
        })
    } else {
        return defineConfig({
            plugins: [vue()],
            build: {
                manifest: true,
            },
            base: "/",
            server: {
                port: 8001
            }
        })
    }
}
