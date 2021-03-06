'use strict';
require('../../init');
let Client = require('../../../lib/client');
const async = require('async');
let _ = require('lodash');

describe('Stream throttle - callbacks', function() {
    it('Should work', function(done) {
        this.timeout(10000);
        Client(null, clientCreated);

        function clientCreated(err, client) {
            if (err) {
                return client.close(() => done(err));
            }
            let data = {
                client
            };
            async.waterfall(
                [
                    async.apply(getClientIdAndActiveVessel, data),
                    connectToStreamServer,
                    getVesselControl,
                    getVesselGetOrbitalReferenceFrame,
                    getVesselFlight,
                    addThrottleToStream,
                    addHeadingToStream
                ],
                function(waterfallErr) {
                    if (waterfallErr) {
                        return client.close(() => done(waterfallErr));
                    }
                    return client.close(() => done());
                }
            );
        }
    });
});

function getFirstResult(response) {
    return getResultN(response, 0);
}

function getResultN(response, n) {
    expect(response.error).to.not.be.ok();
    let result = response.results[n];
    expect(result.error).to.not.be.ok();
    return result.value;
}

function getClientIdAndActiveVessel(data, callback) {
    let calls = [
        data.client.services.krpc.getClientId(),
        data.client.services.spaceCenter.getActiveVessel()
    ];
    data.client.send(calls, function(err, response) {
        if (err) {
            return callback(err);
        }
        data.clientId = getResultN(response, 0).toString('base64');
        data.vessel = {
            id: getResultN(response, 1)
        };
        return callback(null, data);
    });
}

function connectToStreamServer(data, callback) {
    data.client.connectToStreamServer(data.clientId, function(err) {
        return callback(err, data);
    });
}

function getVesselControl(data, callback) {
    data.client.send(data.client.services.spaceCenter.vesselGetControl(data.vessel.id), function(
        err,
        response
    ) {
        if (err) {
            return callback(err);
        }
        data.vessel.controlId = getFirstResult(response);
        return callback(null, data);
    });
}

function getVesselGetOrbitalReferenceFrame(data, callback) {
    data.client.send(
        data.client.services.spaceCenter.vesselGetOrbitalReferenceFrame(data.vessel.id),
        function(err, response) {
            if (err) {
                return callback(err);
            }
            data.vessel.orbitalReference = getFirstResult(response);
            return callback(null, data);
        }
    );
}

function getVesselFlight(data, callback) {
    data.client.send(
        data.client.services.spaceCenter.vesselFlight(data.vessel.id, data.vessel.orbitalReference),
        function(err, response) {
            if (err) {
                return callback(err);
            }
            data.vessel.flightId = getFirstResult(response);
            return callback(null, data);
        }
    );
}

function addThrottleToStream(data, callback) {
    let getThrottle = data.client.services.spaceCenter.controlGetThrottle(data.vessel.controlId);
    data.client.addStream(getThrottle, 'Throttle', throttleStreamAdded);
    function throttleStreamAdded(err) {
        return callback(err, data);
    }
}

function addHeadingToStream(data, callback) {
    let getHeading = data.client.services.spaceCenter.flightGetHeading(data.vessel.flightId);
    data.client.addStream(getHeading, 'Heading', headingStreamAdded);
    function headingStreamAdded(err) {
        if (err) {
            return callback(err);
        }
        data.client.stream.on('message', streamUpdate(callback));
    }
}

function streamUpdate(callback) {
    let counter = 0;
    return function _streamUpdate(streamState) {
        console.log(streamState);
        counter++;
        if (counter === 20) {
            if (_.isNil(streamState.Throttle)) {
                //Note throttle
                return callback(
                    new Error(
                        "streamState.Throttle was falsy. Note that throttle updates sometimes won't happen if the value doesn't change in game"
                    )
                );
            }
            if (_.isNil(streamState.Heading)) {
                return callback(new Error('streamState.Throttle was falsy'));
            }
            callback();
        }
    };
}
