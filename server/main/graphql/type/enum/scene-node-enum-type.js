import {GraphQLEnumType} from 'graphql'

export default new GraphQLEnumType({
    name: 'SceneNodeEnum',
    values: {
        DEFAULT: {},
        LIGHT: {},
        OBJECT: {},
        OBJECT_REF: {}
    }
});
