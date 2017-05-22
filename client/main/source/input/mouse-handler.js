/* Handler for mouse/pointer input. Uses the Pointer Lock API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
 */

import camera from '../render/camera'
import {canvas} from '../gl'
import $ from 'jquery'

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

function handleLockChange() {
    if (isPointerLocked()) {
        $(document).on('mousemove', handleMouseMovement);
    } else {
        // No need to check mouse movement when pointer lock is not active
        $(document).off('mousemove', handleMouseMovement);
    }
}

function handleMouseMovement(e) {
    camera.updateDirection(e.originalEvent.movementX, e.originalEvent.movementY);
}

/* Returns true if the pointer is currently locked. */
export function isPointerLocked() {
    return document.pointerLockElement === canvas || document.mozPointerLockElement === canvas;
}

/* Clicking the canvas will lock the pointer (press ESC to show the pointer again).
 * Listeners are applied to check when the pointer is locked/unlocked. */
export function init() {
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }
    $(document).on('pointerlockchange', handleLockChange);
    $(document).on('mozpointerlockchange', handleLockChange);
}

export default {isPointerLocked, init};
