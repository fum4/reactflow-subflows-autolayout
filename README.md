**Target**:

- when dragging a node (Child Node) to the flow it should be displayed inside the already existing Parent Node
- subsequent nodes that will be added and linked to Child Node should also be displayed inside the Parent Node
- Parent Node should adapt its size to properly encapsulate all child nodes
- Parent Node should be linked to Start Node and End Node
- Child nodes should be linked together, but not with the outside nodes (Start Node & End Node)
- Auto layouting should work for both the main flow and the subflow, probably separately

**Extra info**:

- New nodes will be linked to the closest node to the drop zone
- The algorithm used for the layouting process might not be suitable for this specific case
- Nodes width and height are currently hardcoded, but they should be dynamic in order to adapt to the content

**Project structure**:

`src/components/Flow` -> react-flow related logic (flow map, custom node, drag and drop, auto layout)

`SmartEdge` -> custom edge component that is used in the flow map, **not relevant** to the main logic, don't bother looking into it
