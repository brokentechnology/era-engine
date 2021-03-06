import {SelectionState} from './selection-state';
import {SelectedState} from './selected-state';
import {findNearestBaseNodeForBoundingBoxNode} from './node-finder';
import {triggerNodeSelectedEvent} from '../../../common/index';

export class NoneSelectedState extends SelectionState {
    onEnter() {
        // Do nothing
    }
    handleDocumentClick() {
        return null;
    }
    handleCanvasMouseDown(mouseX, mouseY, renderNode) {
        const intersection = this._getNearestIntersection(mouseX, mouseY, renderNode);
        if (intersection.boundingBoxNode) {
            // Selected an object - given the bounding box, get the selected object base node
            const selectedObjectNode = findNearestBaseNodeForBoundingBoxNode(intersection.boundingBoxNode);
            triggerNodeSelectedEvent(selectedObjectNode);
            return new SelectedState(selectedObjectNode);
        }
        return null;
    }
    handleCanvasMouseUp() {
        return null;
    }
    handleCanvasMouseMove() {
        return null;
    }
    handleKeyDown() {
        return null;
    }
    handleKeyUp() {
        return null;
    }
    onExit() {
        // Do nothing
    }
    onNodeSelectedEvent(selectedObjectNode) {
        return new SelectedState(selectedObjectNode);
    }
}
