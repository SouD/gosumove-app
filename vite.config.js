import { sveltekit } from '@sveltejs/kit/vite';
import { optimizeImports } from 'carbon-preprocess-svelte'
import mkcert from'vite-plugin-mkcert'

/** @type {import('vite').UserConfig} */
const config = {
	server: {
		https: true
	},
	plugins: [
		mkcert(),
		sveltekit({
			preprocess: [optimizeImports()],
		})
	]
};

export default config;
