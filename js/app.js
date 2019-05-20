var COL;
if (!COL) {
    COL = {};
}

(function () {

    COL.client = null;
    COL.patient = null;
    COL.references = [];
    COL.patients = null;

    COL.getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    COL.getGUID = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    COL.now = () => {
        let date = new Date();
        return date.toISOString();
    };

    COL.period = () => {
        let date = new Date();
        let year = date.getYear() + 1900;
        let month = date.getMonth() + 1;

        let quotient = Math.floor(COL.reportPeriod / 12);
        let remainder = COL.reportPeriod % 12;
        let startPeriod = "periodStart=" + (year - quotient) + "-" + (month - remainder);
        let endPeriod = "&periodEnd=" + year + "-" + month;
        return startPeriod + endPeriod;
    }

    COL.displayPatient = (pt) => {
        $('#review-name').html(COL.getPatientName(pt));
    };

    COL.displayScreen = (screenID) => {
        $('#review-screen').hide();
        $('#confirm-screen').hide();
        $('#config-screen').hide();
        $('#choose-patients-screen').hide();
        $('#patients-from-measure-report').hide();
        $('#'+screenID).show();
    };

    COL.displayChoosePatientsScreen = () => {
        COL.displayScreen('choose-patients-screen');
        $('#btn-continue').hide();
    }

    COL.displayConfirmScreen = () => {
        COL.displayScreen('confirm-screen');
    };

    COL.displayConfigScreen = () => {
        if (COL.configSetting === "custom") {
            $('#config-select').val("custom");
        } else {
            $('#config-select').val(COL.configSetting);
        }
        $('#config-text').val(JSON.stringify(COL.payerEndpoint, null, 2));
        COL.displayScreen('config-screen');
    };

    COL.displayReviewScreen = () => {
        // $("#final-list").empty();
        COL.displayScreen('review-screen');
        $('#btn-configuration').hide();
        $("#btn-submit").hide();
        if (COL.scope === 'user') {
            let checkboxes = $('#review-list input[type=checkbox]');
            let checkedPatients = [];
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {
                    checkedPatients.push(checkboxes[i].id);
                }
            }
            COL.measureReports = [];
            COL.entries.forEach((patient) => {
                if(checkedPatients.includes(patient.resource.id)) {
                    COL.displayPatientInfo(patient.resource);
                    let promise;
                    let config = {
                        type: 'GET',
                        url: COL.providerEndpoint.url + COL.collectEndpoint + COL.period() + "&patient=Patient/" + patient.resource.id
                    };

                    // COL.client.patient.read().then((pt) => {
                    //     COL.patient = pt;
                    // });
                    promise = $.ajax(config);

                    promise.then((measureReport) => {
                        COL.measureReports.push(measureReport);
                    });
                }
            });
        }
        // else if(COL.scope === 'patient'){
        //     let promise;
        //     let config = {
        //         type: 'GET',
        //         url: COL.providerEndpoint.url + COL.collectEndpoint + COL.period() + "&patient=Patient/" + patient.resource.id
        //     };
        //
        //     // COL.client.patient.read().then((pt) => {
        //     //     COL.patient = pt;
        //     // });
        //     promise = $.ajax(config);
        //
        //     promise.then((measureReport) => {
        //         COL.measureReports.push(measureReport);
        //     });
        // }

    }

    COL.displayErrorScreen = (title, message) => {
        $('#error-title').html(title);
        $('#error-message').html(message);
        COL.displayScreen('error-screen');
    }

    COL.displayPatientInfo = (patient) => {
        let pid = patient.id;
        let tableContent = "<tr> <table><body><tr><td colspan='2' class='medtd'><h3>" + COL.getPatientName(patient) + "</h3></td></tr>";
        Promise.all([
            COL.client.api.fetchAll({type: "Procedure", query: {patient: pid}}),
            COL.client.api.fetchAll({type: "DiagnosticReport", query: { patient: pid}}),

            COL.client.api.fetchAll({ type: "Immunization", query: {patient: pid}}),
            COL.client.api.fetchAll({ type: "CarePlan", query: {patient: pid}}),
            COL.client.api.fetchAll({ type: "MedicationRequest", query: {patient: pid}}),
            COL.client.api.fetchAll({ type: "Condition", query: {patient: pid}}) //,
            //     COL.client.api.fetchAll({ type: "Encounter", query: {patient: pid}}),
            // COL.client.api.fetchAll({type: "Observation", query: {patient: pid}})
        ]).then((res) => {
            let procedures = res[0],
                diagnosticReports = res[1],

                immunizations = res[2],
                carePlans  = res[3],
                medRequests = res[4],
                conditions = res[5];
            //  encounters = res[6],
                // observations = res[7];

            if (procedures.length) {
                tableContent += "<tr> <td class='medtd'> Procedure </td><td>" + procedures.length + "</td></tr>";
                tableContent += "<tr><td colspan='2'><table><tbody>";
                procedures.forEach((procedure) => {
                    tableContent += "<tr><td class='medtd'>" + procedure.id + "</td><td class='medtd'>" +
                        JSON.stringify(procedure) + "</td></tr>";
                });
                tableContent += "</tbody></table></td></tr>";
            }else{tableContent += "<tr> <td class='medtd'> Procedure </td><td> 0 </td></tr>"}

            if (diagnosticReports.length) {
                tableContent += "<tr> <td class='medtd'> Diagnostic Report </td><td>" + diagnosticReports.length + "</td></tr>";
                tableContent += "<tr><td colspan='2'><table><tbody>";
                diagnosticReports.forEach((diagnosticReport) => {
                    tableContent += "<tr><td class='medtd'>" + diagnosticReport.id +
                        "</td><td class='medtd'>" + JSON.stringify(diagnosticReport) + "</td></tr>";
                });
                tableContent += "</tbody></table></td></tr>";
             }else{tableContent += "<tr> <td class='medtd'> Diagnostic Report </td><td> 0 </td></tr>";}

            // if (encounters.length) {
            //     tableContent += "<tr> <td class='medtd'> Encounter </td><td>" + encounters.length + "</td></tr>";
            //     tableContent += "<tr><td colspan='2'><table><tbody>";
            //     encounters.forEach((encounter) => {
            //         tableContent += "<tr><td class='medtd'>" + encounter.id +
            //             "</td><td class='medtd'>" + JSON.stringify(encounter) + "</td></tr>";
            //     });
            //     tableContent += "</tbody></table></td></tr>";
            // }else{tableContent += "<tr> <td class='medtd'> Encounter </td><td> 0 </td></tr>";}

            if (immunizations.length) {
                tableContent += "<tr> <td class='medtd'> Immunization </td><td>" + immunizations.length + "</td></tr>";
                tableContent += "<tr><td colspan='2'><table><tbody>";
                immunizations.forEach((immunization) => {
                    tableContent += "<tr><td class='medtd'>" + immunization.id +
                        "</td><td class='medtd'>" + JSON.stringify(immunization) + "</td></tr>";
                });
                tableContent += "</tbody></table></td></tr>";
            }else{tableContent += "<tr> <td class='medtd'> Immunization </td><td> 0 </td></tr>";}

            if (carePlans.length) {
                tableContent += "<tr> <td class='medtd'> Care Plan </td><td>" + carePlans.length + "</td></tr>";
                tableContent += "<tr><td colspan='2'><table><tbody>";
                carePlans.forEach((carePlan) => {
                    tableContent += "<tr><td class='medtd'>" + carePlan.id +
                        "</td><td class='medtd'>" + JSON.stringify(carePlan) + "</td></tr>";
                });
                tableContent += "</tbody></table></td></tr>";
            }else{tableContent += "<tr> <td class='medtd'> Care Plan </td><td> 0 </td></tr>";}

            if (medRequests.length) {
                tableContent += "<tr> <td class='medtd'> Medication Request </td><td>" + medRequests.length + "</td></tr>";
                tableContent += "<tr><td colspan='2'><table><tbody>";
                medRequests.forEach((medRequest) => {
                    tableContent += "<tr><td class='medtd'>" + medRequest.id +
                        "</td><td class='medtd'>" + JSON.stringify(medRequest) + "</td></tr>";
                });
                tableContent += "</tbody></table></td></tr>";
            }else{tableContent += "<tr> <td class='medtd'> Medication Request </td><td> 0 </td></tr>";}

            if (conditions.length) {
                tableContent += "<tr> <td class='medtd'> Condition </td><td>" + conditions.length + "</td></tr>";
                tableContent += "<tr><td colspan='2'><table><tbody>";
                conditions.forEach((condition) => {
                    tableContent += "<tr><td class='medtd'>" + condition.id +
                        "</td><td class='medtd'>" + JSON.stringify(condition) + "</td></tr>";
                });
                tableContent += "</tbody></table></td></tr>";
            }else{tableContent += "<tr> <td class='medtd'> Condition </td><td> 0 </td></tr>";}

            // if (observations.length) {
            //     tableContent += "<tr> <td class='medtd'> Observation </td><td>" + observations.length + "</td></tr>";
            //     tableContent += "<tr><td colspan='2'><table><tbody>";
            //     observations.forEach((observation) => {
            //         tableContent += "<tr><td class='medtd'>" + observation.id +
            //             "</td><td class='medtd'>" + JSON.stringify(observation) + "</td></tr>";
            //     });
            //     tableContent += "</tbody></table></td></tr>";
            // }else{tableContent += "<tr> <td class='medtd'> Observation </td><td> 0 </td></tr>";}

            tableContent += "</body></table></tr>";

            $('#spinner-image-review').hide();

            $('#final-list').append(tableContent);
            $('#btn-configuration').show();
            $("#btn-submit").show();
        })
    }

    COL.displayListOfPatients = () => {
        $('#patients-from-measure-report').show();

        for(let i = 0; i < COL.entries.length; i++){
            $('#review-list').append(
                "<tr> <td class='medtd'>" + COL.getPatientName(COL.entries[i].resource) +
                "</td><td><input type='checkbox' id=" + COL.entries[i].resource.id + " ></td></tr>");
        }
    }

    COL.disable = (id) => {
        $("#"+id).prop("disabled",true);
    };

    COL.getPatientName = (pt) => {
        if (pt.name) {
            let names = pt.name.map((n) => n.given.join(" ") + " " + n.family);
            return names.join(" / ");
        } else {
            return "anonymous";
        }
    };

    COL.evaluateMeasurePatientContext = () => {
        let promise;
        let config = {
            type: 'GET',
            url: COL.providerEndpoint.url + COL.evaluateEndpoint + COL.evaluateEndpointPatient + COL.client.patient.id + "&" + COL.period()
        };

        COL.client.patient.read().then((pt) => {
            COL.patient = pt;

            promise = $.ajax(config);

            promise.then((measureData) => {
                if(measureData.contained[0].id){
                    console.log(measureData.contained[0].id);
                    COL.client.api.fetchAllWithReferences(
                        {type: "Bundle",
                         query: {
                                "_id": measureData.contained[0].id
                            }
                        }
                    ).then(function (results) {
                        console.log(results);
                    });
                }
                if(!measureData.entry){
                    COL.evalMeasureResult = measureData;
                    COL.displayPatientInfo(pt);
                }else{
                    COL.displayErrorScreen("No data for patient", "No colorectal screening data found for this patient");
                }
            }, () => COL.displayErrorScreen("Evaluate measure failed", "Please check the evaluate endpoint configuration"));
        });
    }

    COL.evaluateMeasureAllPatients = () => {
        let promise;
        let config = {
            type: 'GET',
            url: COL.providerEndpoint.url + COL.evaluateEndpoint + COL.period()
        };

        promise = $.ajax(config);

        promise.then((measureData) => {
            $('#spinner-image').hide();
            $('#btn-continue').show();
            COL.measure = measureData;
            if(measureData.contained[0].entry != ""){
                COL.entries = measureData.contained[0].entry;
                COL.displayListOfPatients();
            }else{
                COL.displayErrorScreen("No patients in risk", "No colorectal screening data are found in this period");
            }
        }, () => COL.displayErrorScreen("Evaluate measure failed", "Please check the evaluate endpoint configuration"));

    }

    COL.loadData = (client) => {
        try {
            COL.client = client;
            if (COL.client.state.client.scope === 'patient/*.* openid profile launch'){

                $('#icon-patient').append("<img src='images/Paper-plane-icon-patient.png' style='height:100px; width:150px'>");
                COL.displayReviewScreen();
                COL.scope = 'patient';
                $('#btn-configuration').hide();
                COL.evaluateMeasurePatientContext();
            }else if(COL.client.state.client.scope === 'user/*.* openid profile launch'){
                $('#icon-group').append("<img src='images/Paper-plane-icon-group.png' style='height:100px; width:150px'>");
                COL.displayChoosePatientsScreen();
                COL.scope = 'user';
                COL.evaluateMeasureAllPatients();
            }

        } catch (err) {
            COL.displayErrorScreen("Failed to initialize scenario", "Please make sure to launch the app with one of the following sample patients: " + Object.keys(COL.scenarios).join(", "));
        }
    };

    COL.reconcile = async () => {
        $('#discharge-selection').hide();
        COL.disable('btn-submit');
        COL.disable('btn-edit');
        $('#btn-submit').html("<i class='fa fa-circle-o-notch fa-spin'></i> Submit measure report");

        if (COL.scope === 'user') {
            let checkboxes = $('#review-list input[type=checkbox]');
            let checkedPatients = [];
            for (let i = 0; i < checkboxes.length; i++) {
                if(checkboxes[i].checked == true){
                    checkedPatients.push(checkboxes[i].id);
                }
            }
            console.log(checkedPatients);
        } else {
            console.log("submit");
        }

        if (COL.payerEndpoint.type === "secure-smart") {
            sessionStorage.operationPayload = JSON.stringify(COL.operationPayload);
            if (localStorage.tokenResponse) {
                // load state from localStorage
                let state = JSON.parse(localStorage.tokenResponse).state;
                sessionStorage.tokenResponse = localStorage.tokenResponse;
                sessionStorage[state] = localStorage[state];
                FHIR.oauth2.ready(COL.initialize);
            } else {
                FHIR.oauth2.authorize({
                    "client": {
                        "client_id": COL.payerEndpoint.clientID,
                        "scope":  COL.payerEndpoint.scope
                    },
                    "server": COL.payerEndpoint.url
                });
            }
        } else {
            COL.finalize();
        }
    };

    COL.initialize = (client) => {
        if (COL.scope === 'patient'){
            $('#icon-patient').append("<img src='images/Paper-plane-icon-patient.png' style='height:100px; width:150px'>");
        }else if(COL.scope === 'user'){
            $('#icon-group').append("<img src='images/Paper-plane-icon-group.png' style='height:100px; width:150px'>");
        }
        COL.loadConfig();
        if (sessionStorage.operationPayload) {
            if (JSON.parse(sessionStorage.tokenResponse).refresh_token) {
                // save state in localStorage
                let state = JSON.parse(sessionStorage.tokenResponse).state;
                localStorage.tokenResponse = sessionStorage.tokenResponse;
                localStorage[state] = sessionStorage[state];
            }
            COL.operationPayload = JSON.parse(sessionStorage.operationPayload);
            COL.payerEndpoint.accessToken = JSON.parse(sessionStorage.tokenResponse).access_token;
            COL.finalize();
        } else {
            COL.loadData(client);
        }
    };

    COL.loadConfig = () => {
        let configText = window.localStorage.getItem("col-submit-app-config");
        if (configText) {
            let conf = JSON.parse (configText);
            if (conf['custom']) {
                COL.payerEndpoint = conf['custom'];
                COL.configSetting = "custom";
            } else {
                COL.payerEndpoint = COL.payerEndpoints[conf['selection']];
                COL.configSetting = conf['selection'];
            }
        }
    }

    COL.finalize = async () => {
        let promise;
        let configCollect = {
            type: 'GET',
            url: COL.providerEndpoint.url + COL.collectDataEndpoint + COL.period() + "&patient=Patient/" + COL.patient.id
        };

        if (COL.providerEndpoint.type !== "open") {
            configCollect['beforeSend'] = function (xhr) {
                xhr.setRequestHeader ("Authorization", "Bearer " + COL.providerEndpoint.accessToken);
            };
        }

        promise = $.ajax(configCollect);

        promise.then((measure) => {

            let config = {
                type: 'POST',
                url: COL.payerEndpoint.url + COL.submitEndpoint,
                data: JSON.stringify(measure),
                contentType: "application/fhir+json"
            };

            if (COL.payerEndpoint.type !== "open") {
                config['beforeSend'] = (xhr) => {
                    xhr.setRequestHeader("Authorization", "Bearer " + COL.payerEndpoint.accessToken);
                };
            }

            promise = $.ajax(config);
            console.log(JSON.stringify(measure, null, 2));
            promise.then(() => {
                COL.displayConfirmScreen();
            }, () => COL.displayErrorScreen("Measure report submission failed", "Please check the submit endpoint configuration <br/> You can close this window now."));

        });

            // try {
        //     await $.ajax(config);
        //     console.log (JSON.stringify(COL.evalMeasureResult, null, 2));
        //     COL.displayConfirmScreen();
        // } catch (err) {
        //     COL.displayErrorScreen("Measure report submission failed", "Please check the submit endpoint configuration <br/> You can close this window now.");
        // }
        // }, () => COL.displayErrorScreen("Collect data failed", "Please check the collect data endpoint configuration </br> You can close this window now."));

    }

    $('#btn-continue').click(COL.displayReviewScreen);
    $('#btn-submit').click(COL.reconcile);
    $('#btn-configuration').click(COL.displayConfigScreen);
    $('#btn-config').click(function () {
        let selection = $('#config-select').val();
        if (selection !== 'custom') {
            window.localStorage.setItem("col-submit-app-config", JSON.stringify({'selection': parseInt(selection)}));
        } else {
            let configtext = $('#config-text').val();
            let myconf;
            try {
                myconf = JSON.parse(configtext);
                window.localStorage.setItem("col-submit-app-config", JSON.stringify({'custom': myconf}));
            } catch (err) {
                alert ("Unable to parse configuration. Please try again.");
            }
        }
        COL.loadConfig();
        COL.displayReviewScreen();
        $('#btn-configuration').show();
        $("#btn-submit").show();
    });

    COL.payerEndpoints.forEach((e, id) => {
        $('#config-select').append("<option value='" + id + "'>" + e.name + "</option>");
    });
    $('#config-select').append("<option value='custom'>Custom</option>");
    $('#config-text').val(JSON.stringify(COL.payerEndpoints[0],null,"   "));

    $('#config-select').on('change', function() {
        if (this.value !== "custom") {
            $('#config-text').val(JSON.stringify(COL.payerEndpoints[parseInt(this.value)],null,2));
        }
    });

    $('#config-text').bind('input propertychange', () => {
        $('#config-select').val('custom');
    });

    FHIR.oauth2.ready(COL.initialize);

}());
