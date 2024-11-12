import {useCallback, useEffect, useRef} from 'react';
import {type DropTargetMonitor, useDrop} from 'react-dnd';
import {type Edge, type Node, type ReactFlowInstance, useReactFlow,} from 'reactflow';
import {nanoid} from 'nanoid';

import {findClosestInputNode,} from '../utils';
import {SmartConnectionLineType} from "../constants.ts";
import {NodeType} from "../../../constants";

export const useNodeDrop = (
    nodes: Node[],
    edges: Edge[],
    reactFlowInstance?: ReactFlowInstance,
) => {
    const tempNodesRef = useRef(nodes);
    const tempEdgesRef = useRef(edges);

    const {setNodes, setEdges} = useReactFlow();

    const getMousePosition = useCallback(
        (monitor: DropTargetMonitor<NodeType>) => {
            if (!reactFlowInstance) {
                return null;
            }

            const clientOffset = monitor.getClientOffset();

            if (!clientOffset) {
                return null;
            }

            return reactFlowInstance.screenToFlowPosition({
                x: clientOffset.x,
                y: clientOffset.y,
            });
        },
        [reactFlowInstance],
    );

    const [{isOver}, dropTargetRef] = useDrop(
        () => ({
            accept: 'NODE',
            drop: () => {
                setNodes(tempNodesRef.current)
                setEdges(tempEdgesRef.current)
            },
            hover: (
                item: { type: NodeType },
                monitor,
            ) => {
                const mousePosition = getMousePosition(monitor);

                if (!mousePosition) {
                    return;
                }

                const newNode = {
                    id: nanoid(),
                    type: item.type,
                    position: {x: -1, y: -1}, // overwritten by auto layout
                    data: {},
                    parentNode: 'parent',
                    extent: 'parent'
                } as const;

                const newEdges: Edge[] = [];
                const edgesToRemove: Edge[] = [];

                // handle input node / edge
                const inputNode = findClosestInputNode(mousePosition, nodes);

                if (!inputNode) {
                    return;
                }

                const inputEdge: Edge = {
                    id: nanoid(),
                    type: SmartConnectionLineType.Step,
                    sourceHandle: 'source',
                    targetHandle: 'input',
                    source: inputNode.id,
                    target: newNode.id,
                }

                newEdges.push(inputEdge);

                // handle output node(s) / edge(s)
                const edgeToReplace = edges.find(
                    ({source}) => source === inputNode.id
                );

                if (!edgeToReplace) {
                    return;
                }

                const outputEdge: Edge = {
                    id: nanoid(),
                    type: SmartConnectionLineType.Step,
                    sourceHandle: 'output',
                    targetHandle: 'input',
                    target: edgeToReplace?.target,
                    source: newNode.id,
                };

                newEdges.push(outputEdge);
                edgesToRemove.push(edgeToReplace);

                // commit changes
                tempNodesRef.current = [...nodes, newNode];
                tempEdgesRef.current = [
                    ...edges.filter((edge) => !edgesToRemove.includes(edge)),
                    ...newEdges,
                ];
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
            }),
        }),
        [
            getMousePosition,
            nodes,
            edges,
            setNodes,
            setEdges,
        ],
    );

    useEffect(() => {
        if (!isOver) {
            tempNodesRef.current = nodes;
            tempEdgesRef.current = edges;
        }
    }, [isOver, nodes, edges, setNodes, setEdges]);

    return dropTargetRef;
};
