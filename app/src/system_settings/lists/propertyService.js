'use strict';

angular.module('openDeskApp.declaration')
    .factory('propertyService', function ($http, entryService) {

        var isEditing = false;
        var count = 0;
        var selectedContent = [];
        var content = [];
        var propertyContent = [];
        var propertyName = '';
        var propertyValues = {};

        function getValuesForProperty(propertyName) {
                return propertyValues[propertyName];
            }

        function setPropertyValues(property, values) {
                return $http.put("/alfresco/s/propertyValues", {
                    "property": property,
                    "values": values,
                }).then(function (response) {
                    return response.data;
                });
            }

        return {
            toggleEdit: function () {
                edit = !edit;
            },

            setEdit: function (state) {
                isEditing = state;
            },

            isEditing: function () {
                return isEditing;
            },

            updateCount: function (newCount) {
                count = newCount;
            },

            getCount: function () {
                return count;
            },

            updateSelectedContent: function (content) {
                selectedContent = content;
            },

            getSelectedContent: function () {
                return selectedContent;
            },

            updateContent: function (updated) {
                content = updated;
            },

            getContent: function () {
                return content;
            },

            setPropertyName: function (name) {
                propertyName = name;
            },

            saveChanges: function () {
                var values = [];
                propertyContent.forEach(function (property) {
                    values.push(property.title);
                })
                setPropertyValues(propertyName, values);
            },

            initPropertyValues: function () {
                return $http.get("/alfresco/s/propertyValues").then(function (response) {
                    propertyValues = response.data;
                    return response.data;
                });
            },

            getAllPropertyValues: function () {
                return propertyValues;
            },

            getPropertyContent: function (property) {
                propertyContent = [];
                var content = getValuesForProperty(property);

                content.forEach(function (elem, key) {
                    propertyContent.push({
                        title: elem,
                        selected: false
                    });
                }, this);

                return propertyContent;
            },

            addPropertyValue: function (value) {
                propertyContent.push({
                    title: value,
                    selected: false
                });
            },

            renamePropertyValue: function (oldVal, newVal) {
                propertyContent.forEach(function (prop, key) {
                    if (prop.title == oldVal.title)
                        propertyContent.splice(key, 1);
                })
                propertyContent.push(newVal);
            },

            deletePropertyValues: function (values) {
                propertyContent.forEach(function (prop, key) {
                    values.forEach(function (value) {
                        if (prop.title == value.title) {
                            propertyContent.splice(key, 1);
                        }
                    });
                });
            }
        };
    });