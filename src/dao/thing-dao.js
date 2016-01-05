/**
 * Defines the methods of a "thing"
 * @author Michael Chen
 * @type {*|exports|module.exports}
 * @class thing-dao
 *
 */
var Monk = require("monk");
var _ = require('lodash');
var conf = require('../conf/dbconf.js').testApi;
var database = Monk(conf.host + "/" + conf.database);
var jjv = require('jjv');
var schema = require('../lib/schema');
var validator = jjv();

validator.addSchema('thing', schema); //schema is in schema.js

/**
 * Gets the Object by it's id (not the native "_id")
 * @method getStuffById
 * @param id The string that represents the id attribute.
 * @param cb Callback that returns an error and result.
 */
exports.getThingById = function(id, cb) {
    var collection = database.get(conf.collections.things);
    collection.find({'id': id}, function (err, res) {
        if(err) {
            console.log(err);
            cb(err, null);
        } else {
            var obj = res[0];
            if(obj !== undefined) {
                var updated = _.omit(obj, "_id");
                cb(null, [updated]); //it's an array without the native "_id" property
            } else {
                cb({"404" : "Not found"}, res);
            }
        }
    });
};


/**
 * Inserts something into the database after validation
 * @method insertStuff
 * @param thing An object that is being inserted
 * @param cb Standard callback function (err,reply)
 */
exports.insertStuff = function(thing, cb) {
    var vld = validateStuff(thing);
    if(vld.valid) {
        var collection = database.get(conf.collections.things);
        collection.findOne({'id': thing.id}, function (err, res) {
            if (res !== null) {
                cb({"status": 409, "err": "Already in database"}, null);
            } else {
                collection.insert(thing, function (err, reply) {
                    if (err) {
                        cb({"Status": 409, "err": "Database Error"}, null);
                    } else {
                        reply = [_.omit(reply, '_id')];
                        cb(null, reply);
                    }
                });
            }
        });

    }
    else cb({'status': 400, "message" : "Not valid: Bad request"}, null);

};

/**
 * Updates an existing object, throws an error otherwise
 * @method updateStuff
 * @param thing The thing(object) that is getting updated
 * @param cb standard callback function (err, reply)
 */
exports.updateStuff = function(thing, cb) {
    var vald = validateStuff(thing, false);

    if(vald.valid) {
        var collection = database.get(conf.collections.things);
        collection.update({id: thing.id}, thing, function(err, reply) {
            if(err) {
                cb({409: "Database Error"}, null);
            }
            if(reply < 1) {
                cb({404: "Object does not exist"}, null);
            } else {
                cb(null, [{'updated': thing}]);
            }
        });
    } else {
        cb({'validation': {400: 'Bad request'}}, null);
    }
};


/**
 * Deletes a thing(Object) in the database
 * @method deleteStuff
 * @param id The id of the object that is getting deleted (not native _id)
 * @param cb Standard callback function (err, reply)
 */
exports.deleteStuff = function(id, cb) {
    var collection = database.get(conf.collections.things);
    collection.remove({'id': id}, function(err, reply) {
        if(err) {
            cb(err, null);
        }
        if(reply < 1) {
            cb({404: "Object not found"}, null);
        } else {
            cb(null, {"status" : 204, "message" : "Content deleted successfully"});
        }
    });
};


/**
 * Validates the object with the specified schema (schema.js)
 * @method validateStuff
 * @param thing The thing(Object) that is being validated
 * @returns {{valid: boolean}} If the object is valid or not
 */
var validateStuff = function (thing) {
    console.log("---" + thing);
    console.log("++ " + JSON.stringify(thing));
    var errors = validator.validate("thing", thing);
    console.log('errors ' + errors);
    console.log('string errors ' + JSON.stringify(errors));
    if (!errors) {
        return {'valid': true};
    } else {
        return {'valid': false};
    }
};




