import { mkdirSync, writeFileSync } from 'fs';
import * as core from '@actions/core';
import { generateAction } from './generate-action';

const main = () => {
    const actionType = core.getInput('actionType', { required: true });
    const action = generateAction();
    const actionPath = `.github/actions/${actionType}/action.yml`;
    mkdirSync(actionPath, { recursive: true });
    writeFileSync(actionPath, action);
};

main();
