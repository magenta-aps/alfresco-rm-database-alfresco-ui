'use strict';

angular
    .module('openDeskApp.declaration')
    .controller('DeclarationCreateController', DeclarationCreateController);

function DeclarationCreateController($q, $mdDialog, $state, $mdToast, $scope, declarationService) {

    var vm = this;

    $scope.editPatientData = true;

    $scope.case = {};

    // vm.openDeclarationCreateDialog = openDeclarationCreateDialog;

    $scope.$watch('case', function (newVal, oldVal) {
        declarationService.updateNewCase(newVal);
    }, true);

    // vm.test = function test()  {
    //     alert("test");
    // }


    // function openDeclarationCreateDialog(ev) {
    //     $mdDialog.show({
    //         controller: DeclarationCreateController,
    //         templateUrl: 'app/src/declaration/view/create.html',
    //         locals: {
    //             var1: "type"
    //         },
    //         parent: angular.element(document.body),
    //         targetEvent: ev,
    //         clickOutsideToClose: true,
    //         preserveScope: true,
    //         scope: $scope
    //     });
    // }

    // function DeclarationCreateDiaglogController(sitetype, $scope, notificationsService, authService) {

    //     var currentUser = authService.getUserInfo().user;
    //     var availOwners = [];
    // }


    // $scope.submit = function (cpr, firstName, lastName, address, postbox, city, ethnicity, motherEthnicity, fatherEthnicity, referingAgency, mainCharge, placement, sanctionProposal, verdictDate, petitionDate, creationDate, observationDate, declarationDate, endedWithoutDeclaration, declaration, sentTo, forensicDoctorCouncil, forensicDoctorCouncilText, finalVerdict, verdict, remarks, consent, doctor1, doctor2, psychologist, socialWorker, secretary, mainDiagnosis, biDiagnoses) {

    //     var properties = {};

    //     if (cpr != undefined) {
    //         properties.cpr = cpr;
    //     }

    //     if (firstName != undefined) {
    //         properties.firstName = firstName;
    //     }

    //     if (lastName != undefined) {
    //         properties.lastName = lastName;
    //     }

    //     if (address != undefined) {
    //         properties.address = address;
    //     }

    //     if (postbox != undefined) {
    //         properties.postbox = postbox;
    //     }

    //     if (city != undefined) {
    //         properties.city = city;
    //     }

    //     if (ethnicity != undefined) {
    //         properties.ethnicity = ethnicity;
    //     }

    //     if (motherEthnicity != undefined) {
    //         properties.motherEthnicity = motherEthnicity;
    //     }

    //     if (fatherEthnicity != undefined) {
    //         properties.fatherEthnicity = fatherEthnicity;
    //     }

    //     if (referingAgency != undefined) {
    //         properties.referingAgency = referingAgency;
    //     }

    //     if (mainCharge != undefined) {
    //         properties.mainCharge = mainCharge;
    //     }

    //     if (placement != undefined) {
    //         properties.placement = placement;
    //     }

    //     if (sanctionProposal != undefined) {
    //         properties.sanctionProposal = sanctionProposal;
    //     }



    //     // history

    //     if (verdictDate != undefined) {
    //         properties.verdictDate = verdictDate;
    //     }

    //     if (petitionDate != undefined) {
    //         properties.petitionDate = petitionDate;
    //     }

    //     if (observationDate != undefined) {
    //         properties.observationDate = observationDate;
    //     }

    //     if (declarationDate != undefined) {
    //         properties.declarationDate = declarationDate;
    //     }

    //     if (endedWithoutDeclaration != undefined) {
    //         properties.endedWithoutDeclaration = endedWithoutDeclaration;
    //     }

    //     if (declaration != undefined) {
    //         properties.declaration = declaration;
    //     }

    //     if (sentTo != undefined) {
    //         properties.sentTo = sentTo;
    //     }

    //     if (forensicDoctorCouncil != undefined) {
    //         properties.forensicDoctorCouncil = forensicDoctorCouncil;
    //     }

    //     if (forensicDoctorCouncilText != undefined) {
    //         properties.forensicDoctorCouncilText = forensicDoctorCouncilText;
    //     }

    //     if (verdict != undefined) {
    //         properties.verdict = verdict;
    //     }

    //     if (remarks != undefined) {
    //         properties.remarks = remarks;
    //     }

    //     if (consent != undefined) {
    //         properties.consent = consent;
    //     }

    //     // erklaring

    //     if (doctor1 != undefined) {
    //         properties.doctor1 = doctor1;
    //     }

    //     if (doctor2 != undefined) {
    //         properties.doctor2 = doctor2;
    //     }

    //     if (psychologist != undefined) {
    //         properties.psychologist = psychologist;
    //     }

    //     if (socialWorker != undefined) {
    //         properties.socialWorker = socialWorker;
    //     }

    //     if (secretary != undefined) {
    //         properties.secretary = secretary;
    //     }


    //     // diagnose

    //     if (mainDiagnosis != undefined) {
    //         properties.mainDiagnosis = mainDiagnosis;
    //     }

    //     if (biDiagnoses != undefined) {
    //         properties.biDiagnoses = biDiagnoses;
    //     }


    //     declarationService.createCase(properties).then(function (response) {
    //         console.log(response);
    //     })


    //     $mdDialog.hide();
    // };

}