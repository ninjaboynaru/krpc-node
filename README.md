# krpc-node

A node.js client library for krpc. Allows you to send commands to Kerbal Space Program from node.

> JavaScript to space via krpc!

![NPM](https://nodei.co/npm/krpc-node.svg)

![Build status](https://travis-ci.org/eXigentCoder/krpc-node.svg?branch=master)

# Table of Contents

> Client

-   [Client constructor function](#Client)
-   [Client object](#client)

> Services:

-   [SpaceCenter](https://github.com/eXigentCoder/krpc-node/blob/master/documentation/space-center.md) - Main api for controlling KSP.
-   [UI](https://github.com/eXigentCoder/krpc-node/blob/master/documentation/ui.md) - Api for interacting with user interface elements.
-   [InfernalRobotics](https://github.com/eXigentCoder/krpc-node/blob/master/documentation/infernal-robotics.md) - Api for interacting with the Infernal Robotics mod.
-   [KerbalAlarmClock](https://github.com/eXigentCoder/krpc-node/blob/master/documentation/kerbal-alarm-clock.md) - Api for interacting with the Kerbal Alarm Clock mod.
-   [RemoteTech](https://github.com/eXigentCoder/krpc-node/blob/master/documentation/remote-tech.md) - Api for interacting with the Remote Tech mod.
-   [Drawing](https://github.com/eXigentCoder/krpc-node/blob/master/documentation/drawing.md) - Api for for drawing objects in the flight scene.
-   [KRPC](https://github.com/eXigentCoder/krpc-node/blob/master/documentation/krpc.md) - Api for interacting with the kRPC server.

> Examples:

-   [Examples](https://github.com/eXigentCoder/krpc-node-examples) - Some practical examples to get you started.

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## client

An instance of the Client class

**Properties**

-   `socket` **[WebSocket](https://developer.mozilla.org/en-US/docs/WebSockets)** The underlying websocket instance
-   `emitter` **EventEmitter** The emitter that handles events.
-   `decodeStack` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>** The stack of functions to use to decode responses from the server.
-   `send` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Sends one or more calls to the server to process
-   `on` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Registers for one of the events [open, message, error, close].
-   `services` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The collection of services that can be called. Each function within a service will return a procedureCall object.
    -   `services.drawing` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Provides functionality for drawing objects in the flight scene. For drawing and interacting with the user interface, see the UI service.
    -   `services.infernalRobotics` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** This service provides functionality to interact with <a href="http://forum.kerbalspaceprogram.com/index.php?/topic/104535-105-magic-smoke-industries-infernal-robotics-0214/">Infernal Robotics</a>.
    -   `services.kerbalAlarmClock` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** This service provides functionality to interact with <a href="http://forum.kerbalspaceprogram.com/index.php?/topic/22809-10x-kerbal-alarm-clock-v3500-dec-3/">Kerbal Alarm Clock</a>.
    -   `services.krpc` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Main kRPC service, used by clients to interact with basic server functionality.
    -   `services.remoteTech` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** This service provides functionality to interact with <a href="http://forum.kerbalspaceprogram.com/index.php?/topic/75245-11-remotetech-v1610-2016-04-12/">RemoteTech</a>.
    -   `services.spaceCenter` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Provides functionality to interact with Kerbal Space Program. This includes controlling the active vessel, managing its resources, planning maneuver nodes and auto-piloting.
    -   `services.ui` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Provides functionality for drawing and interacting with in-game user interface elements. For drawing 3D objects in the flight scene, see the Drawing service.

## procedureCall

A procedure call with a decode function an a procedure object to send to the server

**Properties**

-   `decode` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** The function used to decode the response from the server.
-   `call` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The actual call + arguments to send to the server to execute.

## ClientConstructorFunction

Create a new krpc-node client

**Parameters**

-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The options used to create the client
    -   `options.protocol` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** ="ws" - The protocol to use to connect to the server. ws or wss.
    -   `options.host` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** ="127.0.0.1" - The host address of the server.
    -   `options.port` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number))** ="50000" - The port number on which to connect to the server.
    -   `options.wsProtocols` **\[([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>)]** WebSocket protocols.
    -   `options.wsOptions` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Additional connection options.

**Examples**

```javascript
let util = require('util');
let Client = require('krpc-node');
let client = Client();
client.on('open', function (event) {
    console.log(util.format('Connection Opened : %j', event));
    client.send(client.services.krpc.getClients());
});
client.on('error', function (err) {
    console.log(util.format('Error : %j', err));
});
client.on('message', function (response , event) {
    console.log(util.format('Response : %j', response));
});
client.on('close', function (event) {
    console.log(util.format('Connection Closed : %j', event));
});
```

Returns **[client](#client)** The client instance.

## Send

Sends one or more calls to the server to process

**Parameters**

-   `calls` **([procedureCall](#procedurecall) \| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[procedureCall](#procedurecall)>)** One or more calls to send to the server.

## On

Registers for one of the events [open, message, error, close].

**Parameters**

-   `eventName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The event to register for [open, message, error, close].
-   `fn` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** The function to execute when an event happens

# Practical Examples