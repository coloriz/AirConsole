const DMS = require('../DMS');

const xmlbuilder = require('xmlbuilder')
const http = require('http');

const uuidv4 = require('uuid/v4');
const xml2js = require('xml2js');

const DMS2X = require('./dms2x');

class DMSv2 extends DMS {

    constructor(host, port, {name, majorVersion, firmware, sessionId}) {
        super(host, port, {name, majorVersion, firmware, sessionId})
    }

    readAll() {
	try {
            let request = new DMS2X(this.host, this.port, this.sessionId);
            return request.readAll();
	} catch (err) {
	    return []
	}
    }

    update(lAddr, {power, temperature, fanSpeed, airSwingUD, airSwingLR, operationMode}) {
        let request = new DMS2X(this.host, this.port, this.sessionId);
        return request.update(lAddr, {power, temperature, fanSpeed, airSwingUD, airSwingLR, operationMode})
    }
}

module.exports = DMSv2;
