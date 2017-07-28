const Controller = require('./controller');

async function eunju_test() {

    let eunju = new Controller({
        name: '은주관',
        ip: '210.110.36.32',
        firmware: '1.4.4.11',
        sessionId: 'samsung.http.server0.34035795566805793'
    })
    let status = await eunju.readAll().then(v => v).catch(e => {throw e});
    console.log(status);
    
    await eunju.update('00.00.00', {power: 'off', temperature: 18, windPower: 'high', windUpDown: 'true', windLeftRight: 'true', operationMode: 'cool'}).then(v => v).catch(e => {throw e;})
}

async function bukak_test() {

    let bukak = new Controller({
        name: '북악관',
        ip: '210.110.32.20',
        firmware: '1.4.3',
        sessionId: null
    })
    // let status = await bukak.readAll().then(v => v).catch(e => {throw e});
    // console.log(status);

    bukak.update('00.00.00', {power: 'off', temperature: 20, windPower: 'high', windUpDown: 'false', windLeftRight: 'false', operationMode: 'cool'})
}

eunju_test()
bukak_test()