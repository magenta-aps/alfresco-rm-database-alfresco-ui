'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationPsycController', PsycController);

function PsycController($scope, $mdDialog, $stateParams, DeclarationService, Toast, ContentService, HeaderService, $state, DeclarationPsycService) {
  var vm = this;
  vm.psycPropertyValues = undefined;

  console.log("yellow from psycController");


  vm.selectedInstrument = "";
  vm.selectedInstrumentName = "";

  vm.PROP_PSYC_LIBRARY_PSYCH_TYPE = "psykologisk_undersoegelsestype";

  vm.PROP_PSYC_LIBRARY_INTERVIEWRATING = "psykiatriske_interviews_og_ratingscales";
  vm.PROP_PSYC_LIBRARY_KOGNITIV = "kognitive_og_neuropsykologiske_praestationstests";
  vm.PROP_PSYC_LIBRARY_IMPLECITE = "implicitte_projektive_tests";
  vm.PROP_PSYC_LIBRARY_EXPLICIT = "eksplicitte_spoergeskema_tests";
  vm.PROP_PSYC_LIBRARY_MALERING = "instrumenter_for_indikation_på_malingering";
  vm.PROP_PSYC_LIBRARY_RISIKO = "risikovurderingsinstrumenter";

  vm.PROP_PSYC_LIBRARY_PSYCH_MALERING = "psykologisk_vurdering_af_forekomst_af_malingering";
  vm.PROP_PSYC_LIBRARY_KONKLUSION_TAGS = "konklusion_tags";

  vm.PsycInstruments = "";
  vm.selectedValues = [];

  // Mappings
  vm.titleMappings = {};

  $scope.myCountry = {
    selected:{}
  };


  function setupMappings() {
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_PSYCH_TYPE] = "Psykologisk undersøgelsestype";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_INTERVIEWRATING] = "Psykiatriske interviews og ratingscales";
  }

  setupMappings();
  caseValues();

  setupOverview();


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

    let val = $scope.myCountry.selected;


    let selectedIds = undefined;

    for (const [key, value] of Object.entries(val)) {
      console.log(`${key}: ${value}`);

      if (value) {
        if (selectedIds == undefined) {
          selectedIds = key;
        }
        else {
          selectedIds = selectedIds + "," + key;
        }
      }
    }


    DeclarationPsycService.saveDetailViewData($stateParams.caseid, vm.selectedInstrument, selectedIds).then(function (response) {
      console.log("svar fra saveDetailsViewData");
      console.log(response);

      $mdDialog.cancel();

    });
  }

  vm.save = save;

  vm.clicked = clicked;

  function clicked(i) {

    console.log("i");
    console.log(i);

    console.log("vm.selectedValues");
    console.log(vm.selectedValues);

    DeclarationPsycService.getOverViewData($stateParams.caseid).then(function (response) {

    });




  }







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


  function setupOverview() {

    // need or nice? er der for mange valg til at man kan vise det på en overskuelig måde? måske, nøjes med popup

    DeclarationPsycService.getOverViewData($stateParams.caseid).then(function (response) {
      console.log("setupOverview");
      console.log("result")
      console.log(response)
      vm.PsycInstruments = response[vm.PROP_PSYC_LIBRARY_PSYCH_TYPE]["nameList"];

      console.log("hvad er vm.PsycInstruments");
      console.log(vm.PsycInstruments);

    });
  }

  function viewButton(instrument) {
      // console.log("hvad er items");


    $scope.myCountry = {
      selected:{}
    };

    console.log("er Mycountry nulstillet?")
    console.log($scope.myCountry.selected)

    vm.selectedInstrument = instrument;
    vm.selectedInstrumentName = vm.titleMappings[instrument];


    DeclarationPsycService.getDetailViewData($stateParams.caseid, instrument).then(function (response) {
      console.log("detailview for :" + instrument);
      console.log(response)
      vm.items = response.data;


      if (vm.items != undefined) {
        for (let i=0; i<= vm.items.length-1;i++) {
          console.log(vm.items[i]);
          $scope.myCountry.selected[vm.items[i].id] = vm.items[i].val
        }
      }
      // else {
      //   vm.items = getInstrumentByName(instrument);
      //
      //   // set all to false as default
      //   for (let i=0; i<= vm.items.length-1;i++) {
      //     console.log(vm.items[i]);
      //     $scope.myCountry.selected[vm.items[i].id] = vm.items[i].val
      //   }
      //
      // }




    });




      $mdDialog.show({
        templateUrl: 'app/src/declaration/view/psyc/sections/popup.html',
        scope: $scope, // use parent scope in template
        preserveScope: true, // do not forget this if use parent scope
        clickOutsideToClose: true
      });
  }

  vm.viewButton = viewButton;

}
