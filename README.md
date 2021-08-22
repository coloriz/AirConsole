# AirController

Samsung DMS client for Node.js

## How to use

```javascript
const AirConsole = require('./AirConsole');

async function bukak_read() {

    let bukak = new AirConsole({
        name: '북악관',
        host: '210.110.32.20',
        port: 1901,
        firmware: '1.4.3',
        sessionId: null
    })

    // read all status
    let status = await bukak.readAll().then(v => v).catch(e => {throw e});
    console.log(status);
    
    // update status for address '00.00.00'
    bukak.update('00.05.02', {power: 'on', temperature: 18, fanSpeed: 'high', airSwnigUD: 'true', airSwingLR: 'true', operationMode: 'cool'})
}

```

---

#### Constructor

__new AirConsole({name, ip, port? firmware, sessionId})__

- name: Name  
- host: DMS 서버 주소  
- port: DMS 서버 포트(default: 1901)  
- firmware: DMS 펌웨어 버전  
- sessionId: 세션 ID  

---

#### Methods

__AirConsole.readAll :: Promise__  

success: [ Response {address, roomTemp, setTemp, airSwingUD, airSwingLR, fanSpeed, operationMode, power, remoconEnable} ]  
failure: error  

__AirConsole.update(lAddr, {power, temperature, fanSpeed, airSwingUD, airSwingLR, operationMode})__  

- lAddr = indoor address :: String | [String]  
- power = 전원 :: "on" | "off"  
- roomTemp = 현재 온도 :: Int  
- setTEmp = 희망 온도 :: Int  
- fanSpeed = 바람 세기 :: "on" | "off"  
- airSwingUD = 상하 팬 회전 :: "true" | "false"  
- airSwingLR = 좌우 팬 회전 :: "true" | "false"  
- operationMode = 운전 선택 :: "auto" | "fan" | "cool" | "heat" | "dry"  

---

## 지원되는 펌웨어 버전

- 1.4.0
- 1.4.2
- 1.4.2r8-T
- 1.4.3
- 1.4.4.11
- 2.x.x.x

---

## LICENSE
> MIT License
> 
> Copyright (c) 2017 Jimmy_and_Deathwish
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
