import { useDrag } from 'react-dnd';

import {NodeType} from "../constants.ts";

type ActivityProps = {
    type: NodeType;
};

export const Activity = ({ type }: ActivityProps) => {
    const [,drag] = useDrag(
        () => ({
            type: 'NODE',
            item: { type },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [type],
    );

    return (
        <div
            ref={drag}
            style={{
                background: 'white',
                color: 'black',
                padding: '5px 10px',
                cursor: 'grab'
            }}
        >
            {type}
        </div>
    );
};


export const Sidebar = () => {
  return (
    <div className='sidebar'>
          <p style={{
              background: 'black',
              color: 'white',
              margin: 0,
              padding: '5px 10px'
          }}>
            Drag n drop
          </p>
        <Activity type='ChildNode' />
    </div>
  );
};
