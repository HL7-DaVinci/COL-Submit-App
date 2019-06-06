var COL;
if (!COL) {
    COL = {};
}

(function () {

    COL.clientSettings = {
        "patient" : {
            "client_id": "5237c3ef-05f6-4db8-9d64-16d5b766b182", // "0e1169a7-67e1-40ea-88e6-ca89db6e9572", //
            "scope": "patient/*.* openid profile"
        },
        "groups" : {
            "client_id": "f8f37c52-5b31-471f-b913-c655905c9dce", //"8c0d19e8-df5c-44e8-826d-104005ffc092", //
            "scope": "user/*.* openid profile"
        }
    };

    COL.collectDataEndpoint = "/Measure/measure-col/$collect-data?";

    COL.scenarioDescription = {
        "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit,\n" +
            "            sed do eiusmod tempor incididunt ut labore et dolore magna\n" +
            "            aliqua. Ut enim ad minim veniam, quis nostrud exercitation\n" +
            "            ullamco laboris nisi ut aliquip ex ea commodo consequat.\n" +
            "            Duis aute irure dolor in reprehenderit in voluptate velit\n" +
            "            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint\n" +
            "            occaecat cupidatat non proident, sunt in culpa qui officia\n" +
            "            deserunt mollit anim id est laborum."
    };

    COL.reportPeriod = 12;

    COL.submitEndpoint = "/Measure/measure-col/$submit-data";

    COL.evaluateEndpoint = "/Measure/measure-col/$evaluate-measure?";

    COL.collectEndpoint = "/Measure/measure-col/$collect-data?";

    COL.evaluateEndpointPatient = "patient=";

    COL.providerEndpoint = {
        "name": "DaVinci COL Provider",
        "type": "open",
        "url": "https://api.logicahealth.org/DaVinciCOLProvider/open"
    }

    COL.payerEndpoints = [{
        "name": "DaVinci COL Payer (Secure)",
        "type": "secure-smart",
        "url": "https://api.logicahealth.org/DaVinciCOLPayer/data",
        "clientID": "1a1a7abc-f0ac-48fc-902f-5830a6f2f07b",
        "scope": "user/*.write openid profile"
    },{
        "name": "DaVinci COL Payer (Open)",
        "type": "open",
        "url": "https://api.logicahealth.org/DaVinciCOLPayer/open"
    }
    ];

    // default configuration
    COL.configSetting = 1; // DaVinci COL Payer  (Open)
    COL.payerEndpoint = COL.payerEndpoints[COL.configSetting];

    COL.operationPayload = {
        "resourceType": "Parameters",
        "id": "OPERATIONID",
        "parameter": [
            {
                "name": "measure-report",
                "resource": {
                    "resourceType": "MeasureReport",
                    "meta": {
                        "profile": ["http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/measurereport-deqm"]
                    },
                    "id": "MEASUREREPORTID",
                    "status": "complete",
                    "type": "individual",
                    "measure": {
                        "reference": "https://ncqa.org/fhir/ig/Measure/measure-mrp"
                    },
                    "patient": {
                        "reference": "Patient/PATIENTID"
                    },
                    "date": "TIMESTAMP",
                    "period": {
                        "start": "TIMESTAMP",
                        "end": "TIMESTAMP"
                    },
                    "reportingOrganization": {
                        "reference": "Organization/ORGANIZATIONID"
                    },
                    "evaluatedResources": {
                        "extension": [
                            {
                                "url": "http://hl7.org/fhir/us/davinci-deqm/StructureDefinition/extension-referenceAny",
                                "valueReference": {
                                    "reference": "Task/TASKID"
                                }
                            }
                        ]
                    }
                }
            }
        ]
    };
}());
