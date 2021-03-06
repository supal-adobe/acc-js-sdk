/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/


/**********************************************************************************
 * 
 * Unit tests for the ACC client
 * 
 *********************************************************************************/

 const Client = require('../src/client.js').Client;
 const DomUtil = require('../src/dom.js').DomUtil;


function makeClient(rememberMe) {
    const client = new Client("http://acc-sdk:8080", "admin", "admin", rememberMe);
    client.soapTransport = jest.fn();
    return client;
}

const LOGON_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:session' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <LogonResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pstrSessionToken xsi:type='xsd:string'>___C8B4A541-48DC-4C97-95AD-066930FD3892</pstrSessionToken>
            <pSessionInfo xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
            <sessionInfo>
                <serverInfo advisedClientBuildNumber="0" allowSQL="false" buildNumber="9219" commitId="f5f3ec3" databaseId="uFE80000000000000F1FA913DD7CC7C480041161C" defaultNameSpace="cus" fohVersion="2" instanceName="ffdamkt" majNumber="6" minClientBuildNumber="8969" minNumber="7" minNumberTechnical="0" releaseName="20.3" securityTimeOut="86400" serverDate="2020-07-05 14:11:31.986Z" servicePack="0" sessionTimeOut="86400" useVault="false"/>
                    <userInfo datakitInDatabase="true" homeDir="" instanceLocale="en" locale="en" login="admin" loginCS="Administrator (admin)" loginId="1059" noConsoleCnx="false" orgUnitId="0" theme="" timezone="Europe/Paris">
                        <login-group id="1060"/>
                        <login-right right="admin"/>
                        <installed-package name="campaign" namespace="nms"/>
                        <installed-package name="core" namespace="nms"/>
                    </userInfo>
                </sessionInfo>
            </pSessionInfo>
            <pstrSecurityToken xsi:type='xsd:string'>@mMBSMLXIpQd56agsZ5X7OGXWz8Q476qMq6FimwqCdT1wByRDq3pQtaYSY4uJnAbCgXIvpXA5TrxHu-3YjUad5g==</pstrSecurityToken>
        </LogonResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const LOGON_RESPONSE_NO_SESSIONTOKEN = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:session' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <LogonResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pstrSessionToken xsi:type='xsd:string'></pstrSessionToken>
            <pSessionInfo xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
            <sessionInfo>
                <serverInfo advisedClientBuildNumber="0" allowSQL="false" buildNumber="9219" commitId="f5f3ec3" databaseId="uFE80000000000000F1FA913DD7CC7C480041161C" defaultNameSpace="cus" fohVersion="2" instanceName="ffdamkt" majNumber="6" minClientBuildNumber="8969" minNumber="7" minNumberTechnical="0" releaseName="20.3" securityTimeOut="86400" serverDate="2020-07-05 14:11:31.986Z" servicePack="0" sessionTimeOut="86400" useVault="false"/>
                    <userInfo datakitInDatabase="true" homeDir="" instanceLocale="en" locale="en" login="admin" loginCS="Administrator (admin)" loginId="1059" noConsoleCnx="false" orgUnitId="0" theme="" timezone="Europe/Paris">
                        <login-group id="1060"/>
                        <login-right right="admin"/>
                        <installed-package name="campaign" namespace="nms"/>
                        <installed-package name="core" namespace="nms"/>
                    </userInfo>
                </sessionInfo>
            </pSessionInfo>
            <pstrSecurityToken xsi:type='xsd:string'>@mMBSMLXIpQd56agsZ5X7OGXWz8Q476qMq6FimwqCdT1wByRDq3pQtaYSY4uJnAbCgXIvpXA5TrxHu-3YjUad5g==</pstrSecurityToken>
        </LogonResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const LOGON_RESPONSE_NO_SECURITYTOKEN = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:session' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <LogonResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pstrSessionToken xsi:type='xsd:string'>___C8B4A541-48DC-4C97-95AD-066930FD3892</pstrSessionToken>
            <pSessionInfo xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
            <sessionInfo>
                <serverInfo advisedClientBuildNumber="0" allowSQL="false" buildNumber="9219" commitId="f5f3ec3" databaseId="uFE80000000000000F1FA913DD7CC7C480041161C" defaultNameSpace="cus" fohVersion="2" instanceName="ffdamkt" majNumber="6" minClientBuildNumber="8969" minNumber="7" minNumberTechnical="0" releaseName="20.3" securityTimeOut="86400" serverDate="2020-07-05 14:11:31.986Z" servicePack="0" sessionTimeOut="86400" useVault="false"/>
                    <userInfo datakitInDatabase="true" homeDir="" instanceLocale="en" locale="en" login="admin" loginCS="Administrator (admin)" loginId="1059" noConsoleCnx="false" orgUnitId="0" theme="" timezone="Europe/Paris">
                        <login-group id="1060"/>
                        <login-right right="admin"/>
                        <installed-package name="campaign" namespace="nms"/>
                        <installed-package name="core" namespace="nms"/>
                    </userInfo>
                </sessionInfo>
            </pSessionInfo>
            <pstrSecurityToken xsi:type='xsd:string'></pstrSecurityToken>
        </LogonResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const LOGOFF_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:session' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <LogoffResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
        </LogoffResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_XTK_SESSION_SCHEMA_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:wpp:default' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <GetEntityIfMoreRecentResponse xmlns='urn:wpp:default' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pdomDoc xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
            <schema namespace="xtk" name="session" implements="xtk:persist">
                <interface name="persist">
                    <method name="Write" static="true">
                        <parameters>
                            <param name="doc" type="DOMDocument"/>
                        </parameters>
                    </method>
                    <method name="GetDocument" static="true">
                        <parameters>
                            <param inout="out" name="doc" type="DOMDocument"/>
                        </parameters>
                    </method>
                    <method name="GetElement" static="true">
                        <parameters>
                            <param inout="out" name="doc" type="DOMElement"/>
                        </parameters>
                    </method>
                    <method name="SetDocument" static="true">
                        <parameters>
                            <param name="doc" type="DOMDocument"/>
                        </parameters>
                    </method>
                    <method name="SetElement" static="true">
                        <parameters>
                            <param name="doc" type="DOMElement"/>
                        </parameters>
                    </method>
                </interface>
                <element name="sessionInfo"/>
                <element name="userInfo" label="Parameters" desc="Information on current session">
                    <attribute name="loginId" type="long"/>
                </element>
                <element name="session"></element>
                <methods>
                    <method name="GetOption" static="true">
                        <parameters>
                            <param name="name" type="string"/>
                            <param inout="out" name="value" type="string"/> 
                            <param inout="out" name="type" type="byte"/>
                        </parameters>
                    </method> 
                    <method name="GetUserInfo" static="true">
                        <parameters>
                            <param name="userInfo" type="sessionUserInfo" inout="out"/>
                        </parameters>
                    </method>
                    <method name="NonStatic"></method>
                    <method name="TestCnx" static="true"></method>
                    </methods>
            </schema>
            </pdomDoc>
        </GetEntityIfMoreRecentResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`)

const GET_DATABASEID_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:session' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <GetOptionResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pstrValue xsi:type='xsd:string'>uFE80000000000000F1FA913DD7CC7C480041161C</pstrValue>
            <pbtType xsi:type='xsd:byte'>6</pbtType>
        </GetOptionResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_OPTION_NOTFOUND_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:session' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <GetOptionResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pstrValue xsi:type='xsd:string'></pstrValue>
            <pbtType xsi:type='xsd:byte'>0</pbtType>
        </GetOptionResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

// forged getOption response where the resulting values are missinf
const GET_OPTION_MISSING_DATA_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:session' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <GetOptionResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
        </GetOptionResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_XTK_QUERY_SCHEMA_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:wpp:default' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <GetEntityIfMoreRecentResponse xmlns='urn:wpp:default' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pdomDoc xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
                <schema name="queryDef" namespace="xtk">
                    <element name="queryDef"></element>
                    <methods>
                        <method const="true" name="ExecuteQuery">
                            <parameters>
                                <param desc="Output XML document" inout="out" name="output" type="DOMDocument"/>
                            </parameters> 
                        </method>
                    </methods>
                </schema>
            </pdomDoc>
        </GetEntityIfMoreRecentResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_MID_EXT_ACCOUNT_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:queryDef' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <ExecuteQueryResponse xmlns='urn:xtk:queryDef' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pdomOutput xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
                <extAccount account="mid" id="2088" name="defaultEmailMid" password="@57QS5VHMb9BCsojLVrKI/Q==" server="http://ffdamid:8080" type="3"/>
            </pdomOutput>
        </ExecuteQueryResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_SECRET_KEY_OPTION_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:session' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <GetOptionResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pstrValue xsi:type='xsd:string'>HMLmn6uvWr8wu1Akt8UORr07YbC64u1FVW7ENAxNjpo=</pstrValue>
            <pbtType xsi:type='xsd:byte'>6</pbtType>
        </GetOptionResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_LOGON_MID_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:session' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <LogonResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pstrSessionToken xsi:type='xsd:string'>___46FCE345-D052-4DF3-B659-C794CA98B9AA</pstrSessionToken>
            <pSessionInfo xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
            <sessionInfo>
                <serverInfo advisedClientBuildNumber="0" allowSQL="false" buildNumber="9219" commitId="f5f3ec3" databaseId="uFE80000000000000F1FA913DD7CC7C480CC4AAEE" defaultNameSpace="cus" fohVersion="2" instanceName="ffdamid" majNumber="6" minClientBuildNumber="8969" minNumber="7" minNumberTechnical="0" releaseName="20.3" securityTimeOut="86400" serverDate="2020-07-05 15:09:23.320Z" servicePack="0" sessionTimeOut="86400" useVault="false"/>
            </sessionInfo>
            </pSessionInfo>
            <pstrSecurityToken xsi:type='xsd:string'>@ZqisVeI1MYcIYZUso5mcI6Q77KDrRIFuYDjvZ4FMEWJqygmN6P23vns46ayOg-nAofiSyzVbvCFcnXOmwKg1Kw==</pstrSecurityToken>
        </LogonResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);
    
const GET_TSTCNX_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:session' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <TestCnxResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
        </TestCnxResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_NMS_EXTACCOUNT_SCHEMA_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:wpp:default' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <GetEntityIfMoreRecentResponse xmlns='urn:wpp:default' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pdomDoc xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
                <schema name="extAccount" namespace="nms" xtkschema="xtk:schema">
                    <enumeration basetype="byte" default="delivery" name="type">
                        <value name="bounces" value="0"/>
                        <value name="hdfs" value="17"/>
                    </enumeration>
                    <enumeration basetype="byte" default="none" name="encryptionType">
                        <value name="none" value="0"/>
                        <value name="ssl" value="1"/>
                    </enumeration>
                    <element name="extAccount"></element>
                </schema>
            </pdomDoc>
        </GetEntityIfMoreRecentResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_XTK_ALL_SCHEMA_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:wpp:default' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <GetEntityIfMoreRecentResponse xmlns='urn:wpp:default' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pdomDoc xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
                <schema name="all" namespace="xtk" xtkschema="xtk:schema">
                    <element name="all"></element>
                    <methods>
                        <method name="AllTypes" static="true">
                            <parameters>
                            <param inout="in" name="string" type="string"/>
                            <param inout="in" name="boolean" type="boolean"/>
                            <param inout="in" name="byte" type="byte"/>
                            <param inout="in" name="short" type="short"/>
                            <param inout="in" name="long" type="long"/>
                            <param inout="in" name="datetime" type="datetime"/>
                            <param inout="in" name="date" type="date"/>
                            <param inout="out" name="string" type="string"/>
                            <param inout="out" name="boolean" type="boolean"/>
                            <param inout="out" name="byte" type="byte"/>
                            <param inout="out" name="short" type="short"/>
                            <param inout="out" name="long" type="long"/>
                            <param inout="out" name="datetime" type="datetime"/>
                            <param inout="out" name="date" type="date"/>
                            <param inout="in" name="element" type="DOMElement"/>
                            <param inout="out" name="element" type="DOMElement"/>
                            <param inout="in" name="element" type="DOMDocument"/>
                            <param inout="out" name="element" type="DOMDocument"/>
                            </parameters> 
                        </method>
                        <method name="Unsupported" static="true">
                            <parameters>
                            <param inout="out" name="unsupported" type="unsupported"/>
                            </parameters> 
                        </method>
                        <method name="UnsupportedInput" static="true">
                            <parameters>
                            <param inout="in" name="unsupported" type="unsupported"/>
                            </parameters> 
                        </method>
                    </methods>
                </schema>
            </pdomDoc>
        </GetEntityIfMoreRecentResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);
    
const GET_XTK_ALL_TYPES_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:wpp:default' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <AllTypesResponse xmlns='urn:wpp:default' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <dummy xsi:type='xsd:string'>Hello World</dummy>
            <dummy xsi:type='xsd:boolean'>true</dummy>
            <dummy xsi:type='xsd:byte'>1</dummy>
            <dummy xsi:type='xsd:short'>1000</dummy>
            <dummy xsi:type='xsd:int'>100000</dummy>
            <dummy xsi:type='xsd:dateTime'>2020-12-31T12:34:56.789Z</dummy>
            <dummy xsi:type='xsd:date'>2020-12-31</dummy>
            <dummy xsi:type='ns:Element'><root type='element' result='true'/></dummy>
            <dummy xsi:type=''><root type='document' result='true'/></dummy>
        </AllTypesResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_XTK_TYPE_UNSUPPORTED_TYPE_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:wpp:default' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <Unsupported xmlns='urn:wpp:default' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <dummy xsi:type='unsupported'>Hello World</dummy>
        </Unsupported>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);


const GET_USER_INFO_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:wpp:default' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
    <GetUserInfoResponse xmlns='urn:xtk:session' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
        <pUserInfo xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
            <userInfo datakitInDatabase="true" homeDir="" instanceLocale="en" locale="en" login="admin" loginCS="Administrator (admin)" loginId="1059" noConsoleCnx="false" orgUnitId="0" theme="" timezone="Europe/Paris">
                <login-group id="1060"/>
                <login-right right="admin"/>
            </userInfo>
        </pUserInfo>
    </GetUserInfoResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`); 

