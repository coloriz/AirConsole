
class DMS {

    constructor(host, port, {name, majorVersion, firmware, sessionId}) {

        this.host = host;
        this.port = port;

        this.name = name;
        this.majorVersion = majorVersion;
        this.firmware = firmware;
        this.sessionId = sessionId;
    }

    readAll() {
        throw `Not emplemented method`
    }

    update(lAddr, {power, temperature, fanSpeed, airSwingUD, airSwingLR, operationMode}) {
        throw `Not emplemented method`
    }
}

module.exports = DMS;