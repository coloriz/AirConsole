const Controller = require('./controller');

async function main() {
    let bukak = new Controller({
        name: '북악관', host: '210.110.32.20', port: 1901, firmware: '1.4.3', sessionId: null
    })
    // let result = await bukak.readAll()
    // console.log(result)
    // bukak.update('00.05.02', {power: "on", temperature: 18, fanSpeed: "high", airSwingUD: "true", airSwingLR: "true", operationMode: "cool"})

    let hyein = new Controller( {
        name: '혜인관', host: '117.17.147.241', port: 80, firmware: '2.3.1.1', sessionId: '8lfgfy53ii0b'
    })
    let result = await hyein.readAll()
    console.log(result)
    // hyein.update('00.00.00', {power: "off", temperature: 18, fanSpeed: "high", airSwingUD: "true", airSwingLR: "true", operationMode: "cool"})
}

main()

module.exports = Controller;