const GET_MISSING_SCHEMA_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:wpp:default' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <GetEntityIfMoreRecentResponse xmlns='urn:wpp:default' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pdomDoc xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
            </pdomDoc>
        </GetEntityIfMoreRecentResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`); 
   
const GET_XTK_WORKFLOW_SCHEMA_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:wpp:default' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
        <GetEntityIfMoreRecentResponse xmlns='urn:wpp:default' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
            <pdomDoc xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
            <schema namespace="xtk" name="workflow">
                <element name="workflow"></element>
                <methods>
                    <method name="StartWithParameters" static="true">
                        <parameters>
                            <param name="workflowId" type="string" inout="in" />
                            <param name="parameters" type="DOMElement" inout="in"></param>
                        </parameters>
                    </method>
                </methods>
            </schema>
            </pdomDoc>
        </GetEntityIfMoreRecentResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_QUERY_EXECUTE_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:queryDef' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
    <ExecuteQueryResponse xmlns='urn:xtk:queryDef' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
        <pdomOutput xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
        <extAccount-collection>
            <extAccount id="1816" name="defaultPopAccount"/>
            <extAccount id="1818" name="defaultOther"/>
            <extAccount id="1849" name="billingReport"/>
            <extAccount id="12070" name="TST_EXT_ACCOUNT_POSTGRESQL"/>
            <extAccount id="1817" name="defaultEmailBulk"/>
            <extAccount id="2087" name="ffda"/>
            <extAccount id="2088" name="defaultEmailMid"/>
        </extAccount-collection>
        </pdomOutput></ExecuteQueryResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_GETDOCUMENT_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:persist' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
    <GetDocumentResponse xmlns='urn:xtk:persist' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
        <pdomOutput xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
        </pdomOutput></GetDocumentResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_GETELEMENT_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:persist' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
    <GetElementResponse xmlns='urn:xtk:persist' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
        <pdomOutput xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
        </pdomOutput></GetElementResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);


const GET_SETDOCUMENT_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:persist' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
    <SetDocumentResponse xmlns='urn:xtk:persist' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
        <pdomOutput xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
        </pdomOutput></SetDocumentResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

const GET_SETELEMENT_RESPONSE = Promise.resolve(`<?xml version='1.0'?>
    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:persist' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
    <SOAP-ENV:Body>
    <SetElementResponse xmlns='urn:xtk:persist' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
        <pdomOutput xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
        </pdomOutput></SetElementResponse>
    </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`);

describe('ACC Client', function() {

    describe('Init', function() {

        it('Should create client', function() {
            const client = makeClient();
            const NLWS = client.NLWS;
            expect(NLWS).toBeTruthy();
            expect(client.isLogged()).toBe(false);
        });

        it('Should logon and logoff', async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logon();
            expect(client.isLogged()).toBe(true);
            expect(DomUtil.findElement(client.sessionInfo, "serverInfo", true).getAttribute("buildNumber")).toBe("9219");
            await client.NLWS.xtkSession.logoff();
            expect(client.isLogged()).toBe(false);
        });

        it('Should logon and logoff with traces', async () => {
            const client = makeClient();
            client.traceSOAPCalls = true;
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logon();
            expect(client.isLogged()).toBe(true);
            expect(DomUtil.findElement(client.sessionInfo, "serverInfo", true).getAttribute("buildNumber")).toBe("9219");
            await client.NLWS.xtkSession.logoff();
            expect(client.isLogged()).toBe(false);
        });

        it('Should logon and logoff with traces (as if in browser)', async () => {
            const client = makeClient();
            client.traceSOAPCalls = true;
            client.browser = true;
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logon();
            expect(client.isLogged()).toBe(true);
            expect(DomUtil.findElement(client.sessionInfo, "serverInfo", true).getAttribute("buildNumber")).toBe("9219");
            await client.NLWS.xtkSession.logoff();
            expect(client.isLogged()).toBe(false);
        });

        it('Should logon and logoff (remember me)', async () => {
            const client = makeClient(true);

            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            expect(client.isLogged()).toBe(true);
            expect(DomUtil.findElement(client.sessionInfo, "serverInfo", true).getAttribute("buildNumber")).toBe("9219");

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
            expect(client.isLogged()).toBe(false);
        });

        it("Should support multiple logoff", async () => {
            const client = makeClient(true);
            await client.NLWS.xtkSession.logoff();
            expect(client.isLogged()).toBe(false);
            await client.NLWS.xtkSession.logoff();
            expect(client.isLogged()).toBe(false)
        });

        it('Should fail to call if unlogged', async () => {
            const client = makeClient();
            await client.getSchema("nms:recipient").catch(e => {
                expect(e.name).toMatch('Error');
            });
        });

        it('Should fail if logon does not return a session token', async () => {
            const client = makeClient();
            expect(async () => {
                client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE_NO_SESSIONTOKEN);
                await client.NLWS.xtkSession.logon();
            }).rejects.toThrow();
            expect(client.isLogged()).toBe(false);
        });

        it('Should fail if logon does not return a security token', async () => {
            const client = makeClient();
            expect(async () => {
                client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE_NO_SECURITYTOKEN);
                await client.NLWS.xtkSession.logon();
            }).rejects.toThrow();
            expect(client.isLogged()).toBe(false);
        });


        it('Should logon with dummy cookie', async () => {
            document = {};
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            expect(client.isLogged()).toBe(true);
            expect(DomUtil.findElement(client.sessionInfo, "serverInfo", true).getAttribute("buildNumber")).toBe("9219");
            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
            expect(client.isLogged()).toBe(false);
            document = undefined;
        });
    });

    describe('API calls', () => {
        it('Should getEntityIfMoreRecent', async() => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);
            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logon();
            const schema = await client.getEntityIfMoreRecent("xtk:schema", "xtk:session");
            var element = DomUtil.getFirstChildElement(schema);
            expect(element.nodeName).toBe("interface");
            expect(element.getAttribute("name")).toBe("persist");
            element = DomUtil.getNextSiblingElement(element);
            expect(element.nodeName).toBe("element");
            expect(element.getAttribute("name")).toBe("sessionInfo");
            element = DomUtil.getNextSiblingElement(element);
            expect(element.nodeName).toBe("element");
            expect(element.getAttribute("name")).toBe("userInfo");
            element = DomUtil.getNextSiblingElement(element);
            expect(element.nodeName).toBe("element");
            expect(element.getAttribute("name")).toBe("session");
            await client.NLWS.xtkSession.logoff();
        });

        it('Should getOption', async() => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);
            await client.NLWS.xtkSession.logon();

            // Method 1: convenience function
            client.soapTransport.mockReturnValueOnce(GET_DATABASEID_RESPONSE);
            
            var databaseId = await client.getOption("XtkDatabaseId");
            expect(databaseId).toBe("uFE80000000000000F1FA913DD7CC7C480041161C");
            // Method 2 : SOAP call - will not use cache to get, but will cache result
            client.soapTransport.mockReturnValueOnce(GET_DATABASEID_RESPONSE);
            var option = await client.NLWS.xtkSession.getOption("XtkDatabaseId");
            expect(option[0]).toBe("uFE80000000000000F1FA913DD7CC7C480041161C");
            expect(option[1]).toBe(6);
            // Call again => should not perform any SOAP calls as its using the
            // cache for both the schema and the option
            var databaseId = await client.getOption("XtkDatabaseId");
            expect(databaseId).toBe("uFE80000000000000F1FA913DD7CC7C480041161C");
            // Force not using cache
            client.soapTransport.mockReturnValueOnce(GET_DATABASEID_RESPONSE);
            var databaseId = await client.getOption("XtkDatabaseId", false);
            expect(databaseId).toBe("uFE80000000000000F1FA913DD7CC7C480041161C");
            // Clear cache
            client.clearOptionCache();
            client.soapTransport.mockReturnValueOnce(GET_DATABASEID_RESPONSE);
            var databaseId = await client.getOption("XtkDatabaseId");
            expect(databaseId).toBe("uFE80000000000000F1FA913DD7CC7C480041161C");

            // Without parameters
            await client.NLWS.xtkSession.getOption().catch(e => {
                expect(e.name).toMatch('Error');
            });

            // representations
            client.representation = "json"
            client.soapTransport.mockReturnValueOnce(GET_DATABASEID_RESPONSE);
            option = await client.NLWS.xtkSession.getOption("XtkDatabaseId");
            expect(option[0]).toBe("uFE80000000000000F1FA913DD7CC7C480041161C");
            expect(option[1]).toBe(6);

            client.representation = "xml"
            client.soapTransport.mockReturnValueOnce(GET_DATABASEID_RESPONSE);
            option = await client.NLWS.xtkSession.getOption("XtkDatabaseId");
            expect(option[0]).toBe("uFE80000000000000F1FA913DD7CC7C480041161C");
            expect(option[1]).toBe(6);

            client.representation = "invalid"
            option = await client.NLWS.xtkSession.getOption("XtkDatabaseId").catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should return missing options", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            // Get missing option
            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_OPTION_NOTFOUND_RESPONSE);
            var value = await client.getOption("ZZ");
            expect(value).toBeNull();

            // Check missing option is cached too
            var value = await client.getOption("ZZ");
            expect(value).toBeNull();

            // Defense case where resulting parameters are missing. This is a forged answer, should not happen
            // in reality
            client.soapTransport.mockReturnValueOnce(GET_OPTION_MISSING_DATA_RESPONSE);
            await client.getOption("YY").catch(e => {
                expect(e.name).toMatch('Error');
            });
        });

        it("Should return schema definition", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_NMS_EXTACCOUNT_SCHEMA_RESPONSE);
            var schema = await client.getSchema("nms:extAccount");
            expect(schema["@namespace"]).toBe("nms");
            expect(schema["@name"]).toBe("extAccount");

            // Ask again, should use cache
            var schema = await client.getSchema("nms:extAccount");
            expect(schema["@namespace"]).toBe("nms");
            expect(schema["@name"]).toBe("extAccount");

            // Clear cache and ask again
            client.clearEntityCache();
            client.soapTransport.mockReturnValueOnce(GET_NMS_EXTACCOUNT_SCHEMA_RESPONSE);
            var schema = await client.getSchema("nms:extAccount");
            expect(schema["@namespace"]).toBe("nms");
            expect(schema["@name"]).toBe("extAccount");

            // Ask as XML
            var schema = await client.getSchema("nms:extAccount", "xml");
            expect(schema.getAttribute("namespace")).toBe("nms");
            expect(schema.getAttribute("name")).toBe("extAccount");

            // Ask as JSON
            var schema = await client.getSchema("nms:extAccount", "json");
            expect(schema["@namespace"]).toBe("nms");
            expect(schema["@name"]).toBe("extAccount");

            // Ask with invalid representation
            await client.getSchema("nms:extAccount", "invalid").catch(e => {
                expect(e.name).toMatch('Error');
            });

            // Get missing schema
            client.clearAllCaches();
            client.soapTransport.mockReturnValueOnce(GET_MISSING_SCHEMA_RESPONSE);
            var schema = await client.getSchema("nms:dummy", "json");
            expect(schema).toBeNull();
            client.clearAllCaches();
            client.soapTransport.mockReturnValueOnce(GET_MISSING_SCHEMA_RESPONSE);
            var schema = await client.getSchema("nms:dummy", "xml");
            expect(schema).toBeNull();

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should return sys enum definition", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_NMS_EXTACCOUNT_SCHEMA_RESPONSE);
            var sysEnum = await client.getSysEnum("nms:extAccount:encryptionType");
            expect(sysEnum["@basetype"]).toBe("byte");
            expect(sysEnum["@name"]).toBe("encryptionType");
            expect(sysEnum.value[0]["@name"]).toBe("none");
            expect(sysEnum.value[1]["@name"]).toBe("ssl");

            // Find sysEnum by relative name
            var sysEnum = await client.getSysEnum("encryptionType", "nms:extAccount");
            expect(sysEnum["@basetype"]).toBe("byte");
            expect(sysEnum["@name"]).toBe("encryptionType");
            expect(sysEnum.value[0]["@name"]).toBe("none");
            expect(sysEnum.value[1]["@name"]).toBe("ssl");

            // Schema name should be valid, i.e. "nms:extAccount" and not "extAccount"
            await client.getSysEnum("encryptionType", "extAccount").catch(e => {
                expect(e.name).toMatch('Error');
            });
            // Schema name must be a string
            await client.getSysEnum("encryptionType", new Date()).catch(e => {
                expect(e.name).toMatch('Error');
            });
            // With one parameter, enum name must be fully qualified, i.e. "nms:extAccount:encryptionType"
            await client.getSysEnum("encryptionType").catch(e => {
                expect(e.name).toMatch('Error');
            });
            await client.getSysEnum("extAccount:encryptionType").catch(e => {
                expect(e.name).toMatch('Error');
            });

            // Enum does not exist
            var sysEnum = await client.getSysEnum("nms:extAccount:notFound");
            expect(sysEnum).toBeUndefined();

            // Get cached XML representation
            client.representation = "xml";
            var sysEnum = await client.getSysEnum("nms:extAccount:encryptionType");
            expect(sysEnum.getAttribute("basetype")).toBe("byte");

            // Invalid representation
            const startSchema = await client.getSchema("nms:extAccount");
            client.representation = "invalid";
            await client.getSysEnum("encryptionType", startSchema).catch(e => {
                expect(e.name).toMatch('Error');
            });
            client.representation = "xml";

            // Get non-cached XML representation 
            client.clearAllCaches();
            client.soapTransport.mockReturnValueOnce(GET_NMS_EXTACCOUNT_SCHEMA_RESPONSE);
            var sysEnum = await client.getSysEnum("nms:extAccount:encryptionType");
            expect(sysEnum.getAttribute("basetype")).toBe("byte");

            // Schema does not exist
            client.clearAllCaches();
            client.soapTransport.mockReturnValueOnce(GET_MISSING_SCHEMA_RESPONSE);
            await client.getSysEnum("nms:dummy:encryptionType").catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

    });


    describe("Get Mid Client", () => {

        it("Should get mid connection", async () => {
            const client = makeClient();

            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_XTK_QUERY_SCHEMA_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_MID_EXT_ACCOUNT_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_SECRET_KEY_OPTION_RESPONSE);
            var midClient = await client.getMidClient();
            midClient.soapTransport = jest.fn();
            
            midClient.soapTransport.mockReturnValueOnce(GET_LOGON_MID_RESPONSE);
            await midClient.NLWS.xtkSession.logon();

            midClient.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);
            midClient.soapTransport.mockReturnValueOnce(GET_TSTCNX_RESPONSE);
            await midClient.NLWS.xtkSession.testCnx();
            
            midClient.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await midClient.NLWS.xtkSession.logoff();
            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();

        });

        it("Should get cached cipher", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_SECRET_KEY_OPTION_RESPONSE);
            var cipher = await client.getSecretKeyCipher();
            expect(cipher).not.toBeNull();
            expect(cipher.key).not.toBeNull();
            expect(cipher.iv).not.toBeNull();

            // Ask again, should be cached (no mock methods)
            client.clearAllCaches();
            var cipher = await client.getSecretKeyCipher();
            expect(cipher).not.toBeNull();
            expect(cipher.key).not.toBeNull();
            expect(cipher.iv).not.toBeNull();

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });
    });


    describe("SOAP call with all parameters and return types", () => {

        it("Should call with all parameter types", async () => {
            const client = makeClient();

            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            
            client.soapTransport.mockReturnValueOnce(GET_XTK_ALL_SCHEMA_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_XTK_ALL_TYPES_RESPONSE);

            const element = { "@type": "element", "@xtkschema": "nms:recipient" };          // @xtkschema needed to determine root name
            const document = { "@type": "document", "@xtkschema": "nms:recipient" };

            const result = await client.NLWS.xtkAll.allTypes("Hello World", true, 1, 1000, 100000, "2020-12-31T12:34:56.789Z", "2020-12-31", element, document);
            // Note: should match responses in GET_XTK_ALL_TYPES_RESPONSE
            expect(result.length).toBe(9);
            expect(result[0]).toBe("Hello World");
            expect(result[1]).toBe(true);
            expect(result[2]).toBe(1);
            expect(result[3]).toBe(1000);
            expect(result[4]).toBe(100000);
            expect(result[5].toISOString()).toBe("2020-12-31T12:34:56.789Z");
            expect(result[6].toISOString()).toBe("2020-12-31T00:00:00.000Z");
            expect(result[7]["@type"]).toBe("element");
            expect(result[7]["@result"]).toBe("true");
            expect(result[8]["@type"]).toBe("document");
            expect(result[8]["@result"]).toBe("true");

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should check xtkschema attribute", async () => {
            const client = makeClient();

            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            
            client.soapTransport.mockReturnValueOnce(GET_XTK_ALL_SCHEMA_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_XTK_ALL_TYPES_RESPONSE);

            const element = { "@type": "element" };          // @xtkschema needed to determine root name, missing on purpose
            const document = { "@type": "document", "@xtkschema": "nms:recipient" };

            await client.NLWS.xtkAll.allTypes("Hello World", true, 1, 1000, 100000, "2020-12-31T12:34:56.789Z", "2020-12-31", element, document).catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });
        it("Should fail on unsupported type", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            
            client.soapTransport.mockReturnValueOnce(GET_XTK_ALL_SCHEMA_RESPONSE);

            // unsupported input parameter
            await client.NLWS.xtkAll.unsupportedInput().catch(e => {
                expect(e.name).toMatch('Error');
            });

            // unsupported output parameter
            client.soapTransport.mockReturnValueOnce(GET_XTK_TYPE_UNSUPPORTED_TYPE_RESPONSE);
            await client.NLWS.xtkAll.unsupported().catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should support local return type", async() => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            
            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_USER_INFO_RESPONSE);
            const userInfo = await client.NLWS.xtkSession.getUserInfo();
            expect(userInfo["@login"]).toBe("admin");

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should support XML representation", async() => {
            const client = makeClient();
            client.representation = "xml";
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            
            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_USER_INFO_RESPONSE);
            const userInfo = await client.NLWS.xtkSession.getUserInfo();
            expect(userInfo.getAttribute("login")).toBe("admin");

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should fail if schema does not exist", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            await client.NLWS.xtkNotFound.unsupported().catch(e => {
                expect(e.name).toMatch('Error');
            });

            // Call directly
            client.soapTransport.mockReturnValueOnce(GET_MISSING_SCHEMA_RESPONSE);
            await client.callMethod("xtk:notFound", "dummy", null).catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should fail if method does not exist", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);
            await client.NLWS.xtkSession.unsupported().catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should fail if calling non static function without object", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);
            await client.NLWS.xtkSession.nonStatic().catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should start workflow (hack)", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_XTK_WORKFLOW_SCHEMA_RESPONSE);
            client.soapTransport.mockImplementationOnce(options => {
                const doc = DomUtil.parse(options.body);
                const body = DomUtil.findElement(doc.documentElement, "SOAP-ENV:Body");
                const method = DomUtil.getFirstChildElement(body);
                const parameters = DomUtil.findElement(method, "parameters");
                const variables = DomUtil.getFirstChildElement(parameters, "variables");
                if (!variables)
                    throw new Error("Did not find 'variables' node");
                if (variables.getAttribute("hello") != "world")
                    throw new Error("Did not find 'hello' variable");
                
                return Promise.resolve(`<?xml version='1.0'?>
                    <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:workflow' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
                        <SOAP-ENV:Body>
                        <StartWithParametersResponse xmlns='urn:xtk:workflow' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
                        </StartWithParametersResponse>
                        </SOAP-ENV:Body>
                    </SOAP-ENV:Envelope>`);
            });
            await client.NLWS.xtkWorkflow.startWithParameters(4900, { "@hello": "world" });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should call non static method", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_XTK_QUERY_SCHEMA_RESPONSE);
            client.soapTransport.mockReturnValueOnce(GET_QUERY_EXECUTE_RESPONSE);
            var queryDef = {
                "@schema": "nms:extAccount",
                "@operation": "select",
                "select": {
                    "node": [
                        { "@expr": "@id" },
                        { "@expr": "@name" }
                    ]
                }
            };
            var query = client.NLWS.xtkQueryDef.create(queryDef);
            var extAccounts = await query.executeQuery();

            var queryDef = DomUtil.parse(`<queryDef schema="nms:extAccount" operation="select">
                    <select>
                        <node expr="@id"/>
                        <node expr="@name"/>
                    </select>
                </queryDef>`);
            client.representation = "xml";
            client.soapTransport.mockReturnValueOnce(GET_QUERY_EXECUTE_RESPONSE);
            var query = client.NLWS.xtkQueryDef.create(queryDef);
            var extAccounts = await query.executeQuery();

            client.representation = "invalid";
            client.NLWS.xtkQueryDef.create(queryDef)
            await query.executeQuery().catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();

        });

        it("Should fail to return DOMDocument with unsupported representation", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);

            client.soapTransport.mockReturnValueOnce(GET_GETDOCUMENT_RESPONSE);
            client.representation = "xml";
            var result = await client.NLWS.xtkPersist.getDocument();

            client.soapTransport.mockReturnValueOnce(GET_GETDOCUMENT_RESPONSE);
            client.representation = "invalid";
            await client.NLWS.xtkPersist.getDocument().catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should fail to return DOMElement with unsupported representation", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);

            client.soapTransport.mockReturnValueOnce(GET_GETELEMENT_RESPONSE);
            client.representation = "xml";
            var result = await client.NLWS.xtkPersist.getElement();

            client.soapTransport.mockReturnValueOnce(GET_GETELEMENT_RESPONSE);
            client.representation = "invalid";
            await client.NLWS.xtkPersist.getElement().catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        it("Should fail to pass DOMDocument with unsupported representation", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);

            const document = DomUtil.parse("<root/>");
            client.soapTransport.mockReturnValueOnce(GET_SETDOCUMENT_RESPONSE);
            client.representation = "xml";
            var result = await client.NLWS.xtkPersist.setDocument(document);

            client.soapTransport.mockReturnValueOnce(GET_SETDOCUMENT_RESPONSE);
            client.representation = "invalid";
            await client.NLWS.xtkPersist.setDocument(document).catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });


        it("Should fail to pass DOMElement with unsupported representation", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();
            client.soapTransport.mockReturnValueOnce(GET_XTK_SESSION_SCHEMA_RESPONSE);

            const element = DomUtil.parse("<root/>").documentElement;
            client.soapTransport.mockReturnValueOnce(GET_SETELEMENT_RESPONSE);
            client.representation = "xml";
            var result = await client.NLWS.xtkPersist.setElement(element);

            client.soapTransport.mockReturnValueOnce(GET_SETELEMENT_RESPONSE);
            client.representation = "invalid";
            await client.NLWS.xtkPersist.setElement(element).catch(e => {
                expect(e.name).toMatch('Error');
            });

            client.soapTransport.mockReturnValueOnce(LOGOFF_RESPONSE);
            await client.NLWS.xtkSession.logoff();
        });

        
    });

    // Fails to use xtk:persist unless xtk:session loaded before

    describe("Issue #3", () => {

        it("getIfExists with empty result", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_XTK_QUERY_SCHEMA_RESPONSE);

            client.soapTransport.mockReturnValueOnce(Promise.resolve(`<?xml version='1.0'?>
            <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:queryDef' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
            <SOAP-ENV:Body>
            <ExecuteQueryResponse xmlns='urn:xtk:queryDef' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
                <pdomOutput xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
                <extAccount/>
                </pdomOutput></ExecuteQueryResponse>
            </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>`));

            var queryDef = {
                "@schema": "nms:extAccount",
                "@operation": "getIfExists",
                "select": {
                    "node": [
                        { "@expr": "@id" },
                        { "@expr": "@name" }
                    ]
                }
            };

            // GetIfExists should return null
            var query = client.NLWS.xtkQueryDef.create(queryDef);
            var extAccount = await query.executeQuery();
            expect(extAccount).toBeNull();
        });

        it("select with empty result", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_XTK_QUERY_SCHEMA_RESPONSE);

            client.soapTransport.mockReturnValueOnce(Promise.resolve(`<?xml version='1.0'?>
            <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:queryDef' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
            <SOAP-ENV:Body>
            <ExecuteQueryResponse xmlns='urn:xtk:queryDef' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
                <pdomOutput xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
                <extAccount-collection/>
                </pdomOutput></ExecuteQueryResponse>
            </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>`));

            var queryDef = {
                "@schema": "nms:extAccount",
                "@operation": "select",
                "select": {
                    "node": [
                        { "@expr": "@id" },
                        { "@expr": "@name" }
                    ]
                }
            };

            // Select should return empty array
            query = client.NLWS.xtkQueryDef.create(queryDef);
            extAccount = await query.executeQuery();
            expect(extAccount).toEqual({ extAccount: [] });
        });

        it("getIfExists with a result of exactly one element", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_XTK_QUERY_SCHEMA_RESPONSE);

            client.soapTransport.mockReturnValueOnce(Promise.resolve(`<?xml version='1.0'?>
            <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:queryDef' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
            <SOAP-ENV:Body>
            <ExecuteQueryResponse xmlns='urn:xtk:queryDef' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
                <pdomOutput xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
                <extAccount id="1"/>
                </pdomOutput></ExecuteQueryResponse>
            </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>`));

            var queryDef = {
                "@schema": "nms:extAccount",
                "@operation": "getIfExists",
                "select": {
                    "node": [
                        { "@expr": "@id" },
                        { "@expr": "@name" }
                    ]
                }
            };

            // GetIfExists should return element
            var query = client.NLWS.xtkQueryDef.create(queryDef);
            var extAccount = await query.executeQuery();
            expect(extAccount).toEqual({ "@id": "1" });
        });

        it("select with a result of exactly one element", async () => {
            const client = makeClient();
            client.soapTransport.mockReturnValueOnce(LOGON_RESPONSE);
            await client.NLWS.xtkSession.logon();

            client.soapTransport.mockReturnValueOnce(GET_XTK_QUERY_SCHEMA_RESPONSE);

            client.soapTransport.mockReturnValueOnce(Promise.resolve(`<?xml version='1.0'?>
            <SOAP-ENV:Envelope xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:ns='urn:xtk:queryDef' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>
            <SOAP-ENV:Body>
            <ExecuteQueryResponse xmlns='urn:xtk:queryDef' SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
                <pdomOutput xsi:type='ns:Element' SOAP-ENV:encodingStyle='http://xml.apache.org/xml-soap/literalxml'>
                <extAccount-collection><extAccount id="1"/></extAccount-collection>
                </pdomOutput></ExecuteQueryResponse>
            </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>`));

            var queryDef = {
                "@schema": "nms:extAccount",
                "@operation": "select",
                "select": {
                    "node": [
                        { "@expr": "@id" },
                        { "@expr": "@name" }
                    ]
                }
            };

            var query = client.NLWS.xtkQueryDef.create(queryDef);
            var extAccount = await query.executeQuery();
            expect(extAccount).toEqual({ extAccount: [ { "@id": "1" } ]});
        });
    })
});
