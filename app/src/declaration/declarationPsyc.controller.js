'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationPsycController', PsycController);

function PsycController($scope, $mdDialog, $stateParams, DeclarationService, Toast, ContentService, HeaderService, $state, DeclarationPsycService) {
  var vm = this;
  vm.psycPropertyValues = undefined;

  console.log("yellow from psycController");


  vm.PROP_PSYC_LIBRARY_PSYCH_TYPE = "psykologisk_undersoegelsestype";

  vm.PROP_PSYC_LIBRARY_INTERVIEWRATING = "psykiatriske_interviews_og_ratingscales";
  vm.PROP_PSYC_LIBRARY_KOGNITIV = "kognitive_og_neuropsykologiske_praestationstests";
  vm.PROP_PSYC_LIBRARY_IMPLECITE = "implicitte_projektive_tests";
  vm.PROP_PSYC_LIBRARY_EXPLICIT = "eksplicitte_spoergeskema_tests";
  vm.PROP_PSYC_LIBRARY_MALERING = "instrumenter_for_indikation_på_malingering";
  vm.PROP_PSYC_LIBRARY_RISIKO = "risikovurderingsinstrumenter";

  vm.PROP_PSYC_LIBRARY_PSYCH_MALERING = "psykologisk_vurdering_af_forekomst_af_malingering";
  vm.PROP_PSYC_LIBRARY_KONKLUSION_TAGS = "konklusion_tags";


  vm.selectedValues = [];

  // Mappings
  vm.titleMappings = {};

  function setupMappings() {
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_PSYCH_TYPE] = "testtest";
  }

  setupMappings();

  caseValues();


  function caseValues() {
    console.log("loading values for caseid: " + $stateParams.caseid)

    DeclarationPsycService.getInstruments("26").then(function (response) {
      console.log("response")
      console.log(response);
    });


  }

  function save() {
    console.log("myCountry.selected");
    console.log($scope.myCountry.selected);

  }

  vm.save = save;

  vm.clicked = clicked;

  function clicked(i) {

    console.log("i");
    console.log(i);

    console.log("vm.selectedValues");
    console.log(vm.selectedValues);


  }

  $scope.myCountry = {
    selected:{}
  };





  // setup initial data
  DeclarationPsycService.test2().then(function (response) {
    vm.psycPropertyValues = response;
  });



  function getInstrumentByName(name) {
    var found = false;
    var i = 0;

    while (!found && i<=vm.psycPropertyValues.result.length-1) {
      let instrumentName = vm.psycPropertyValues.result[i].instrumentname;

      if (name == instrumentName) {
        return vm.psycPropertyValues.result[i].values;
      }
      i++;
    }
  }

  vm.getInstrumentByName = getInstrumentByName;


  function setupPsykologiskUndersoegelsestype() {
  }

  function viewButton(instruments) {
      vm.items = getInstrumentByName(instruments);
      vm.selectedInstrumentName = vm.titleMappings[instruments];


      console.log("vm.psycPropertyValues")
      console.log(vm.psycPropertyValues);

      // console.log("vm.titleMappings[instruments];");
      // console.log(vm.titleMappings[instruments]);
      // console.log("vm.selectedInstrumentName");
      // console.log(vm.selectedInstrumentName);

      $mdDialog.show({
        templateUrl: 'app/src/declaration/view/psyc/sections/popup.html',
        scope: $scope, // use parent scope in template
        preserveScope: true, // do not forget this if use parent scope
        clickOutsideToClose: true
      });
  }

  vm.viewButton = viewButton;

}
