
class Response {
    
    static parse({indoorTable}) {
        delete indoorTable.loadFactor;
        delete indoorTable.threshold;

        return Object.keys(indoorTable).map( addr => {

            let indoor = indoorTable[addr];
            let detail = indoor._detailIndoor;

            return {
                address: detail._sAddr,
                roomTemp: detail._iRoomTemp,
                setTemp: detail._iSetTemp,
                airSwingLR: detail._sAirSwing_LR,
                airSwingUD: detail._sAirSwing_UD,
                fanSpeed: detail._sFanSpeed,
                operationMode: detail._sOperationMode,
                power: detail._sPower,
                remoconEnable: detail._sRemoconEnable,
                name: indoor._sIndoorName
            };
        });
    }
}

module.exports = Response;