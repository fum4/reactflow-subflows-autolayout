import type {Node, XYPosition} from 'reactflow';

const distance = (
    position1: XYPosition | null,
    position2: XYPosition | null,
) => {
    if (!position1 || !position2) {
        return Infinity;
    }

    return Math.sqrt(
        (position2.x - position1.x) ** 2 + (position2.y - position1.y) ** 2,
    );
};

export const findClosest = <
    T extends {
        position: XYPosition | null;
    },
>(
    position: XYPosition,
    list: T[],
) => {
    if (!list.length) {
        return null;
    }

    let [closestElement] = list;
    let closestDistance = distance(position, closestElement.position);

    list.forEach((element) => {
        const currentDistance = distance(position, element.position);

        if (currentDistance < closestDistance) {
            closestDistance = currentDistance;
            closestElement = element;
        }
    });

    return closestElement;
};

export const findClosestInputNode = (position: XYPosition, nodes: Node[]) =>
    findClosest(
        position,
        nodes.filter(
            (node) =>
                node.type !== 'EndNode' &&
                (node.position.y <= position.y || node.type === 'StartNode'),
        ),
    );
