angular
  .module('openDeskApp')
  .factory('Toast', ToastService);

function ToastService($mdToast) {
  var service = {
    show: showAlert
  };

  return service;

  function showAlert(message) {
    $mdToast.show(
      $mdToast.simple()
        .content(message)
        .position('top right')
        .hideDelay(3000)
    );
  }
}