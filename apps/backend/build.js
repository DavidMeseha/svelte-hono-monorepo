import { build } from 'bun';

await build({
	entrypoints: ['./src/index.ts'],
	outdir: './dist',
	target: 'bun',
	external: ['@prisma/client', '.prisma/client']
});
