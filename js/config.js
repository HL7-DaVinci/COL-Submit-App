var COL;
if (!COL) {
    COL = {};
}

(function () {

    COL.clientSettings = {
        "patient" : {
            "client_id": "5237c3ef-05f6-4db8-9d64-16d5b766b182",
            "scope": "patient/*.* openid profile"
        },
        "groups" : {
            "client_id": "f8f37c52-5b31-471f-b913-c655905c9dce",
            "scope": "user/*.* openid profile"
        }
    };

    COL.reportPeriod = 12;

    COL.submitEndpoint = "/Measure/measure-mrp/$submit-data";

    COL.evaluateEndpoint = "/Measure/measure-col/$evaluate-measure?";

    COL.evaluateEndpointPatient = "patient=";

    COL.providerEndpoint = {
        "name": "DaVinci COL Provider",
        "type": "open",
        "url": "https://api-v8-stu3.hspconsortium.org/DaVinciCOLProvider/open"
    }

    COL.payerEndpoints = [{
        "name": "DaVinci COR Payer (Secure)",
        "type": "secure-smart",
        "url": "https://api-v8-stu3.hspconsortium.org/DaVinciCOLPayer/data",
        "clientID": "4a71a430-0316-4e2a-8477-7671d7d3b862",
        "scope": "user/*.write" // offline_access
    },{
        "name": "DaVinci COR Payer (Open)",
        "type": "open",
        "url": "https://api-v8-stu3.hspconsortium.org/DaVinciCOLPayer/open"
    }
    ];

    // default configuration
    COL.configSetting = 1; // DaVinci COR Payer  (Open)
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
            },
            {
                "name": "resource",
                "resource": {
                    "resourceType": "Task",
                    "meta": {
                        "profile": ["http://hl7.org/fhir/us/hedis/StructureDefinition/hedis-task"]
                    },
                    "id": "TASKID",
                    "identifier" : [
                        {
                            "system" : "http://www.acme.org/tasks",
                            "value" : "12345"
                        }
                    ],
                    "status": "completed",
                    "intent": "plan",
                    "priority": "routine",
                    "code": {
                        "coding":[
                            {
                                "system": "http://www.ama-assn.org/go/cpt",
                                "code": "1111F",
                                "display": "Medication Reconciliation"
                            }
                        ]
                    },
                    "for": {
                        "reference": "Patient/PATIENTID"
                    },
                    "context": {
                        "reference": "Encounter/ENCOUNTERID"
                    },
                    "authoredOn": "TIMESTAMP",
                    "executionPeriod": {
                        "start": "TIMESTAMP",
                        "end": "TIMESTAMP"
                    },
                    "owner": {
                        "reference": "Practitioner/PRACTITIONERID"
                    }
                }
            },
            {
                "name": "resource",
                "resource": {
                    "resourceType": "Patient"
                }
            },
            {
                "name": "resource",
                "resource": {
                    "resourceType": "Location"
                }
            },
            {
                "name": "resource",
                "resource": {
                    "resourceType": "Practitioner"
                }
            },
            {
                "name": "resource",
                "resource": {
                    "resourceType": "Organization"
                }
            },
            {
                "name": "resource",
                "resource": {
                    "resourceType": "Encounter",
                    "id": "ENCOUNTERID",
                    "meta": {
                        "profile": ["http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"]
                    },
                    "status": "finished",
                    "class": {
                        "system": "http://hl7.org/fhir/v3/ActCode",
                        "code": "AMB",
                        "display": "ambulatory"
                    },
                    "type": [
                        {
                            "coding": [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": "390906007",
                                    "display": "Follow-up encounter (procedure)"
                                }
                            ]
                        }
                    ],
                    "period": {
                        "start": "TIMESTAMP",
                        "end": "TIMESTAMP"
                    },
                    "subject": {
                        "reference": "Patient/PATIENTID"
                    },
                    "location": [{
                        "location": {
                            "reference": "Location/LOCATIONID"
                        }
                    }],
                    "participant": [
                        {
                            "individual": {
                                "reference": "Practitioner/PRACTITIONERID"
                            }
                        }
                    ],
                    "serviceProvider": {
                        "reference": "Organization/ORGANIZATIONID"
                    }
                }
            },
            {
                "name": "resource",
                "resource": {
                    "resourceType": "Coverage"
                }
            }
        ]
    };

    COL.postDischargeReconciliationCoding = {
        "system": "http://snomed.info/sct",
        "code": "430193006",
        "display": "Generic Medication Reconciliation"
    };

}());
