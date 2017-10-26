import {TransformMesh, attachToBaseNode} from './transform'
import {redColor, greenColor, blueColor} from './color'
import {SceneNode} from '../../../node/index'
import {gl} from '../../../gl'
import {mat4, vec3} from 'gl-matrix'

class TranslateMesh extends TransformMesh {
    constructor(transform) {
        const shaftLength = 75.0;
        const shaftSize = 1.0;
        const pointerLength = 10.0;
        const pointerSize = 2.0;

        const positions = [
            // shaft
            0, shaftSize, 0,
            0, 0, shaftSize,
            0, -shaftSize, 0,
            0, 0, -shaftSize,
            shaftLength, shaftSize, 0,
            shaftLength, 0, shaftSize,
            shaftLength, -shaftSize, 0,
            shaftLength, 0, -shaftSize,
            // pointer
            shaftLength, 0, 0,
            shaftLength, pointerSize*1.5, 0,
            shaftLength, pointerSize, pointerSize,
            shaftLength, 0, pointerSize*1.5,
            shaftLength, -pointerSize, pointerSize,
            shaftLength, -pointerSize*1.5, 0,
            shaftLength, -pointerSize, -pointerSize,
            shaftLength, 0, -pointerSize*1.5,
            shaftLength, pointerSize, -pointerSize,
            shaftLength + pointerLength, 0, 0,
        ];
        for (let i = 0; i < positions.length; i+=3) {
            const transformed = vec3.transformMat4(vec3.create(),
                    vec3.fromValues(positions[i], positions[i+1], positions[i+2]), transform);
            positions[i] = transformed[0];
            positions[i+1] = transformed[1];
            positions[i+2] = transformed[2];
        }

        // Normals not needed
        const normals = new Array(positions.length).fill(0);
        // Texcoords not needed
        const texcoords = new Array(positions.length*2/3).fill(0);

        const indices = [
            // shaft
            4, 0, 5, 1, 6, 2, 7, 3, 4, 0,
            // pointer base
            0, 9, // degenerate
            9, 8, 10, 11,
            11, 11, // degenerate
            11, 8, 12, 13,
            13, 13, // degenerate
            13, 8, 14, 15,
            15, 15, // degenerate
            15, 8, 16, 9,
            // pointer
            9, 10, // degenerate
            10, 17, 9, 16,
            16, 16, // degenerate
            16, 17, 15, 14,
            14, 14, // degenerate
            14, 17, 13, 12,
            12, 12, // degenerate
            12, 17, 11, 10,
        ];

        super({
            drawMode: gl.TRIANGLE_STRIP,
            positions,
            normals,
            texcoords,
            indices,
            numVertices: positions.length
        });
    }
}
class TranslateXMesh extends TranslateMesh {
    constructor() {
        super(mat4.create());
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, 0, this._min, this._max, 0, this._max]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([this._min, 0, 0, this._max, 0, 0], redColor);
    }
    handleTransform({baseSceneNode, intersectionDelta}) {
        super.handleTransform({baseSceneNode, intersectionDelta});
        const translation = mat4.fromTranslation(mat4.create(), vec3.fromValues(intersectionDelta[0], 0, 0));
        baseSceneNode.applyTranslation(translation);
    }
}
class TranslateYMesh extends TranslateMesh {
    constructor() {
        super(mat4.fromRotation(mat4.create(), 3.14/2, vec3.fromValues(0, 0, 1)));
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, this._min, 0, this._max, this._max, 0]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([0, this._min, 0, 0, this._max, 0], greenColor);
    }
    handleTransform({baseSceneNode, intersectionDelta}) {
        super.handleTransform({baseSceneNode, intersectionDelta});
        const translation = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, intersectionDelta[1], 0));
        baseSceneNode.applyTranslation(translation);
    }
}
class TranslateZMesh extends TranslateMesh {
    constructor() {
        super(mat4.fromRotation(mat4.create(), -3.14/2, vec3.fromValues(0, 1, 0)));
    }
    generateBoundingPlaneNode() {
        return this._generateBoundingBoxNode([this._min, 0, this._min, this._max, 0, this._max]);
    }
    generateAxisLineGeometryNode() {
        return this._generateAxisLineGeometryNode([0, 0, this._min, 0, 0, this._max], blueColor);
    }
    handleTransform({baseSceneNode, intersectionDelta}) {
        super.handleTransform({baseSceneNode, intersectionDelta});
        const translation = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, intersectionDelta[2]));
        baseSceneNode.applyTranslation(translation);
    }
}

export const createTranslateNode = () => {
    const localMatrix = mat4.create();
    const base = new SceneNode(localMatrix);
    attachToBaseNode({base, mesh: new TranslateXMesh(), color: redColor});
    attachToBaseNode({base, mesh: new TranslateYMesh(), color: greenColor});
    attachToBaseNode({base, mesh: new TranslateZMesh(), color: blueColor});
    return base;
}
