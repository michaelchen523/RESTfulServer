/**
 * Describes the functionality of a basic server
 * @class server
 * @author Michael Chen
 */

var Hapi = require('hapi');
var hapiConfig = require('./conf/hapi-conf');
var _ = require('lodash');
var things = require('./dao/thing-dao');
var server = new Hapi.Server();
server.connection({port:hapiConfig.port});

/**
 * Starts the server using the name and port from the hapi-config file(conf)
 * @method start
 *
 */
server.start(function () {
    console.log(hapiConfig.name + ' running on port ' + hapiConfig.port);
});

/**
 * Tells the server to get a thing from the database.
 * All validation and error handling occurs in DAO
 * @method GET
 *
 */
server.route({
    method: 'GET',
    path: '/thing/{id?}',
    handler: function(req, reply) {

        var id = req.params.id; //not _id
        console.log(id);
        if(_.isString(id)) {
            things.getThingById(id, function(err, dbReply) {
                if(err) {
                    reply(err);
                } else {
                    reply(dbReply);
                }
            });
        }
        else {
            dbReply("no ID provided");
        }
    }
});


/**
 * Tells the server to post a thing into the database.
 * All validation and error handling occurs in the DAO
 * @method POST
 */
server.route({
    method: 'POST',
    path: '/thing',
    config: {
        handler: function (req, dbReply) {
            var data = JSON.parse(req.payload);
            var id = data.id;
            if (_.isString(id)) {
                things.insertStuff(data, function (err, res) {
                    if(err) {
                        dbReply(err);
                    } else {
                        dbReply(res);
                    }
                });
            } else {
                dbReply('no valid ID provided');
            }
        },
        payload:{parse: false}
    }
});


/**
 * Updates something that is already in the database.
 * All error handling and validation handled by the DAO
 * @method PUT
 */
server.route({
    method: 'PUT',
    path: '/thing',
    config: {
        handler: function(req, dbReply) {
            var data = JSON.parse(req.payload);
            var id = data.id;
            if(_.isString(id)) {
                things.updateStuff(data, function(err, reply) {
                    if(err) {
                        dbReply(err);
                    } else {
                        dbReply(reply);
                    }
                });
            } else {
                dbReply("Not updated properly");
            }
        },
        payload: {parse: false}
    }
});


/**
 * Removes something from the database.
 * All error handling and validation handled in DAO
 * @method DELETE
 */
server.route({
    method: 'DELETE',
    path:'/thing/{id?}',
    handler: function(req, dbReply) {

        var id = req.params.id; //not _id
        if(_.isString(id)) {
            things.deleteStuff(id, function(err, reply) {
                if(err) {
                    dbReply(err);
                } else {
                    dbReply(reply);
                }
            });
        }
        else {
            dbReply("no ID provided");
        }
    }
});
