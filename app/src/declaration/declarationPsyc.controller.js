'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationPsycController', PsycController);

function PsycController($scope, $mdDialog, $stateParams, DeclarationService, Toast, ContentService, HeaderService, $state, DeclarationPsycService, $templateCache) {
  var vm = this;
  vm.psycPropertyValues = undefined;
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

  vm.oneormorePsykologiskUnder = false;

  vm.oneormoreRisikoVurdering = false;
  vm.oneormoreIndiMalering = false;
  vm.oneormoreEksTest = false;
  vm.oneormoreImpTest = false;
  vm.oneormoreKognitive = false;
  vm.oneormorePsykInter = false;

  vm.oneormoreForeMalering = false;
  vm.oneormoreKonklusion = false;


  // Mappings
  vm.titleMappings = {};

  $scope.myCountry = {
    selected:{}
  };


  function setupMappings() {
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_PSYCH_TYPE] = "Psykologisk undersøgelsestype";

    vm.titleMappings[vm.PROP_PSYC_LIBRARY_INTERVIEWRATING] = "Psykiatriske interviews og ratingscales";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_KOGNITIV] = "Kognitive og neuropsykologiske præstationstests";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_IMPLECITE] = "Implicitte (projektive) tests";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_EXPLICIT] = "Eksplicitte (spørgeskema) tests";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_MALERING] = "Instrumenter for indikation på malingering";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_RISIKO] = "Risikovurderingsinstrumenter";

    vm.titleMappings[vm.PROP_PSYC_LIBRARY_PSYCH_MALERING] = "Psykologisk vurdering af forekomst af malingering";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_KONKLUSION_TAGS] = "Standard formuleringer";

  }

  setupMappings();
  // caseValues();

  setupOverview();

  activate();


  // function caseValues() {
  //   console.log("loading values for caseid: " + $stateParams.caseid)
  //
  //   DeclarationPsycService.getInstruments("26").then(function (response) {
  //     console.log("response")
  //     console.log(response);
  //   });
  //
  //
  // }

  function save() {
    // console.log("myCountry.selected");
    // console.log($scope.myCountry.selected);

    let val = $scope.myCountry.selected;


    let selectedIds = "";

    for (const [key, value] of Object.entries(val)) {
      // response for getOverViewData

      if (value) {
        if (selectedIds == "") {
          selectedIds = key;
        }
        else {
          selectedIds = selectedIds + "," + key;
        }
      }
    }


    DeclarationPsycService.saveDetailViewData($stateParams.caseid, vm.selectedInstrument, selectedIds).then(function (response) {
      $scope.myCountry = {
        selected:{}
      };

      // needed or else the template shows a glimse of the old template before drawing the new
      $templateCache.removeAll();
      $mdDialog.cancel();

      activate();

    });
  }

  vm.save = save;

  vm.clicked = clicked;

  function clicked(i) {

    // console.log("i");
    // console.log(i);
    //
    // console.log("vm.selectedValues");
    // console.log(vm.selectedValues);

  }




  function activate() {
    DeclarationPsycService.getOverViewData($stateParams.caseid).then(function (response) {

      // console.log("opslag for overbliksbillede: ");
      // console.log(response);

      vm.oneormorePsykologiskUnder = response[vm.PROP_PSYC_LIBRARY_PSYCH_TYPE];

      vm.oneormoreRisikoVurdering = response[vm.PROP_PSYC_LIBRARY_RISIKO];
      vm.oneormoreIndiMalering = response[vm.PROP_PSYC_LIBRARY_MALERING];
      vm.oneormoreEksTest = response[vm.PROP_PSYC_LIBRARY_EXPLICIT];
      vm.oneormoreImpTest = response[vm.PROP_PSYC_LIBRARY_IMPLECITE];
      vm.oneormoreKognitive = response[vm.PROP_PSYC_LIBRARY_KOGNITIV];
      vm.oneormorePsykInter = response[vm.PROP_PSYC_LIBRARY_INTERVIEWRATING];

      vm.oneormoreForeMalering = response[vm.PROP_PSYC_LIBRARY_PSYCH_MALERING];
      vm.oneormoreKonklusion = response[vm.PROP_PSYC_LIBRARY_KONKLUSION_TAGS];

      // console.log("vm.oneormorePsykologiskUnder")
      // console.log(vm.oneormorePsykologiskUnder);

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


  // need to be rewritten - each category needs to be checked if at least one checkbox has been selected. Then it should be marked - perhaps
  // with a bold font.

  function setupOverview() {

   // lav kald til backend og hent true:false for om en kategori skal skrives med fed

    DeclarationPsycService.getOverViewData("26").then(function (response) {
      console.log("response")
      console.log(response);
    });






    // sæt boolean værdi for bold for alle 8 felter

  }

  function viewButton(instrument) {
      // console.log("hvad er items");


    $scope.myCountry = {
      selected:{}
    };

    vm.selectedInstrument = instrument;
    vm.selectedInstrumentName = vm.titleMappings[instrument];

    DeclarationPsycService.getDetailViewData($stateParams.caseid, instrument).then(function (response) {
      vm.items = response.data;

      if (vm.items != undefined) {
        for (let i=0; i<= vm.items.length-1;i++) {
          // console.log(vm.items[i]);
          $scope.myCountry.selected[vm.items[i].id] = vm.items[i].val
        }
      }
    });

      $mdDialog.show({
        templateUrl: 'app/src/declaration/view/psyc/sections/popup.html',
        scope: $scope, // use parent scope in template
        preserveScope: true, // do not forget this if use parent scope
        clickOutsideToClose: false
      });
  }

  vm.viewButton = viewButton;

  function cancelDialog() {
    $scope.myCountry = {
      selected:{}
    };

    // needed or else the template shows a glimse of the old template before drawing the new
    $templateCache.removeAll();
    $mdDialog.cancel();
  }
  vm.cancelDialog = cancelDialog;

}