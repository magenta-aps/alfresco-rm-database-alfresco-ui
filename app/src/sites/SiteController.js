'use strict';

    angular
        .module('openDeskApp.sites')
        .controller('SiteController', SiteController);
        
        function SiteController($scope, $mdDialog, $window, siteService, cmisService, $stateParams, documentPreviewService,
								alfrescoDownloadService, documentService, notificationsService, authService, $rootScope,
								searchService, userService) {

			$scope.role_mapping = {};
			$scope.role_mapping["SiteManager"] = "Projektejer";
			$scope.role_mapping["SiteContributor"] = "Kan skrive";
			$scope.role_mapping["SiteConsumer"] = "Kan læse";


			$scope.role_translation = {};
			$scope.role_translation["1"] = "Projektejer";
			$scope.role_translation["2"] = "Kan skrive";
			$scope.role_translation["3"] = "Kan læse";


			$scope.role_mapping_reverse = {};
			$scope.role_mapping_reverse["1"] = "SiteManager";
			$scope.role_mapping_reverse["2"] = "SiteContributor";
			$scope.role_mapping_reverse["3"] = "SiteConsumer";
			
			var vm = this;
			
            $scope.contents = [];
			$scope.history = [];
			$scope.members = [];
			$scope.roles = [];
			$scope.roles_translated = [];

			vm.project = $stateParams.projekt;
            vm.userRole = 'siteConsumer';
            
			//siteService.addUser(vm.project, "abeecher", "PD_MONITORS");
            
            siteService.getSiteUserRole(vm.project, authService.getUserInfo().user.userName).then(
                function (response) {
                    vm.userRole = response;
                }                                                                   
            );
             
            
			function translation_to_value(translation) {

				for (var x in $scope.role_translation) {
					var v = $scope.role_translation[x];

					if (v === translation) {
						return x;
					}
				}
			}

			
			function buildBreadCrumbPath(project_title) {
				var paths = [
					{
						title: 'Projekter',
						link: '#/projekter'
					},
					{
						title: project_title,
						link: '#/projekter/' + vm.project
					}
				];
				var pathArr = $stateParams.path.split('/');
				var pathLink = '/';
				for (var a in pathArr) {
					if (pathArr[a] !== '') {
						paths.push({
							title: pathArr[a],
							link: '#/projekter/' + vm.project + pathLink + pathArr[a]
						});
						pathLink = pathLink + pathArr[a] + '/';
					}
				}
				return paths;
            }

			vm.path = $stateParams.path;


			vm.cancel = function () {
				$mdDialog.cancel();
			};

			vm.reload = function () {
				$window.location.reload();
			};
			
			var originatorEv;
			vm.openMenu = function($mdOpenMenu, event) {
			  originatorEv = event;
			  $mdOpenMenu(event);
			};

			vm.loadSiteData = function () {
				var r = siteService.loadSiteData(vm.project);

				r.then(function(result) {
					vm.project_title = result;
					// Compile paths for breadcrumb directive
					vm.paths = buildBreadCrumbPath(vm.project_title);
				});
			};
			vm.loadSiteData();
			

			vm.loadContents = function() {								

				var currentFolderNodeRef_cmisQuery = $stateParams.projekt + "/documentLibrary/" + $stateParams.path;

				cmisService.getNode(currentFolderNodeRef_cmisQuery).then(function (val) {
					var currentFolderNodeRef = val.data.properties["alfcmis:nodeRef"].value;


					siteService.getContents(currentFolderNodeRef.split("/")[3]).then (function (response) {
						$scope.contents = response;
					})




					//cmisService.getFolderNodes($stateParams.projekt + "/documentLibrary/" + $stateParams.path).then(function (val) {
                    //
                    //
					//	console.log(val);
                    //
					//	var result = [];
                    //
                    //
					//	for (let x in val.data.objects) {
                    //
					//		userService.getPerson(val.data.objects[x].object.succinctProperties["cmis:lastModifiedBy"])
					//			.then(function(response){
					//				let ref = val.data.objects[x].object.succinctProperties["alfcmis:nodeRef"];
                    //
					//				documentService.getPath(ref.split("/")[3]).then(function(val) {});
                    //
					//				var shortRef = ref.split("/")[3];
					//
					//				result.push({
					//					name: val.data.objects[x].object.succinctProperties["cmis:name"],
					//					contentType: val.data.objects[x].object.succinctProperties["cmis:objectTypeId"],
					//					nodeRef: val.data.objects[x].object.succinctProperties["alfcmis:nodeRef"],
					//					parentNodeRef: currentFolderNodeRef,
					//					shortRef: shortRef,
					//					userName: response.userName,
					//					lastChangedBy : response.firstName +" "+ response.lastName,
					//					lastChanged : new Date(val.data.objects[x].object.succinctProperties["cmis:lastModificationDate"]),
					//					hasHistory : (val.data.objects[x].object.succinctProperties["cmis:versionLabel"] == "1.0" ? false : true)
                    //
					//				});
					//			});
					//	}
					//
					//
					//
					//	$scope.contents = result;
					//});
				});
			};


			vm.loadContents();

			
			vm.loadHistory  = function(doc) {
				$scope.history = [];
				documentService.getHistory(doc).then (function (val){
					$scope.history = val;
				});
			};

			vm.createFolder = function (folderName) {
				var currentFolderNodeRef;
				var cmisQuery = $stateParams.projekt + "/documentLibrary/" + $stateParams.path;

				cmisService.getNode(cmisQuery).then(function (val) {
					currentFolderNodeRef = val.data.properties["alfcmis:nodeRef"].value;

					var props = {
						prop_cm_name: folderName,
						prop_cm_title: folderName,
						alf_destination: currentFolderNodeRef
					};

					siteService.createFolder("cm:folder", props).then(function(response){
						vm.loadContents();
					});


				});
				
				$mdDialog.hide();
			}
			
			vm.newFolderDialog = function (event) {
				$mdDialog.show({
					templateUrl: 'app/src/sites/view/newFolder.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: event,
					scope: $scope,
        	preserveScope: true,
					clickOutsideToClose: true
				});
			};

			vm.uploadDocumentsDialog = function (event) {
				$mdDialog.show({
					templateUrl: 'app/src/sites/view/uploadDocuments.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: event,
					scope: $scope,        // use parent scope in template
					preserveScope: true,  // do not forget this if use parent scope
					clickOutsideToClose: true
				});
			};
			
			vm.uploadNewVersionDialog = function (event) {
				$mdDialog.show({
					templateUrl: 'app/src/sites/view/uploadNewVersion.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: event,
					scope: $scope,        // use parent scope in template
					preserveScope: true,  // do not forget this if use parent scope
					clickOutsideToClose: true
				});
			};

			vm.reviewDocumentsDialog = function (event, nodeRef) {

				$scope.nodeRef = nodeRef;

				$mdDialog.show({
					templateUrl: 'app/src/sites/view/reviewDocument.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: event,
					scope: $scope,        // use parent scope in template
					preserveScope: true,  // do not forget this if use parent scope
					clickOutsideToClose: true
				});
			};

			vm.deleteFileDialog = function (event, nodeRef) {
  			var confirm = $mdDialog.confirm()
  			      .title('Slette denne fil?')
  			      .textContent('')
  			      .ariaLabel('Slet dokument')
  			      .targetEvent(event)
  			      .ok('Slet')
  			      .cancel('Nej, tak');
  			
  			$mdDialog.show(confirm).then(function() {
  			  vm.deleteFile(nodeRef);
  			});
			};

			vm.reviewDocument = function (document, reviewer, comment) {

			};

			vm.deleteFile = function (nodeRef) {
				siteService.deleteFile(nodeRef).then(function (val) {
					vm.loadContents();
				});
				
				$mdDialog.hide();
			};

			vm.deleteFoldereDialog = function (event, nodeRef) {
			   var confirm = $mdDialog.confirm()
			         .title('Slette denne mappe?')
			         .textContent('Dette vil slette mappen med alt dens indhold')
			         .ariaLabel('Slet mappe')
			         .targetEvent(event)
			         .ok('Slet')
			         .cancel('Nej, tak');

			   $mdDialog.show(confirm).then(function() {
			     vm.deleteFolder(nodeRef);
			   });
			};

			vm.deleteFolder = function (nodeRef) {
				siteService.deleteFolder(nodeRef).then(function (val) {
					vm.loadContents();
				});
				
				$mdDialog.hide();
			}

			vm.createReviewNotification = function (documentNodeRef, receiver, subject, comment) {

				var s = documentNodeRef.split("/");
				var ref = (s[3])

				notificationsService.addWFNotice(authService.getUserInfo().user.userName, receiver, subject, comment, ref, "wf").then (function (val) {
					$mdDialog.hide();
				});


			}
	

			vm.loadMembers = function () {
				siteService.getSiteMembers(vm.project).then(function (val) {
					$scope.members = val;
				});
			}
			vm.loadMembers();


			vm.newMember = function (event) {
				$mdDialog.show({
					templateUrl: 'app/src/sites/view/newMember.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: event,
					scope: $scope,        // use parent scope in template
					preserveScope: true,  // do not forget this if use parent scope
					clickOutsideToClose: true
				});
			};

			vm.upload = function (files) {

				var cmisQuery = $stateParams.projekt  + "/documentLibrary/" + $stateParams.path;


				cmisService.getNode(cmisQuery).then(function (val) {

					var currentFolderNodeRef = val.data.properties["alfcmis:nodeRef"].value;

					for (var i = 0; i < files.length; i++) {
						siteService.uploadFiles(files[i], currentFolderNodeRef).then(function(response){
							vm.loadContents();
							} );
					}
					$mdDialog.cancel();

				});
			};

			vm.loadSiteRoles = function() {
				siteService.getSiteRoles(vm.project).then(function(response){

					$scope.roles_translated = [];

					for (var x in response.siteRoles) {

						if ($scope.role_mapping[response.siteRoles[x]] != null) {
							$scope.roles_translated.push($scope.role_mapping[response.siteRoles[x]]);
						}

					}

					//$scope.roles = response.siteRoles;
				});
			};
			vm.loadSiteRoles();

			vm.currentDialogUser = '';

			vm.updateMemberRoleDialog = function(event, user) {
				vm.currentDialogUser = user;				
				$mdDialog.show({
					templateUrl: 'app/src/sites/view/updateRole.tmpl.html',
					parent: angular.element(document.body),
					scope: $scope,
					preserveScope: true,
					targetEvent: event,
					clickOutsideToClose: true
				});
			}
			
			vm.updateRoleOnSiteMember = function(siteName, userName, role) {

				// getTheValue
				var role_int_value = translation_to_value(role);
				var role_alfresco_value = $scope.role_mapping_reverse[role_int_value];

				siteService.updateRoleOnSiteMember(siteName, userName, role_alfresco_value ).then(function(val){
					vm.loadMembers();
				});
				$mdDialog.hide();
			};

			vm.addMemberToSite = function(siteName, userName, role) {

				// getTheValue
				var role_int_value = translation_to_value(role);
				var role_alfresco_value = $scope.role_mapping_reverse[role_int_value];


				siteService.addMemberToSite(siteName, userName, role_alfresco_value).then(function(val){
					vm.loadMembers();
				});
				$mdDialog.hide();
			};
			
			vm.deleteMemberDialog = function (siteName, userName) {
			   var confirm = $mdDialog.confirm()
			         .title('Slette dette medlem?')
			         .textContent('')
			         .ariaLabel('Slet medlem')
			         .targetEvent(event)
			         .ok('Slet')
			         .cancel('Nej, tak');

			   $mdDialog.show(confirm).then(function() {
			     vm.removeMemberFromSite(siteName, userName);
			   });
			};

			vm.removeMemberFromSite = function(siteName, userName) {
				siteService.removeMemberFromSite(siteName, userName).then(function(val){
					vm.loadMembers();
				});
				
				$mdDialog.hide();
			};

			vm.getAllUsers = function(filter) {
				return siteService.getAllUsers(filter)
			};

			vm.previewDocument = function previewDocument(nodeRef){
				documentPreviewService.previewDocument(nodeRef);
			}

			vm.downloadDocument = function downloadDocument(nodeRef, name){
				alfrescoDownloadService.downloadFile(nodeRef, name);
			}
			
			vm.moveFileDialog = function moveFileDialog(event, nodeRef, parentNodeRef) {
				vm.source = [];
				vm.source.push(nodeRef);
				vm.parentId = parentNodeRef;
				
				$mdDialog.show({
					templateUrl: 'app/src/sites/view/moveNodeRefs.tmpl.html',
					parent: angular.element(document.body),
					scope: $scope,
					preserveScope: true,
					targetEvent: event,
					clickOutsideToClose: true
				}).then(function(){
					console.log('Dispatching move action');
				}, function(){
					console.log('You cancelled a move action');
				});
			}
			
			vm.copyFileDialog = function copyFileDialog(event, nodeRef, parentNodeRef) {
				vm.source = [];
				vm.source.push(nodeRef);
				vm.parentId = parentNodeRef;
				
				$mdDialog.show({
					templateUrl: 'app/src/sites/view/copyNodeRefs.tmpl.html',
					parent: angular.element(document.body),
					scope: $scope,
					preserveScope: true,
					targetEvent: event,
					clickOutsideToClose: true
				}).then(function(){
					console.log('Dispatching copy action');
				}, function(){
					console.log('You cancelled a copy action');
				});
			}

			
			vm.moveNodeRefs = function moveNodeRefs(sourceNodeRefs, destNodeRef, parentNodeRef) {
				siteService.moveNodeRefs(sourceNodeRefs, destNodeRef, parentNodeRef).then (function (response) {									
					$mdDialog.hide();
					
					if (response.data.results[0].fileExist) {
						
						$mdDialog.show(
						  $mdDialog.alert()
						    .parent(angular.element(document.body))
						    .clickOutsideToClose(true)
						    .title('Der er allerede en fil med samme navn i mappen du valgte.')
						    .ariaLabel('Eksisterer allerede')
						    .ok('Ok')
						);
					} else {
						vm.loadContents();
					}
					return response;

				});
			}

			
			vm.copyNodeRefs = function copyNodeRefs(sourceNodeRefs, destNodeRef, parentNodeRef) {
				siteService.copyNodeRefs(sourceNodeRefs, destNodeRef, parentNodeRef).then (function (response) {
					$mdDialog.hide();

					if (response.data.results[0].fileExist) {

						$mdDialog.show(
							$mdDialog.alert()
								.parent(angular.element(document.body))
								.clickOutsideToClose(true)
								.title('Der er allerede en fil med samme navn i mappen du valgte.')
								.ariaLabel('Eksisterer allerede')
								.ok('Ok')
						);
					} else {
						vm.loadContents();
					}
					return response;

				});
			}

			
			vm.renameDocumentDialog = function(event, docNodeRef) {
				var confirm = $mdDialog.prompt()
				.title('Hvordan vil du navngive dette?')
				.placeholder('Navn')
				.ariaLabel('Navn')
				.targetEvent(event)
				.ok('Omdøb')
				.cancel('Annullér');
				$mdDialog.show(confirm).then(function(result) {
						var newName = result;					
						vm.renameDocument(docNodeRef, newName);
				
				});
				
			}
			
			vm.renameDocument = function renameDocument(docNodeRef, newName) {
				var props = {
					prop_cm_name: newName
				};
				
				siteService.updateNode(docNodeRef, props).then(function(val){
					vm.loadContents();
				});
				
				$mdDialog.hide();
			}

			vm.getSearchresults = function getSearchReslts(term){
				return searchService.getSearchResults(term).then(function (val) {

					if (val != undefined) {

						$rootScope.searchResults = [];
						$rootScope.searchResults = val.data.items;

						window.location.href = "#/search";

					} else {
						return [];
					}
				});
			}

			vm.getAutoSuggestions = function getAutoSuggestions(term) {
				return searchService.getSearchSuggestions(term).then(function (val) {

					if (val != undefined) {
						return val;
					}
					else {
						return [];
					}
				});
			}



			// vm.test = function test() {
			//var nodeRef = "workspace://SpacesStore/7cb5adc4-f18c-42d0-8225-6a00d6c31e68";
			// 	var newName = "gufsssssfy.jpg"
			//
			// 	vm.renameDocument(nodeRef, newName);
			// }


			//vm.moveNodeRefs([nodeRef], "workspace://SpacesStore/812e33b2-6716-4bd7-a8f1-a792e7e7eef7", "workspace://SpacesStore/d41769e3-704c-4dfd-825b-7b7dbf847bef").then (function (response){
			//	console.log(response.data.overallSuccess);
			//	console.log(response.data.results[0].fileExist);
			//});

			vm.gotoPath = function (nodeRef) {

				var ref = nodeRef;

				documentService.getPath(ref.split("/")[3]).then(function(val) {

					$scope.selectedDocumentPath = val.container
					// var project = val.site;
					// var container = val.container;
					// var path = val.path;

					var path = ref.replace("workspace://SpacesStore/", "");
					$window.location.href = "/#/dokument/" + path;

				});
			}



		}; // SiteCtrl close


//TODO: refactor all the methods that dont belong here to a relevant server- and pass on the call to them in the controller