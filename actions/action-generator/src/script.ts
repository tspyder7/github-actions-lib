import { mkdirSync, writeFileSync } from 'fs';
import * as core from '@actions/core';
import { generateAction } from './generate-action';
import { dirname } from 'path';

const main = () => {
    const actionType = core.getInput('action-type', { required: true });
    const action = generateAction();
    const actionPath = `.github/actions/${actionType}/action.yml`;
    mkdirSync(dirname(actionPath), { recursive: true });
    writeFileSync(actionPath, action);
};

main();
