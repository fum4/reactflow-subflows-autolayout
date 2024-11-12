export const NodeTypes = [
    'StartNode', 'EndNode', 'ParentNode', 'ChildNode'
] as const;

export type NodeType = typeof NodeTypes[number];
