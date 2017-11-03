'use strict';

angular.module('openDeskApp.header').factory('headerService', headerService);

function headerService() {

    var leftHeaderTitle = '';

    var service = {
        setLeftHeaderTitle: setLeftHeaderTitle,
        getLeftHeaderTitle: getLeftHeaderTitle
    };

    return service;

    function getLeftHeaderTitle() {
        return leftHeaderTitle;
    }

    function setLeftHeaderTitle(title) {
        leftHeaderTitle = title;
    }


}