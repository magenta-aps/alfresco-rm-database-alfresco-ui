'use strict';

angular
  .module('oda.flowchart')
  .controller('FlowChartController', FlowChartController);

function FlowChartController($scope, $stateParams, $translate, HeaderService, FlowChartService, propertyService, filterService, DeclarationService, Toast ) {
  var vm = this;



  $scope.folderUuid = [];

  HeaderService.setTitle($translate.instant('COMMON.FLOWCHART'))
  activate();

  vm.updateCollapse = updateCollapse;
  vm.propertyValues = propertyService.getAllPropertyValues();
  vm.propertyFilter = propertyFilter;


function propertyFilter(array, query) {
		return filterService.propertyFilter(array, query);
	}


 function updateCollapse() {
     vm.collapse = !vm.collapse;
   }

  function activate() {
    $scope.isLoading = true;

    FlowChartService.getEntries("ongoing").then(function (response) {
                             vm.ongoing = response.entries;
                             console.log(vm.ongoing);
                             vm.ongoing.total = response.total;
                       });
  }

  function test(nodeuuid, doctor) {
    console.log(nodeuuid);
    console.log(doctor);
    console.log("hej");


    var properties = {
      			'node-uuid': nodeuuid,
      			doctor: doctor,
      		};


//
    DeclarationService.update(properties)
    			.then(function () {
    				Toast.show('Ændringerne er gemt');
    			});

  }

  	function lockedForEdit(lock) {
  		var currentUser = authService.getUserInfo().user;
  		var locked = {
  			'node-uuid': $scope.case['node-uuid'],
  			locked4edit: lock,
  			locked4editBy: lock ? currentUser : {}
  		};

  		DeclarationService.update(locked);
  	}

  vm.test = test;
}