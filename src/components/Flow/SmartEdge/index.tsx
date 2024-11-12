import {BaseEdge, BezierEdge, type EdgeProps, type Node} from 'reactflow';

import {getSmartEdge, type GetSmartEdgeOptions} from './utils';

export type SmartEdgeOptions = GetSmartEdgeOptions & {
    fallback?: typeof BezierEdge;
};

export interface SmartEdgeProps extends EdgeProps {
    nodes: Node[];
    options: SmartEdgeOptions;
}

export const SmartEdge = ({nodes, options, ...edgeProps}: SmartEdgeProps) => {
    const {
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        style,
        label,
        labelStyle,
        labelShowBg,
        labelBgStyle,
        labelBgPadding,
        labelBgBorderRadius,
        markerEnd,
        markerStart,
        interactionWidth,
    } = edgeProps;

    const smartResponse = getSmartEdge({
        sourcePosition,
        targetPosition,
        sourceX,
        sourceY,
        targetX,
        targetY,
        options,
        nodes,
    });

    const FallbackEdge = options.fallback || BezierEdge;

    if (smartResponse === null) {
        return <FallbackEdge {...edgeProps} />;
    }

    const {edgeCenterX, edgeCenterY, svgPathString} = smartResponse;

    return (
        <BaseEdge
            path={svgPathString}
            labelX={edgeCenterX}
            labelY={edgeCenterY}
            label={label}
            labelStyle={labelStyle}
            labelShowBg={labelShowBg}
            labelBgStyle={labelBgStyle}
            labelBgPadding={labelBgPadding}
            labelBgBorderRadius={labelBgBorderRadius}
            style={style}
            markerStart={markerStart}
            markerEnd={markerEnd}
            interactionWidth={interactionWidth}
        />
    );
};
