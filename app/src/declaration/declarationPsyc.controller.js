'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationPsycController', PsycController);

function PsycController($scope, $mdDialog, $stateParams, DeclarationService, Toast, ContentService, HeaderService, $state, DeclarationPsycService) {
  var vm = this;

  console.log("yellow from psycController");


  const PROP_PSYC_LIBRARY_PSYCH_TYPE = "psykologisk_undersoegelsestype";

  const PROP_PSYC_LIBRARY_INTERVIEWRATING = "psykiatriske_interviews_og_ratingscales";
  const PROP_PSYC_LIBRARY_KOGNITIV = "kognitive_og_neuropsykologiske_praestationstests";
  const PROP_PSYC_LIBRARY_IMPLECITE = "implicitte_projektive_tests";
  const PROP_PSYC_LIBRARY_EXPLICIT = "eksplicitte_spoergeskema_tests";
  const PROP_PSYC_LIBRARY_MALERING = "instrumenter_for_indikation_på_malingering";
  const PROP_PSYC_LIBRARY_RISIKO = "risikovurderingsinstrumenter";

  const PROP_PSYC_LIBRARY_PSYCH_MALERING = "psykologisk_vurdering_af_forekomst_af_malingering";
  const PROP_PSYC_LIBRARY_KONKLUSION_TAGS = "konklusion_tags";


  vm.psycPropertyValues = undefined;

  DeclarationPsycService.test2().then(function (response) {
    vm.psycPropertyValues = response;
  });



  function getInstrumentByName(name) {

    console.log("function called")
    console.log("vm.psycPropertyValues")
    console.log(vm.psycPropertyValues.result)


    var found = false;

    var i = 0;

    while (!found && i<=vm.psycPropertyValues.result.length-1) {
      let instrumentName = vm.psycPropertyValues.result[i].instrumentname;

      console.log(name == instrumentName);

      if (name == instrumentName) {
        return vm.psycPropertyValues.result[i].values;
      }

      i++;
    }

  }

  vm.getInstrumentByName = getInstrumentByName;


  function setupPsykologiskUndersoegelsestype() {



  }

  function viewButton() {

    console.log(getInstrumentByName(PROP_PSYC_LIBRARY_PSYCH_TYPE));

      vm.items = getInstrumentByName(PROP_PSYC_LIBRARY_PSYCH_TYPE);

      console.log("hvad er items");
      console.log(vm.items);

      $mdDialog.show({
        templateUrl: 'app/src/declaration/view/psyc/sections/popup.html',
        scope: $scope, // use parent scope in template
        preserveScope: true, // do not forget this if use parent scope
        clickOutsideToClose: true
      });
  }

  vm.viewButton = viewButton;

}
