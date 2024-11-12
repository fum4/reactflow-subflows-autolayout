import {useEffect, useRef} from 'react';
import {type Edge, type Node, Position, useNodesInitialized, useStore, useReactFlow} from 'reactflow';
import { type HierarchyPointNode, stratify, tree,} from 'd3-hierarchy';
import {NodeDimensions} from '../constants';

type Direction = 'TB' | 'LR' | 'RL' | 'BT';

type Options = {
    direction: Direction;
};

const positionMap: Record<string, Position> = {
    T: Position.Top,
    L: Position.Left,
    R: Position.Right,
    B: Position.Bottom,
};

const LayoutNodeSize = {
    WIDTH: NodeDimensions.WIDTH + 144,
    HEIGHT: NodeDimensions.HEIGHT * 3,
};

const getPosition = (x: number, y: number, direction: Direction) => {
    switch (direction) {
        case 'RL':
            return {x: -y, y: -x};
        case 'BT':
            return {x: -x, y: -y};
        case 'TB':
        case 'LR':
        default:
            return {x: x - 8, y};
    }
};

const createHierarchy = (nodes: Node[], edges: Edge[]) => {
    return stratify<Node>()
        .id((node) => node.id)
        .parentId(
            (node) => edges.find((e: Edge) => e.target === node.id)?.source,
        )(nodes);
};

const createLayout = tree<Node>()
    .nodeSize([LayoutNodeSize.WIDTH, LayoutNodeSize.HEIGHT])
    .separation(() => 1);

const adjustEndNodePosition = (nodes: HierarchyPointNode<Node>[]) => {
    const endNode = nodes.find(
        ({data: {type}}) => type === 'EndNode',
    );

    if (!endNode) {
        return;
    }

    const maxY = Math.max(...nodes.map(({y}) => y));
    const shouldIncreaseY = nodes.filter(
        ({y, data: {type}}) => type !== 'EndNode' && y === maxY,
    ).length;

    if (shouldIncreaseY) {
        endNode.y = maxY + LayoutNodeSize.HEIGHT;
    }

    endNode.x = 0;
};

export const useLayout = (
    nodes: Node[],
    edges: Edge[],
    {direction = 'TB'} = {} as Options,
) => {
    const nodesInitialized = useNodesInitialized();
    const nodesCount = useStore(({nodeInternals}) => nodeInternals.size);
    const {setNodes} = useReactFlow();
    const lastNodesCount = useRef(nodesCount);

    useEffect(() => {
        if (!nodesCount || !nodesInitialized) {
            return;
        }

        const layoutInitialized = !nodes.some(
            ({position: {x, y}}) => x === -1 && y === -1,
        );
        const nodesCountChanged = lastNodesCount.current !== nodesCount;

        if (!layoutInitialized || nodesCountChanged) {
            const hierarchy = createHierarchy(nodes, edges);
            const layout = createLayout(hierarchy);

            adjustEndNodePosition(layout.descendants());

            const updatedNodes = nodes.map((node) => {
                const {x, y} = layout.find(({id}) => id === node.id) || {
                    x: node.position.x,
                    y: node.position.y,
                };

                return {
                    ...node,
                    sourcePosition: positionMap[direction[1]],
                    targetPosition: positionMap[direction[0]],
                    position: getPosition(x, y, direction),
                };
            });

            setNodes(updatedNodes);
        }
    }, [
        nodes,
        edges,
        nodesCount,
        nodesInitialized,
        direction,
        setNodes,
        setNodes,
    ]);

    useEffect(() => {
        lastNodesCount.current = nodesCount;
    }, [nodesCount]);
};
