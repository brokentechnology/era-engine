import {
    GraphQLNonNull,
    GraphQLList,
    GraphQLString
} from 'graphql'

import {InputSceneNodeType, OutputSceneNodeType} from '../type/scene-node-type'
import {InputLightType} from '../type/light-type'
import {InputObjectRefType} from '../type/object-ref-type'
import * as SceneNodeService from '../../service/scene-node-service'
import {ObjectSceneNodePrefix} from '../../service/object-service'

export const saveSceneNode = {
    type: OutputSceneNodeType,
    args: {
        sceneNode: {
            type: new GraphQLNonNull(InputSceneNodeType)
        }
    },
    resolve: (root, args) => {
        return save(args.sceneNode, null);
    }
}

export const saveLightSceneNode = {
    type: OutputSceneNodeType,
    args: {
        sceneNode: {
            type: new GraphQLNonNull(InputSceneNodeType)
        },
        content: {
            type: new GraphQLNonNull(InputLightType)
        }
    },
    resolve: (root, args) => {
        return save(args.sceneNode, args.content);
    }
}

export const saveObjectRefSceneNode = {
    type: OutputSceneNodeType,
    args: {
        sceneNode: {
            type: new GraphQLNonNull(InputSceneNodeType)
        },
        content: {
            type: new GraphQLNonNull(InputObjectRefType)
        }
    },
    resolve: async (root, args) => {
        const doc = await SceneNodeService.getSceneNode(args.content.objectSceneNodeId);
        if (doc === null) {
            throw new Error("No scene node with id " + args.content.objectSceneNodeId);
        }
        if (!doc.path.startsWith(ObjectSceneNodePrefix)) {
            throw new Error("Scene node detected, but is not an object scene node");
        }
        return save(args.sceneNode, args.content);
    }
}

export const deleteSceneNodes = {
    type: new GraphQLList(OutputSceneNodeType), // The deleted nodes
    args: {
        pathRegex: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (root, args) => {
        return SceneNodeService.deleteSceneNodes(args.pathRegex);
    }
}

function save(sceneNode, content) {
    if (sceneNode.localMatrix.length !== 16) {
        throw new Error('Local matrix must be a list of exactly 16 elements')
    }
    sceneNode.content = content;
    return SceneNodeService.saveSceneNode(sceneNode);
}
