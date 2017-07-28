const Controller = require('./controller');

async function eunju_test() {

    let eunju = new Controller({
        name: '은주관',
        ip: '210.110.36.32',
        firmware: '1.4.4.11',
        sessionId: 'samsung.http.server0.1582141870650774'
    })

    let status = await eunju.readAll().then(v => v).catch(e => {throw e});
    console.log(status);

    eunju.update('00.00.00', {power: 'on', temperature: 23, fanSpeed: 'high', airSwingUD: 'false', airSwingLR: 'false', operationMode: 'cool'})
}

async function bukak_test() {

    let bukak = new Controller({
        name: '북악관',
        ip: '210.110.32.20',
        firmware: '1.4.3',
        sessionId: null
    })

    let status = await bukak.readAll().then(v => v).catch(e => {throw e});
    console.log(status);

    bukak.update('00.00.00', {power: 'on', temperature: 18, fanSpeed: 'high', airSwingUD: 'true', airSwingLR: 'false', operationMode: 'cool'})
}

eunju_test()
bukak_test()