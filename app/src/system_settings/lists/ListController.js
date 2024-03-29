'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('ListController', ListController);

function ListController($scope, $stateParams, $mdDialog, Toast, propertyService, HeaderService) {

  $scope.selectedContent = [];
  $scope.newEntry = '';
  $scope.newEntry_email = '';
  $scope.newEntry_by = '';
  $scope.newEntry_postnr = '';
  $scope.newEntry_adresse = '';
  $scope.renameOriginal = {};


  $scope.listTitle = $stateParams.listTitle;

  if ($scope.listTitle == "Henvisende instans") {
      propertyService.initPropertyValues();
      $scope.listContent = propertyService.getPropertyContentHenvisende($stateParams.listData);
      console.log("hvad er $scope.listContent");
      console.log($scope.listContent);
  } else {
      $scope.listContent = propertyService.getPropertyContent($stateParams.listData);
  }


  HeaderService.addAction('COMMON.ADD', 'add', addNewDialog);

  $scope.query = {
    order: 'title'
  }

  $scope.$watch('listContent', function (newVal) {
    var selectedContent = [];
    newVal.forEach(function (element) {
      if (element.selected) {
        selectedContent.push(element);
      }
    }, this);
    $scope.selectedContent = selectedContent;

    if (selectedContent.length > 0) {
      HeaderService.resetActions();
      HeaderService.addAction('COMMON.DELETE', 'delete', deleteDialog);
      HeaderService.addAction('COMMON.ADD', 'add', addNewDialog);
    } else {
      HeaderService.resetActions();
      HeaderService.addAction('COMMON.ADD', 'add', addNewDialog);
    }
  }, true);

  function addNewDialog() {

    // choose special dialog if myndigheder

      if ($scope.listTitle == "Myndighed") {

          $mdDialog.show({
              templateUrl: 'app/src/system_settings/lists/view/list-create-myndighed.html',
              scope: $scope, // use parent scope in template
              preserveScope: true, // do not forget this if use parent scope
              clickOutsideToClose: true
          });
      }

    else if ($scope.listTitle == "Henvisende instans") {

           // du skal nulstille alle værdier i boksene

          $scope.newEntry = "";
          $scope.newEntry_adresse = "";
          $scope.newEntry_postnr = "";
          $scope.newEntry_by = "";


            $mdDialog.show({
              templateUrl: 'app/src/system_settings/lists/view/list-create-henviser.html',
              scope: $scope, // use parent scope in template
              preserveScope: true, // do not forget this if use parent scope
              clickOutsideToClose: true
            });
    }
    else {
          $mdDialog.show({
              templateUrl: 'app/src/system_settings/lists/view/list-create.html',
              scope: $scope, // use parent scope in template
              preserveScope: true, // do not forget this if use parent scope
              clickOutsideToClose: true
        });
    }


  }

  function deleteDialog() {
    $mdDialog.show({
      templateUrl: 'app/src/system_settings/lists/view/list-delete.html',
      scope: $scope, // use parent scope in template
      preserveScope: true, // do not forget this if use parent scope
      clickOutsideToClose: true
    });
  }

  $scope.renameDialog = function (value) {

      if ($scope.listTitle == "Myndighed") {


          var email = value.title.match(/ *\([^)]*\) */g);

          if (email != null) {

              email = email[0];
              email = email.replace("(","");
              email = email.replace(")","");
              email = email.trim();
          }

          var title = value.title.replace(email, ",");

          title = title.replace("(","");
          title = title.replace(")","");
          title = title.replace(",","");
          title = title.trim();


          $scope.renameOriginal = angular.copy(value);
          $scope.newEntry = title;
          $scope.newEntry_email = email;

          $mdDialog.show({
              templateUrl: 'app/src/system_settings/lists/view/list-rename-myndighed.html',
              scope: $scope, // use parent scope in template
              preserveScope: true, // do not forget this if use parent scope
              clickOutsideToClose: true
          });
      }

    else if ($scope.listTitle == "Henvisende instans") {

        $scope.newEntry = value.title;

        $scope.newEntry_adresse = value.adresse;
        $scope.newEntry_postnr = value.postnr;
        $scope.newEntry_by = value.by;

        $scope.renameOriginal = angular.copy(value);

        $mdDialog.show({
          templateUrl: 'app/src/system_settings/lists/view/list-rename-henviser.html',
          scope: $scope, // use parent scope in template
          preserveScope: true, // do not forget this if use parent scope
          clickOutsideToClose: true
        });
    }
    else {

        $scope.renameOriginal = angular.copy(value);
            $scope.newEntry = value.title;

            $mdDialog.show({
              templateUrl: 'app/src/system_settings/lists/view/list-rename.html',
              scope: $scope, // use parent scope in template
              preserveScope: true, // do not forget this if use parent scope
              clickOutsideToClose: true
            });

    }

  };

  $scope.addNew = function () {

      if ($scope.listTitle == "Myndighed") {
          propertyService.addPropertyValue($scope.newEntry + " (" + $scope.newEntry_email +")");
      }

    else if ($scope.listTitle == "Henvisende instans") {

        var newObj = {title : $scope.newEntry,
                      adresse : $scope.newEntry_adresse,
                      postnr : $scope.newEntry_postnr,
                      by : $scope.newEntry_by}

        propertyService.addPropertyValueHenvisende(newObj);

    }
    else {
        propertyService.addPropertyValue($scope.newEntry);
    }

    Toast.show($scope.newEntry + ' blev tilføjet');
    $scope.newEntry = '';
    $scope.newEntry_email = '';
    $scope.cancel();
  }

  $scope.delete = function () {

      if ($scope.listTitle == "Henvisende instans") {
          propertyService.deletePropertyValuesHenvisende($scope.selectedContent);
          angular.forEach($scope.selectedContent, function (deleted) {
              Toast.show(deleted.title + ' blev slettet');
          })
      }
      else {
          propertyService.deletePropertyValues($scope.selectedContent);
          angular.forEach($scope.selectedContent, function (deleted) {
              Toast.show(deleted.title + ' blev slettet');
          })
      }
    $scope.selectedContent = [];
    $scope.cancel();
  }

  $scope.rename = function () {


      if ($scope.listTitle == "Myndighed") {
          propertyService.renamePropertyValue($scope.renameOriginal, { title: $scope.newEntry + " (" + $scope.newEntry_email +")" });
      }

      else if ($scope.listTitle == "Henvisende instans") {
        propertyService.renamePropertyValueHenvisende($scope.renameOriginal, { title: $scope.newEntry,
                                                                                 adresse: $scope.newEntry_adresse,
                                                                                 postnr: $scope.newEntry_postnr,
                                                                                 by: $scope.newEntry_by,
                                                                                 email: $scope.newEntry_email}
        );

  } else {
        propertyService.renamePropertyValue($scope.renameOriginal, { title: $scope.newEntry });
  }


//    Toast.show($scope.renameOriginal.title + ' blev omdøbt til ' + $scope.newEntry);
    $scope.newEntry = '';
    $scope.newEntry_email = '';
    $scope.renameOriginal = {};
    $scope.cancel();
  }

  $scope.cancel = function () {
    $mdDialog.cancel();
  }
}
