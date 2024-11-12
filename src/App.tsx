import { ReactFlowProvider } from 'reactflow';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {Flow} from './components/Flow';
import {Sidebar} from './components/Sidebar';

function App() {
    return (
        <ReactFlowProvider>
            <DndProvider backend={HTML5Backend}>
                <div>
                    <Sidebar />
                    <Flow />
                </div>
            </DndProvider>
        </ReactFlowProvider>
    )
}

export default App
