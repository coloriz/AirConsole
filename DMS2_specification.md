# SAMSUNG DMS2

1. 개요

DMS2 클라이언트는 `/dms2/main/main.jsp`에서 MicroSoft사의 SilverLight를 사용한다.  
DMS2 서버는 `/dms2/dataCommunication`에서 동작한다.  

통신 프로토콜은 `HTTP` 통신을 사용하며, MIMEType은 `text/xml`이다.  
(__application/xml이 아님에 주의.__)  

2. 형식

서버에 요청하기 위한 XML 요청 형식은 다양하나, 공통적인 형식을 사용한다.  

```xml
<?xml version="1.0" encoding="utf-8"?>
<root
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:noNamespaceSchemaLocation="./xml/schema/login.xsd">
	
	<header sa="web" da="dms" messageType="request"
    	dateTime="2017-08-11T11:17:39:882"
		dvmControlMode="individual" />
	
	{{ content }}
</root>
```

서버에서의 응답 형식도 위와 유사하다.

```xml
<?xml version="1.0" encoding="utf-8"?>
<root
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:noNamespaceSchemaLocation="./xml/schema/login.xsd">
	
	<header sa="dms" da="web" messageType="response"
    	dateTime="2017-08-11 11:00:14:"
		dvmControlMode="individual" />
	
	{{ content }}
</root>
```

> __header__  
> sa : source application  
> da : destination application  
> __messageType__ (_required_) := "request" | "response"



3. 명령

__treeInfoEx__
```xml
<!-- REQUEST -->
<treeInfoEx range="all" />

<!-- RESPONSE -->
<treeInfoEx range="all" updateDate="2014-07-25 13:22:02"   
    DDCUpdateDate="", dmsVersion="2.3.1.1" 
    temperatureScale="Celsius">

    <!-- 중앙제어기 목록 -->
    <cppList>
        <cpp addr="00" name="중앙제어기-00" deviceType="caur" modelCode="02 78 0B 04 13 17 A1 0B 00" inVirtual="false" />
        <!-- 이하 생략 -->
    </cppList>

    <!-- ??? -->
    <ddcList>
        <ddc addr="56" name="DMS DI∙DO" modelCode="" />
    </ddcList>

    <!-- ??? -->
    <portList>
        <port addr="56.00" name="56.00" modelCode="" />
        <!-- 이하 생략 -->
    </portList>

    <!-- 실외기 목록 -->
    <outdoorList>
        <outdoor addr="00.00.00" name="00.00.00" modelCode="10 D0 6E 01 0A 13 26 A2 0B 00 C8 0A FF 4B FF FF FF FF 00" />
        <!-- 이하 생략 -->
    </outdoorList>

    <!-- 실내기 목록 -->
    <indoorList>
        <indoor addr="00.01.07" rmcAddr="15" modelCode="07 00 33 FF 13 15 A3 0B 00" indoorType="g4w" name="00.01.07" />
        <!-- 이하 생략 -->
    </indoorList>

    <pointList>
        <point addr="56.00.09" name="56.00.09" deviceType="DI" modelCode="" />
        <!-- 이하 생략 -->
    </pointList>
</treeInfoEx>
```

> __indoor__  
> addr: indoor address  
> rmcAddr: ???  
> modelCode: ???  
> indoorType := "indoor" | "g4w"    # dms클라이언트에서는 g4w를 indoor와 동일시 취급함  
> name: indoor name  

__getMonitoring__
```xml
<!-- REQUEST -->
<getMonitoring>
    <all />
</getMonitoring>

<!-- RESPONSE -->
<getMonitoring>
    <all>
        <indoor addr="00.01.07">
            <indoorDetail
                power="off"
                setTemp="24"
                roomTemp="29"
                opMode="auto"
                airSwing_UD="false"
                airSwing_LR="false"
                fanSpeed="auto"
                controlMode="cool"
                remoconEnable="true"
                spi="false" useHumanSensor="false" useAutoClean="false" useSpi="false" useDischargeSetTemp="false" useOaIntake="false" useOutdoorCool="false" useHumidification="false" useSetHumidity="false" error="false" peakStatus="false" evapInTemp="28" evapOutTemp="28" capaCode="6100" modelCode="15" filterWairing="false" defrostOn="false" eev="35" temperatureScale="Celsius" useMode="cool" upperTemperatureLimit="true" upperTemperature="31" lowerTemperatureLimit="true" lowerTemperature="20" isTempLimited="true" isScheduled="true" />
        </indoor>
    </all>
</getMonitoring>
```

__setDeviceControl__
```xml
<!-- REQUEST -->
<setDeviceControl>
    <controlList>
        <control>
            <controlValue>
                <!-- power: "on" | "off" -->
                <power>on</power>
                <!-- operationMode: "auto" | "cool" | "dry" | "fan" | "heat" -->
                <operationMode>dry</operationMode>
                <!-- fanSpeed: "low" | "mid" | "high" -->
                <fanSpeed>mid</fanSpeed>
                <!-- airSwing_UD: "true" | "false" -->
                <airSwing_UD>true</airSwing_UD>
                <!-- airSwing_LR: "true" | "false" -->
                <airSwing_LR>true</airSwing_LR>
                <!-- setTemp: "18..30" -->
                <setTemp>21</setTemp>
            </controlValue>
            <addressList>
                <address>00.00.00</address>
            </addressList>
        </control>
    </controlList>
</setDeviceControl>
```