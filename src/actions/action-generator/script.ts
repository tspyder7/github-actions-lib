import { writeFileSync } from 'fs';
import { generateAction } from './generate-action';
import * as core from '@actions/core';

const main = () => {
    const actionType = core.getInput('actionType', { required: true });
    const action = generateAction();

    writeFileSync(`.github/actions/${actionType}/action.yml`, action);
};

main();
