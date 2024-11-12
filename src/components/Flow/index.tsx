import 'reactflow/dist/style.css';
import {useCallback, useState} from 'react';
import {
    Background,
    Controls,
    type NodeProps,
    type Node,
    type ReactFlowInstance,
    useNodesState,
    useEdgesState,
    ReactFlow,
    ConnectionLineType
} from 'reactflow';
import {nanoid} from "nanoid";

import {edgeTypes, SmartConnectionLineType} from './constants';
import {Node as AppNode} from './Node';
import {useNodeDrop} from './hooks/useNodeDrop';
import {useLayout} from './hooks/useLayout';
import {NodeTypes} from "../../constants.ts";

const initialFlow = {
    nodes: [
        {
            id: 'start',
            type: 'StartNode',
            position: {
                x: -1,
                y: -1,
            },
            data: {},
        },
        {
            id: 'parent',
            type: 'ParentNode',
            position: {
                x: -1,
                y: -1,
            },
            data: {},
        },
        {
            id: 'end',
            type: 'EndNode',
            position: {
                x: -1,
                y: -1,
            },
            data: {},
        }
    ],
    edges: [
        {
            id: nanoid(),
            source: 'start',
            target: 'parent',
            type: SmartConnectionLineType.Step,
        },
        {
            id: nanoid(),
            source: 'parent',
            target: 'end',
            type: SmartConnectionLineType.Step,
        }
    ],
};

const nodeTypes = NodeTypes.reduce(
    (acc, key) => ({
        ...acc,
        [key]: (
            node: NodeProps & {
                type: string;
            },
        ) => (
            <AppNode node={node}/>
        ),
    }),
    {},
);

export const Flow = () => {
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance>();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes);
    const [edges,, onEdgesChange] = useEdgesState(initialFlow.edges);

    const dropTargetRef = useNodeDrop(nodes, edges, reactFlowInstance);

    const handleNodesDelete = useCallback(
        (deletedNodes: Node[]) => {
            setNodes((currentNodes) =>
                currentNodes.filter(
                    (node) => !deletedNodes.find((deletedNode) => deletedNode.id === node.id),
                ),
            );
        },
        [setNodes],
    );

    useLayout(nodes, edges);

    return (
        <div className='react-flow-container'>
            <ReactFlow
                ref={dropTargetRef}
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineType={SmartConnectionLineType.Step as ConnectionLineType}
                panOnScroll
                onInit={setReactFlowInstance}
                onNodesChange={onNodesChange}
                onNodesDelete={handleNodesDelete}
                onEdgesChange={onEdgesChange}
                deleteKeyCode={['Backspace', 'Delete']}
                fitView
            >
                <Controls/>
                <Background/>
            </ReactFlow>
        </div>
    );
};
