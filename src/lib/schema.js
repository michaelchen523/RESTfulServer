/**
 * Defines the schema that is considered valid
 * @author Michael Chen
 * @class schema
 */

module.exports = {
    "properties": {
        "id": {
            type: 'string'
        },
        'name': {
            type: 'string'
        }
    },
    required : ['id','name']
};
