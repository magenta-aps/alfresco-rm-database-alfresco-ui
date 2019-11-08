'use strict';

angular
  .module('oda.flowchart')
  .controller('FlowChartController', FlowChartController);

function FlowChartController($scope, $stateParams, $translate, HeaderService, FlowChartService, propertyService, filterService, DeclarationService, Toast ) {
  var vm = this;

  $scope.flow = {};


  $scope.folderUuid = [];

  HeaderService.setTitle($translate.instant('COMMON.FLOWCHART'))
  activate();

  vm.updateCollapse = updateCollapse;
  vm.propertyValues = propertyService.getAllPropertyValues();
  vm.propertyFilter = propertyFilter;

  console.log("vm.propertyValues");
  console.log(vm.propertyValues);


function propertyFilter(array, query) {
		return filterService.propertyFilter(array, query);
	}


 function updateCollapse() {
     vm.collapse = !vm.collapse;
   }

  function activate() {
    $scope.isLoading = true;

    FlowChartService.getEntries("total").then(function (response) {

    vm.total = {};
                             vm.total.ongoing = response.igangværende;
                             vm.total.arrestanter = response.arrestanter;
                             vm.total.observation = response.observation;
                             vm.total.user = response.user;
                             vm.total.ventendegr = response.ventendegr;
                             vm.total.waitinglist = response.waitinglist;

                       });

  }

  function loaddata(value) {

      FlowChartService.getEntries(value).then(function (response) {
                               vm.ongoing = response.entries;
                         });

  }

  vm.loaddata = loaddata;

  function test(nodeuuid, doctor, socialworker, psychologist, status) {


    $scope.flow["node-uuid"] = nodeuuid;
    $scope.flow["psychologist"] = psychologist;
    $scope.flow["doctor"] = doctor;
    $scope.flow["socialworker"] = socialworker;
    $scope.flow["status"] = status;

//
    DeclarationService.update($scope.flow)
    			.then(function () {
    				Toast.show('Ændringerne er gemt');
    			});

  }

  vm.test = test;

    function setCase(i) {
        console.log("setcase")
        console.log(i);

        $scope.flow["kommentar"] = i.kommentar;
        $scope.flow["samtykkeopl"] = i.samtykkeopl;
        $scope.flow["arrest"] = i.arrest;
        $scope.flow["tolksprog"] = i.tolksprog;
        $scope.flow["psykologfokus"] = i.psykologfokus;
        $scope.flow["fritidved"] = i.fritidved;
        $scope.flow["kvalitetskontrol"] = i.kvalitetskontrol;

    }



    vm.setCase = setCase;

  	function lockedForEdit(lock) {
  		var currentUser = authService.getUserInfo().user;
  		var locked = {
  			'node-uuid': $scope.case['node-uuid'],
  			locked4edit: lock,
  			locked4editBy: lock ? currentUser : {}
  		};

  		DeclarationService.update(locked);
  	}


}