// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		proxy: {
			'/met-images': {
				target: 'https://images.metmuseum.org',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/met-images/, ''),
				secure: true,
			},
		},
	},
});
