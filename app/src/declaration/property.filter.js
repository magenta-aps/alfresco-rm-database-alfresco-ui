'use strict';

angular
.module('openDeskApp')
.filter('propertyfilter', propertyfilter);

function propertyfilter() {
return function (options, query) {

    var filteredProperties = [];

    angular.forEach(options, function (option) {
        if (option.toString().toLowerCase().indexOf(query.toLowerCase()) > -1) {
            this.push(option);
        }
    }, filteredProperties);

    return filteredProperties;
};
}