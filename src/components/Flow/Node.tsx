import {Handle, NodeProps as ReactFlowNodeProps, Position} from 'reactflow';

type NodeProps = {
    node: ReactFlowNodeProps;
};

export const Node = ({
     node: { type },
 }: NodeProps) => {
    return (
        <div className='custom-node'>
            <Handle type='target' position={Position.Top} />
            <Handle type='source' position={Position.Bottom} />
            <p style={{ margin: 0 }}>
                {type}
            </p>
        </div>
    );
};
