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


		// todo det er her der er en fejl, du får gemt string og ikke et objekt.
		unction saveChanges() {
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

			    // cleanup values for doctors, socialworkers, psycologists and secretaries - remove the userid

					var userTypes = ["secretary", "socialworker", "psychologist", "doctor"];

					userTypes.forEach(function (type) {
						for (var x in propertyValues[type]) {
							var user = propertyValues[type][x];
							var username = user.match(/ *\([^)]*\) */g);
							propertyValues[type][x] = propertyValues[type][x].replace(username, "");
						}
					});

				return propertyValues;
			},

			getPropertyContentHenvisende: function (property) {
			propertyName = property;
			propertyContent = [];

			var content = getValuesForProperty(property);



			// tmp

				// return [];


			if (!content) return propertyContent;

			content.forEach(function (elem, key) {



				// todo: check if valid json

				var obj = JSON.parse(elem);



				if (obj.hasOwnProperty("titel")) {



					propertyContent.push({
						title: obj.titel,
						email: obj.email,
						by: obj.by,
						postnr: obj.postnr,
						adresse: obj.adresse,
						selected: false
					});
				}
			}, this);

			return propertyContent;
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
			},

			/**
			 * rename a property for henvisende
			 *
			 */
			renamePropertyValueHenvisende: function (oldVal, newVal) {




				propertyContent.forEach(function (prop, key) {

					if (prop.title == oldVal.title) {
						//console.log("found it");
					    propertyContent.splice(key, 1);
					}

					// console.log(typeof prop === 'object')


				})
				propertyContent.push(newVal);
				saveChanges();
			},

			deletePropertyValuesHenvisende: function (values) {
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
