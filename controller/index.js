const path = require('path');

const BaseController = require('./base_controller');
const JavaObject = require('./java_object');

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
        super({ip, port})

        this._spec = {
            name,
            firmware,
            sessionId
        }

        this._javaObject = new JavaObject(path.join(Controller.serializable_path, `${this._spec.firmware}.json`));
    }

    _makeRequest(indoor = []) {

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

    readAll() {

        let request = this._makeRequest();

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

    update(lAddr, {power, temperature, fanSpeed, airSwingUD, airSwingLR, operationMode}) {

        let request = this._makeRequest(lAddr);

        // WRITE
        request.$.functionType = 1;
        // SESSION
        if('sessionId' in request.$) {
            request.$.sessionId = this._spec.sessionId;
        }
        

        let field = request.$;
        field.power = power;
        field.temperature = temperature;
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
}

module.exports = Controller;