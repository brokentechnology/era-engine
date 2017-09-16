/* Handler for mouse/pointer input. Uses the Pointer Lock API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
 */

import {NoneSelectedState} from './selection/index'
import {Camera} from '../camera/index'
import {gl} from '../gl'
import {RootSceneNode} from '../index'
import $ from 'jquery'

gl.canvas.requestPointerLock = gl.canvas.requestPointerLock || gl.canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

let currSelectionState = new NoneSelectedState();

function handleLockChange() {
    if (isPointerLocked()) {
        $(document).on('mousemove', handleMouseMovement);
    } else {
        // No need to check mouse movement when pointer lock is not active
        $(document).off('mousemove', handleMouseMovement);
    }
}

function handleMouseMovement(e) {
    Camera.updateDirection(e.originalEvent.movementX, e.originalEvent.movementY);
}

function isPointerLocked() {
    return document.pointerLockElement === gl.canvas || document.mozPointerLockElement === gl.canvas;
}

function handleSelectionState(nextState) {
    if (nextState !== null) {
        currSelectionState.onExit(RootSceneNode);
        currSelectionState = nextState;
        currSelectionState.onEnter(RootSceneNode);
    }
}

export default {
    init() {
        gl.canvas.addEventListener('mousedown', (e) => {
            const nextState = currSelectionState.handleMouseDown(e.clientX, e.clientY, RootSceneNode);
            handleSelectionState(nextState);
        });
        gl.canvas.addEventListener('mouseup', (e) => {
            const nextState = currSelectionState.handleMouseUp(e.clientX, e.clientY, RootSceneNode);
            handleSelectionState(nextState);
        });
        gl.canvas.addEventListener('mousemove', (e) => {
            const nextState = currSelectionState.handleMouseMove(e.clientX, e.clientY, RootSceneNode);
            handleSelectionState(nextState);
        });
        $(document).on('pointerlockchange', handleLockChange);
        $(document).on('mozpointerlockchange', handleLockChange);
    },

    /* Returns true if the pointer is currently locked. */
    isPointerLocked() {
        return isPointerLocked();
    }
}
