const DMS = require('../DMS');

const net = require('net');
const path = require('path')

const uuidv4 = require('uuid/v4')

const JavaObject = require('./java-object');
const Response = require('./response');

class DMSv1 extends DMS {

    constructor(host, port, {name, majorVersion, firmware, sessionId}) {
        super(host, port, {name, majorVersion, firmware, sessionId})

        let serialPath = path.join(__dirname, 'serializable', `${firmware}.json`);
        let javaSerial = new JavaObject(serialPath);
        this.javaSerial = javaSerial;

        this.bufferPool = {};
    }

    __make_request(lAddr = []) {

        let request = this.javaSerial.clone();
        
        if(typeof lAddr == 'string') {
            request.$.lAddr.$ = [lAddr];
        } else if (lAddr instanceof Array) {
            request.$.lAddr.$ = lAddr;
        } else {
            throw `lAddr expected type of Array or String, but received ${typeof lAddr}`
        }
        
        return request;
    }

    __send(request, handler) {
        let socket = net.createConnection({host: this.host, port: this.port}, () => {

            let serializedRequest = JavaObject.serialize(request);

            if('sessionId' in request.$) {
                
                let sessionAuthorizeRequest = this.__make_request();
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
        })

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
                    handler(null, response)
                }
            } catch (error) {
                // console.log(error)
            }
        });

        socket.on('error', error => {
            handler(error, null)
        })

        socket.on('close', () => {
            
            delete this.bufferPool[socket.uuid];
        });

        socket.setTimeout(3000, () => {
            socket.destroy();
            delete this.bufferPool[socket.uuid];
        })

        socket.on('timeout', () => {
            socket.destroy();
            delete this.bufferPool[socket.uuid];
        })
    }

    readAll() {

        let request = this.__make_request();

        // readAll
        request.$.functionType = 0;

        if ('sessionId' in request.$) {
            request.$.sessionId = this.sessionId;
        }

        return new Promise((resolve, reject) => {
            this.__send(request, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    let response = Response.parse(data)
                    resolve(response)
                }
            })
        })
    }

    update(lAddr, {power, temperature, fanSpeed, airSwingUD, airSwingLR, operationMode}) {

        let request = this.__make_request(lAddr);

        // update
        request.$.functionType = 1;
        // SESSION
        if('sessionId' in request.$) {
            request.$.sessionId = this.sessionId;
        }

        let facade = request.$;
        facade.power = power;
        facade.demandTemperature = temperature;
        facade.windPower = fanSpeed;
        facade.windUpDown = airSwingUD;
        facade.windLeftRight = airSwingLR;
        facade.operationMode = operationMode;

        return new Promise((resolve, reject) => {
            this.__send(request, (error, response) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            })
        })
    }
}

module.exports = DMSv1;