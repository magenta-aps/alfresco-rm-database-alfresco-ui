'use strict';

angular.module('openDeskApp.declaration')
	.factory('propertyService', function ($http) {

		var content = [];
		var propertyContent = [];
		var propertyName = '';
		var propertyValues = {};

		function getValuesForProperty(propertyName) {
			return propertyValues[propertyName];
		}

		function setPropertyValues(property, values) {
			return $http.put("/alfresco/s/propertyValues", {
				"siteShortName": "retspsyk",
				"property": property,
				"values": values,
			}).then(function (response) {
				return response.data;
			});
		}

		function saveChanges() {
			var values = [];
			propertyContent.forEach(function (property) {
				values.push(property.title);
			})
			setPropertyValues(propertyName, values);
		}

		return {

			initPropertyValues: function () {
				return $http.get("/alfresco/s/propertyValues?siteShortName=retspsyk")
					.then(function (response) {
						propertyValues = response.data;
						return response.data;
					});
			},

			getAllPropertyValues: function () {
				return propertyValues;
			},

			getPropertyContent: function (property) {
				propertyName = property;
				propertyContent = [];
				var content = getValuesForProperty(property);
				if (!content) return propertyContent;

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
				saveChanges();
			},

			/**
			 * rename a property
			 * 
			 */
			renamePropertyValue: function (oldVal, newVal) {
				propertyContent.forEach(function (prop, key) {
					if (prop.title == oldVal.title)
						propertyContent.splice(key, 1);
				})
				propertyContent.push(newVal);
				saveChanges();
			},

			deletePropertyValues: function (values) {
				propertyContent.forEach(function (prop, key) {
					values.forEach(function (value) {
						if (prop.title == value.title) {
							propertyContent.splice(key, 1);
						}
					});
				});
				saveChanges();
			}
		};
	});