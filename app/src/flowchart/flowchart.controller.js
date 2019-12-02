'use strict';

angular
  .module('oda.flowchart')
  .controller('FlowChartController', FlowChartController);

function FlowChartController($scope, $stateParams, $translate, HeaderService, FlowChartService, propertyService, filterService, DeclarationService, Toast, authService, $anchorScroll, $location, $timeout ) {
  var vm = this;

  $scope.flow = {};

  $scope.folderUuid = [];

  HeaderService.setTitle($translate.instant('COMMON.FLOWCHART'))
  activate();

  vm.updateCollapse = updateCollapse;
  vm.propertyValues = propertyService.getAllPropertyValues();
  vm.propertyFilter = propertyFilter;


  vm.showing = "";
  vm.startedit = false;
  vm.saveShow = false;
  vm.alle = false;
  vm.minesager= false;
  vm.editing = false;

  vm.clickcreationDate = false;
  vm.clickcpr = false;
  vm.clickmainCharge = false;
  vm.clickefternavn = false;
  vm.clickfornavn = false;



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
                             vm.total.ongoing = response.ongoing;
                             vm.total.arrestanter = response.arrestanter;
                             vm.total.observation = response.observation;
                             vm.total.user = response.user;

                             vm.showUser = (vm.total.user != " -bruger ikke fundet-");

                             vm.total.ventendegr = response.ventendegr;
                             vm.total.waitinglist = response.waitinglist;
                       });


//    loaddata('ongoing', '@rm:creationDate', 'true');



    $timeout(function() {

            var val = angular.element(document.getElementById("ongoing_title"));

//            angular.element(document.querySelector('#ongoing_title')).click();

        }, 0);

//    var val = angular.element(document.getElementById("#ongoing_title"));
//    console.log("hvad er val");
//    console.log(val);


  }

  function loaddata(value, sort, desc) {

      vm.showing = value;

      FlowChartService.getEntries(value, sort, desc).then(function (response) {
                               vm.ongoing = response.entries;

      });
 }



  vm.loaddata = loaddata;





  function save(nodeuuid, doctor, socialworker, psychologist, status) {

    DeclarationService.update($scope.flow)
    			.then(function (response) {
    				Toast.show('Ændringerne er gemt');
    				lockedForEdit(false);
    				vm.editperid = "";
    				vm.startedit = false;
    				vm.saveShow = false;

                    vm.updateCard(response);

                    var val = angular.element(document.getElementById("top_" + response["node-uuid"]));


                    $timeout(function () {

                        $location.hash("top_" + response["node-uuid"]);
                        $anchorScroll();

                    })
    			});

  }

  vm.save = save;



    function updateCard(i) {
         DeclarationService.get(i.caseNumber).then(function (response) {


                var val = angular.element(document.getElementById("statusDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.status;
                var val = angular.element(document.getElementById("samtykkeDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.samtykkeopl;


                var val = angular.element(document.getElementById("arrestDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.arrest;
                var val = angular.element(document.getElementById("tolksprogDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.tolksprog;


                var val = angular.element(document.getElementById("socialworkerDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.socialworker;
                var val = angular.element(document.getElementById("fritidvedDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.fritidved;


                var val = angular.element(document.getElementById("doctorDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.doctor;
                var val = angular.element(document.getElementById("kommentarDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.kommentar;


                var val = angular.element(document.getElementById("psychologistDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.psychologist;
                var val = angular.element(document.getElementById("kvalitetskontrolDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.kvalitetskontrol;


                var val = angular.element(document.getElementById("psykologfokusDisplay_"+ response["node-uuid"]));
                val[0].innerText = response.psykologfokus;

                });
    }

    vm.updateCard = updateCard;


    function editCase(i) {

    var currentUser = authService.getUserInfo().user.userName

          return (DeclarationService.get(i.caseNumber).then(function (response) {

            // init locked4edit

            if (response.locked4edit == null) {
                response.locked4edit = false;
            }


            if (response.locked4edit) {
                if (response.locked4editBy != currentUser) {
                    alert("sagen er låst for redigering af " + i.locked4editBy);

                    return false;
                }
            }


            $scope.flow["samtykkeopl"] = response.samtykkeopl;
            $scope.flow["kommentar"] = response.kommentar;
            $scope.flow["arrest"] = response.arrest;
            $scope.flow["tolksprog"] = response.tolksprog;
            $scope.flow["psykologfokus"] = response.psykologfokus;
            $scope.flow["fritidved"] = response.fritidved;
            $scope.flow["kvalitetskontrol"] = response.kvalitetskontrol;
            $scope.flow["node-uuid"] = response["node-uuid"];
            $scope.flow["psychologist"] = response.psychologist;
            $scope.flow["socialworker"] = response.socialworker;
            $scope.flow["status"] = response.status;


            vm.editperid = response["node-uuid"]
            vm.startedit = true;
            vm.saveShow = true;

            lockedForEdit(true);

            return true;

        }));


    }


  function checkif() {
//  ng-if="vm.checkif(collapsed)"
    debugger;
  }

  vm.checkif = checkif;


    function cancel() {
        lockedForEdit(false);
        vm.editperid = "";
        vm.startedit = false;
        vm.saveShow = false;

    }

    vm.cancel = cancel;


    vm.editCase = editCase;

  	function lockedForEdit(lock) {



  		var currentUser = authService.getUserInfo().user.userName
  		var locked = {
  			'node-uuid': $scope.flow['node-uuid'],
  			locked4edit: lock,
  			locked4editBy: lock ? currentUser : {}
  		};

  		DeclarationService.update(locked);
  	}


}
