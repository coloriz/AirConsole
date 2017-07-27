const fs = require('fs');
const {InputObjectStream, OutputObjectStream} = require('java.io');

class JavaObject {

    constructor(template_file) {

        let template = fs.readFileSync(template_file);
        this._template = JSON.parse(template);
    }

    clone() {

        // 리스트 복사
        let list_clone = Object.assign({}, this._template.$.lAddr);
        list_clone.$ = [];

        // 필드 복사
        let field_clone = Object.assign({}, this._template.$);
        field_clone.lAddr = list_clone;

        // 템플릿 복사
        let template_clone = Object.assign({}, this._template);
        template_clone.$ = field_clone;

        return template_clone;
    }

    static serialize(javaObject) {

        let oos = new OutputObjectStream();
        let buffer = oos.write(javaObject);
        return buffer;
    }

    static deserialize(buffer) {

        let ois = new InputObjectStream(buffer, false);
        return ois.readObject();
    }

}

module.exports = JavaObject;