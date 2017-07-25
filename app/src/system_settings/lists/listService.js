'use strict';

angular.module('openDeskApp.declaration')
    .factory('listService', function ($http, declarationService) {

        var isEditing = false;
        var count = 0;
        var selectedContent = [];
        var content = [];
        var propertyContent = [];
        var propertyName = '';

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

            updateContent: function(updated) {
                content = updated;

            },

            getContent: function() {
                return content;
            },

            setPropertyName: function(name) {
                propertyName = name;
            },

            saveChanges: function() {
                var values = [];
                propertyContent.forEach(function(property) {
                    values.push(property.title);
                })
                declarationService.setPropertyValues(propertyName,values);
            },

            getPropertyContent: function (property) {
                propertyContent = [];
                var content = declarationService.getDropdownOptions(property);

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