'use strict';

angular
  .module('oda.flowchart')
  .controller('FlowChartController', FlowChartController);

function FlowChartController($scope, $stateParams, $translate, HeaderService, FlowChartService, propertyService, filterService, DeclarationService, Toast, authService, $anchorScroll, $location ) {
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
                             vm.total.ventendegr = response.ventendegr;
                             vm.total.waitinglist = response.waitinglist;
                       });



  }

  function loaddata(value) {

      vm.showing = value;

      FlowChartService.getEntries(value).then(function (response) {
                               vm.ongoing = response.entries;

                         });

  }

  vm.loaddata = loaddata;

  function save(nodeuuid, doctor, socialworker, psychologist, status) {

//    $scope.flow["status"] = status;




    DeclarationService.update($scope.flow)
    			.then(function () {
    				Toast.show('Ændringerne er gemt');
    				lockedForEdit(false);
    				vm.editperid = "";
    				vm.startedit = false;
    				vm.saveShow = false;


                    // update current display
    				var val = angular.element(document.getElementById("samtykkeDisplay_"+ nodeuuid));
                    val[0].innerText = $scope.flow.samtykkeopl;


                    var val = angular.element(document.getElementById("psychologistDisplay_"+ nodeuuid));
                    val[0].innerText = $scope.flow.psychologist;


                    $location.hash(nodeuuid);
                    $anchorScroll();

    			});

  }

  vm.save = save;



    function updateCard(i) {


         DeclarationService.get(i.caseNumber).then(function (response) {

                console.log(response);

                var val = angular.element(document.getElementById("statusDisplay_"+ i.node_uuid));
                val[0].innerText = response.status;

                var val = angular.element(document.getElementById("samtykkeDisplay_"+ i.node_uuid));
                val[0].innerText = response.samtykkeopl;

                var val = angular.element(document.getElementById("psychologistDisplay_"+ i.node_uuid));
                val[0].innerText = response.psychologist;



//                mainCharge: "Bedrageri mv., forsøg §§ 278-280, jf. § 21"
//                node_uuid: "cd424f7d-16b0-4c72-a95c-d76b47dfd2e4"
//                samtykkeopl: "skald"
//                show: "false"
//                socialworker: "Hansen, Anne Marie"
//                status: "Afsoner"


                // fetch the id of the field, as it might has been updated since last reload of the list

//                var va = angular.element(document.getElementById("samtykkeDisplay_"+ i.node_uuid));


                });


//
//        console.log("i");
//        console.log(i)
//        var va = angular.element(document.getElementById("samtykkeDisplay_"+ i.node_uuid));
//        console.log(va);
//        $scope.flow["samtykkeopl"] = va[0].innerText;
    }

    vm.updateCard = updateCard;


    function editCase(i) {

    var currentUser = authService.getUserInfo().user.userName





    // Calling the jQuery function using the angular.element.




          return (DeclarationService.get(i.caseNumber).then(function (response) {

            console.log("response");
            console.log(response);

            // init locked4edit

            if (i.locked4edit == null) {
                response.locked4edit = false;
            }


            if (i.locked4edit) {
                if (i.locked4editBy != currentUser) {
                    alert("sagen er låst for redigering af " + i.locked4editBy);

                    return false;
                }
            }

            // fetch the id of the field, as it has might been updated since last reload of the list

            $scope.flow["samtykkeopl"] = response.samtykkeopl;
            $scope.flow["kommentar"] = response.kommentar;
            $scope.flow["arrest"] = response.arrest;
            $scope.flow["tolksprog"] = response.tolksprog;
            $scope.flow["psykologfokus"] = response.psykologfokus;
            $scope.flow["fritidved"] = response.fritidved;
            $scope.flow["kvalitetskontrol"] = response.kvalitetskontrol;
            $scope.flow["node-uuid"] = response["node-uuid"];
            $scope.flow["psychologist"] = response.psychologist;


            vm.editperid = i.node_uuid;
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
