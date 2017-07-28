const net = require('net');

const uuidv4 = require('uuid/v4');
const JavaObject = require('./java_object');

class BaseController {

    constructor({ip, port}) {

        this.ip = ip;
        this.port = port;

        this.bufferPool = {};
    }

    /**
     * 
     * @param {Object} request 
     * @param {function(error, response)} handle 
     */
    send(request, handle) {

        let socket = net.createConnection({host: this.ip, port: this.port}, () => {

            let serializedRequest = JavaObject.serialize(request);


            if('sessionId' in request.$) {
                
                let sessionAuthorizeRequest = this._makeRequest();
                sessionAuthorizeRequest.$.functionType = 4;
                sessionAuthorizeRequest.$.sessionId = request.$.sessionId;

                let serialized_sessionAuthorizedRequest = JavaObject.serialize(sessionAuthorizeRequest);

                // sessionAuthorize
                socket.write(serialized_sessionAuthorizedRequest);
                // stream reset packet
                let reset_packet = new Buffer([0x79]); 
                socket.write(reset_packet);

                serializedRequest = serializedRequest.slice(4);
            }

            // request
            socket.write(serializedRequest);
            
            if(!socket.uuid) {
                socket.uuid = uuidv4();
            }

        });

        if(!socket.uuid) {
            socket.uuid = uuidv4();
        }
        
        this.bufferPool[socket.uuid] = [];

        socket.on('data', data => {

            this.bufferPool[socket.uuid].push(data);
            let fullBuffer = Buffer.concat(this.bufferPool[socket.uuid]);

            try {

                let response = JavaObject.deserialize(fullBuffer);
                if(response) {

                    socket.destroy();
                    handle(null, response)
                }
            } catch (error) {
                // console.log(error)
            }
        })

        socket.on('error', (error) => {
            handle(error, null)
        })

        socket.on('close', () => {

            delete this.bufferPool[socket.uuid];
        });
    }
}

module.exports = BaseController;