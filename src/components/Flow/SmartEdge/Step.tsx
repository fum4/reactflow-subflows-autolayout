import {type EdgeProps, type Node, StepEdge, useNodes} from 'reactflow';

import {pathfindingJumpPointNoDiagonal, svgDrawStraightLinePath,} from './utils';
import {SmartEdge, type SmartEdgeOptions} from '.';

const StepConfiguration: SmartEdgeOptions = {
    drawEdge: svgDrawStraightLinePath,
    generatePath: pathfindingJumpPointNoDiagonal,
    fallback: StepEdge,
};

export const SmartStepEdge = (props: EdgeProps) => {
    const nodes = useNodes() as Node[];

    return (
        <SmartEdge
            {...props}
            options={StepConfiguration}
            nodes={nodes}
        />
    );
};
