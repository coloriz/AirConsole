const DMSv1 = require('./DMSv1');
const DMSv2 = require('./DMSv2');


class Controller {

    constructor({name, host, port, firmware, sessionId = null}) {

        let majorVersion = parseInt(firmware[0])

        let spec = {
            name, firmware, sessionId, majorVersion
        }
        this._spec = spec;

        switch (majorVersion) {
            case 1:
                this.dms = new DMSv1(host, port, spec);
                break;
            case 2:
                this.dms = new DMSv2(host, port, spec);
                break;
            default:
                throw `Unsupported DMS version: ${majorVersion}`
        }
    }

    readAll() {
        return this.dms.readAll()
    }

    update(lAddr, {power, temperature, fanSpeed, airSwingUD, airSwingLR, operationMode}) {

        this.dms.update(lAddr, {power, temperature, fanSpeed, airSwingUD, airSwingLR, operationMode})
    }
}

module.exports = Controller