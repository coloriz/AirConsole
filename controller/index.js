const path = require('path');

const BaseController = require('./base_controller');
const JavaObject = require('./java_object');

const DMS2XML = require('./dms2xml');

const Response = require('./response');


class Controller extends BaseController {

    static get serializable_path() {
        return 'serializable'
    }

    /**
     * 
     * @param {String} name         건물 명. Controller 인스턴스를 식별하는 데 사용된다.
     * @param {String} ip           Host IP. 요청을 전송할 호스트의 주소로 사용된다.
     * @param {Number} port         Server Port. 기본 값은 1901이다.
     * @param {String} firmware     펌웨어 버전. `serializable{firmware.json}/` 파일을 로드하기 위해 필요하다.
     * @param {String?} sessionId   세션 값. 세션이 필요하지 않은 버전의 경우, 세션을 null로 지정해야 한다.
     */
    constructor({name, ip, port = 1901, firmware, sessionId}) {

        // Request 초기화
        super({ip, port, sessionId})

        this._spec = {
            name,
            firmware,
            sessionId
        }

        let majorVersion = parseInt(firmware[0]);
        this.majorVersion = majorVersion;
        switch(majorVersion) {
            case 1:
                this._javaObject = new JavaObject(path.join(__dirname, Controller.serializable_path, `${this._spec.firmware}.json`));
                break;
            case 2:
                break;
            default:
                throw `unsupported dms version: ${majorVersion}`
        }
    }

    _makeDMSv1Request(indoor = []) {

        let request = this._javaObject.clone();

        if(typeof indoor == 'string') {
            request.$.lAddr.$ = [indoor];
        } else if (indoor instanceof Array) {
            request.$.lAddr.$ = indoor;
        } else {
            throw 'indooor must be String or Array'
        }
        
        return request;
    }

    readDMS1() {
        let request = this._makeDMSv1Request();

        // READ
        request.$.functionType = 0;
        // SESSION
        if('sessionId' in request.$) {
            request.$.sessionId = this._spec.sessionId;
        }

        // send
        return new Promise((resolve, reject) => {

            super.send(request, (error, response) => {
                if(error) {
                    reject(error);
                } else {

                    resolve(Response.parse(response));
                }
            })
        });
    }

    _makeDMSv2Request() {
        return new DMS2XML(this.ip, this.port, this.sessionId);
    }

    readDMS2() {
        let request = this._makeDMSv2Request()
        return request.readAll()
    }

    readAll() {

        switch(this.majorVersion) {
            case 1:
                return this.readDMS1();
            case 2:
                return this.readDMS2();
            default:
                throw `Unsupported DMS Version: ${majorVersion}`;
        }
    }

    updateDMSv1(lAddr, {power, temperature, fanSpeed, airSwingUD, airSwingLR, operationMode}) {

        let request = this._makeDMSv1Request(lAddr);

        // WRITE
        request.$.functionType = 1;
        // SESSION
        if('sessionId' in request.$) {
            request.$.sessionId = this._spec.sessionId;
        }
        

        let field = request.$;
        field.power = power;
        field.demandTemperature = temperature;
        field.windPower = fanSpeed;
        field.windUpDown = airSwingUD;
        field.windLeftRight = airSwingLR;
        field.operationMode = operationMode;

        // send
        super.send(request, (error, response) => {
            if(error) {
                // reject(error);
                throw error;
            } else {
                // resolve(response);
            }
        })
    }

    updateDMSv2(lAddr, options) {
        let request = this._makeDMSv2Request()
        return request.update(lAddr, options)
    }

    update(lAddr, options) {
        switch(this.majorVersion) {
            case 1:
                return this.updateDMSv1(lAddr, options);
            case 2:
                return this.updateDMSv2(lAddr, options);
            default:
                throw `Unsupported DMS Version: ${majorVersion}`;
        }
    }
}

module.exports = Controller;