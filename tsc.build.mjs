import { resolve, join } from 'path';
import { readdirSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';

const srcDir = resolve('src/actions');
const outDirBase = resolve('.github/actions');

const actionDirs = readdirSync(srcDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

if (!actionDirs.length) {
    console.warn('No action scripts to build');
    process.exit(0);
}

console.log(actionDirs);

for (const actionName of actionDirs) {
    const entryPoint = join(srcDir, actionName, 'script.ts');

    if (!existsSync(entryPoint)) {
        console.warn(`Skipping ${actionName}: no script.ts found`);
        continue;
    }

    const outDir = join(outDirBase, actionName, 'dist');
    const tempTsConfig = join(srcDir, actionName, 'tsconfig.build.json');

    // 🔧 Create per-action tsconfig extending base config
    const config = {
        extends: resolve('tsconfig.json'),
        compilerOptions: {
            outDir,
            rootDir: join(srcDir, actionName),
            sourceMap: false,
        },
        include: [entryPoint],
    };

    console.info(entryPoint, outDir);

    writeFileSync(tempTsConfig, JSON.stringify(config, null, 2));

    console.info(`Building ${actionName}...`);

    try {
        execSync(`npx tsc --project ${tempTsConfig}`, { stdio: 'inherit' });
    } finally {
        // 🧹 cleanup temp config
        unlinkSync(tempTsConfig);
    }
}
