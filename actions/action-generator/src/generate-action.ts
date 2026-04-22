import * as core from '@actions/core';
import { ActionTemplate } from './constants';
import { exit } from 'process';
import { parse, stringify } from 'yaml';
import { parseJson } from '@shared/utils';

export const generateAction = (): string => {
    const actionType = core.getInput('action-type', { required: true });
    const uses = core.getInput('uses', { required: true });
    const withInput = core.getInput('with');

    const template = ActionTemplate[actionType];

    if (!template) {
        console.error(`Unable to load template for actionType: ${actionType}`);
        exit(1);
    }

    const action = parse(template);
    const step = action.runs.steps[1];
    const inputJson = parseJson(withInput);

    if (!step) {
        console.error('Unable to find placeholder for step to call custom action');
        exit(1);
    }

    step.uses = uses;
    inputJson && Object.keys(inputJson).length > 0 ? (step.with = inputJson) : delete step.with;

    return stringify(action);
};
