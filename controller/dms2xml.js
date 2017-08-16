const xmlbuilder = require('xmlbuilder')
const http = require('http');

const uuidv4 = require('uuid/v4');
const xml2js = require('xml2js');

class DMS2XML {
    constructor(host, port = 1901, sessionId) {
        this.host = host;
        this.port = port;
        this.sessionId = sessionId;

        let root = xmlbuilder.create('root');
        root.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        root.att('xsi:noNamespaceSchemaLocation', './xml/schema/login.xsd');
        
        root.ele('header', {sa: 'web', da: 'dms', messageType: 'request', dvmControlMode: 'individual'})
        
        this.root = root;
    }

    _request(host, port = 1901, data) {

        let options = {
            host: host,
            port: port,
            method: 'POST',
            path: '/dms2/dataCommunication',
            headers: {
                'Content-Type': 'text/xml',
                'Content-Length': Buffer.byteLength(data),
                'Cookie': this.sessionId
            }
        }

        return new Promise((resolve, reject) => {
            let buffers = []
            let req = http.request(options, (res) => {
                res.setEncoding('utf-8');
                res.on('data', (chunk) => {
                    buffers.push(chunk)
                })
                res.on('end', () => {
                    let buffer = buffers.join('')
                    resolve(buffer);
                })
                res.on('error', (error) => {
                    reject(error)
                })
            })

            req.write(data);
            req.end()
        })
    }

    async readAll() {
        let root = this.root;

        let xml = root.ele('getMonitoring')
            .ele('all')

        let data = xml.end({pretty: true})

        let uuid = uuidv4();
        let response = await this._request(this.host, this.port, `${uuid}:` + data)

        let parser = new xml2js.Parser();

        return new Promise((resolve, reject) => 
            parser.parseString(response.substr(response.search('<root>')), function(err, result) {
                if(err) {
                    reject(err)
                } else {
                    let response_raw = result.root.getMonitoring[0].all[0].indoor

                    let response = response_raw.map(obj => {

                        const address = obj.$.addr
                        let detail = obj.indoorDetail[0].$

                        const power = detail.power
                        const roomTemp = detail.roomTemp;
                        const setTemp = detail.setTemp;
                        const airSwingLR = detail.airSwing_LR;
                        const airSwingUD = detail.airSwing_UD;
                        const fanSpeed = detail.fanSpeed;
                        const operationMode = detail.opMode;
                        const remoconEnable = detail.remoconEnable;
                        const name = detail.name || address;

                        return {
                            address,
                            roomTemp,
                            setTemp,
                            airSwingLR,
                            airSwingUD,
                            fanSpeed,
                            operationMode,
                            power,
                            remoconEnable,
                            name
                        }
                    })
                    resolve(response)
                }
            })
        )

    }

    async update(lAddr, {power = null, temperature = null, fanSpeed = null, airSwingUD = null, airSwingLR = null, operationMode = null}) {

        let root = this.root;

        if(typeof lAddr == 'string') {
            var addrList = [lAddr]
        } else if (lAddr instanceof Array) {
            var addrList = lAddr
        } else {
            throw 'indooor must be String or Array'
        }

        let xml = root.ele('setDeviceControl')
            .ele('controlList')
                .ele('control')
        
        // Address 추가
        let addressList = xml.ele('addressList')
        for (let addr of addrList) {
            addressList.ele('address', null, addr);
        }

        let controlValue = xml.ele('controlValue')
        if (power) {
            controlValue.ele('power', null, power)
        }
        if (temperature) {
            controlValue.ele('setTemp', null, temperature)
        }
        if (operationMode) {
            controlValue.ele('operationMode', null, operationMode)
        }
        if (fanSpeed) {
            controlValue.ele('fanSpeed', null, fanSpeed)
        }
        if (airSwingLR) {
            controlValue.ele('airSwing_LR', null, airSwingLR)
        }
        if (airSwingUD) {
            controlValue.ele('airSwing_UD', null, airSwingUD)
        }

        let data = xml.end({pretty: true})

        return await this._request(this.host, this.port, `${uuidv4()}:` + data)
    }
}

module.exports = DMS2XML