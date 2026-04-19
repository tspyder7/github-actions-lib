import * as esbuild from 'esbuild';
import { resolve, join } from 'path';
import { readdirSync, existsSync } from 'fs';

const args = process.argv.slice(2);
const watch = args.includes('--watch');

const srcDir = resolve('src/actions');
const outDirBase = resolve('.github/actions');

const actionDirs = readdirSync(srcDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const builds = actionDirs
    .map((actionName) => {
        const entryPoint = join(srcDir, actionName, 'script.ts');
        const outputDir = join(outDirBase, actionName, 'dist');
        const outfile = join(outputDir, 'script.js');

        if (!existsSync(entryPoint)) {
            console.warn(`Skipping ${actionName}: no index.ts found`);
            return null;
        }

        return {
            entryPoints: [entryPoint],
            outfile,
            bundle: true,
            platform: 'node',
            target: 'node20',
            format: 'cjs',
            minify: false,
            external: ['fs', 'path', 'net', 'os', 'crypto', 'stream', 'util'],
            sourcemap: true,
            logLevel: 'info',
            metafile: true,
        };
    })
    .filter(Boolean);

if (!builds.length) {
    console.warn('No action scripts to build');
    process.exit(0);
}

if (watch) {
    await Promise.all(
        builds.map(async (build) => {
            const ctx = await esbuild.context(builds);
            await ctx.watch();
            console.info('Watching for changes...');
        }),
    );
} else {
    await Promise.all(
        builds.map(async (build) => {
            const result = await esbuild.build(build);

            if (result.metafile) {
                const outputs = Object.keys(result.metafile.outputs);
                outputs.forEach((output) => {
                    const size = result.metafile.outputs[output].bytes;
                    const sizeKB = (size / 1024).toFixed(2);
                    console.info(`${output}: ${sizeKB} KB`);
                });
            }
        }),
    );
}
