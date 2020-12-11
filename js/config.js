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

    COL.collectDataEndpoint = "/Measure/MEASUREID/$collect-data?";

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

    COL.submitEndpoint = "/Measure/MEASUREID/$submit-data";

    COL.evaluateEndpoint = "/Measure/MEASUREID/$evaluate-measure?";

    COL.collectEndpoint = "/Measure/MEASUREID/$collect-data?";

    COL.evaluateEndpointPatient = "patient=";

    COL.providerEndpoint = {
        "name": "DaVinci COL Provider",
        "type": "open",
        "url": "https://gic-sandbox.alphora.com/cqf-ruler-r4/fhir",
        "measureID": "measure-EXM130-7.3.000"
    }

    COL.payerEndpoints = [{
        "name": "Alphora Payer (Open)",
        "type": "open",
        "url": "https://gic-sandbox.alphora.com/cqf-ruler-r4/fhir",
        "measureID": "measure-EXM130-7.3.000"
    },{
        "name": "DaVinci COL Payer (Secure)",
        "type": "secure-smart",
        "url": "https://api.logicahealth.org/DaVinciCOLPayer/data",
        "measureID": "measure-col",
        "clientID": "75ae2967-e7d9-4bec-b0bc-5e7936f0ff57",
        "scope": "user/*.write"
    },{
        "name": "DaVinci COL Payer (Open)",
        "type": "open",
        "url": "https://api.logicahealth.org/DaVinciCOLPayer/open",
        "measureID": "measure-col"
    }
    ];

    // default configuration
    COL.configSetting = 0; // Alphora Payer (Open)
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
