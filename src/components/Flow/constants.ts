import {SmartStepEdge} from './SmartEdge/Step';

export const SmartConnectionLineType = {
    Step: 'smartstep',
} as const;

export const edgeTypes = {
    [SmartConnectionLineType.Step]: SmartStepEdge,
} as const;

export const NodeDimensions = {
    WIDTH: 176,
    HEIGHT: 40,
} as const;

