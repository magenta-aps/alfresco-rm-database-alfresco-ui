angular
    .module('openDeskApp')
    .factory('documentPreviewService', DocumentPreviewService);

function DocumentPreviewService(alfrescoDocumentService, sessionService, $http, $sce, ALFRESCO_URI) {

    var templatesUrl = 'app/src/shared/services/document/preview/view/';

    var service = {
        templatesUrl: templatesUrl,
        getPluginByNodeRef: getPluginByNodeRef,
        previewDocumentPlugin: previewDocumentPlugin,
        _getPluginByMimeType: _getPluginByMimeType,
        getPlugin: getPlugin,
        plugins: getPlugins()
    };
    return service;

    function previewDocumentPlugin(nodeRef) {
        var _this = this;
        return alfrescoDocumentService.retrieveSingleDocument(nodeRef).then(function (item) {
            return _this._getPluginByMimeType(item);
        });
    }

    function getPluginByNodeRef (nodeRef) {
        return alfrescoDocumentService.retrieveSingleDocument(nodeRef)
          .then(function (response) {
            var item = response.node
            item.lastThumbnailModificationData = response.node.properties['cm:lastThumbnailModification']
            item.name = response.location.file
            item.thumbnailDefinitions = response.thumbnailDefinitions
            return getPlugin(item)
          })
      }


function getPlugin (item) {
    var plugins = getPlugins()
    for (var i in plugins) {
      var plugin = plugins[i]
      if (plugin.acceptsItem(item)) {
        plugin.initPlugin(item)
        if (plugin.extendPlugin)
          plugin.extendPlugin()
        return plugin
      }
    }
  }

    function getPlugins() {
        var plugins = [
            audioViewer(),
            pdfViewer(),
            imageViewer(),
            videoViewer(),
            strobeMediaPlayback(),
            webViewer(),
            cannotPreviewPlugin()
        ];
        return plugins;
    }

    function _getPluginByMimeType(item) {
        var resultPlugin = null;
        for (var i in this.plugins) {
            var plugin = this.plugins[i];
            if (plugin.acceptsItem(item)) {
                plugin.initPlugin(item);
                return plugin;
            }
        }
    }

    function audioViewer() {
        var viewer = {
            mimeTypes: ['audio/x-wav'],
            templateUrl: 'audio.html'
        };
        var result = generalPlaybackPlugin();
        return angular.extend(result, viewer);
    }

    function videoViewer() {
        var viewer = {
            mimeTypes: [
                'video/ogg',
                'video/webm',
                'video/x-m4v',
                'video/mp4'
            ],
            templateUrl: 'video.html'
        };
        var result = generalPlaybackPlugin();
        return angular.extend(result, viewer);
    }

    function strobeMediaPlayback() {
        var viewer = {
            mimeTypes: [
                'video/x-m4v',
                'video/x-flv',
                'video/mp4',
                'video/quicktime',
                'audio/mpeg'
            ],
            templateUrl: 'strobeMediaPlayBack.html'
        };

        var result = generalPlaybackPlugin();
        return angular.extend(result, viewer);
    }

    function imageViewer(mimeType) {
        var viewer = {
            mimeTypes: [
                'image/png',
                'image/gif',
                'image/jpeg'
            ],
            thumbnail: 'imgpreview',
            templateUrl: 'image.html',
            maxItemSize: 20000000,
            initScope: function ($scope) {
                $scope.itemMaxSizeExceeded = (this.itemSize && parseInt(this.itemSize) > this.maxItemSize);
                if ($scope.itemMaxSizeExceeded === false) {
                    $scope.previewUrl = $scope.config.thumbnailUrl;
                    $scope.imageUrl = $scope.config.contentUrl;
                }
            }
        };
        var result = generalPreviewPlugin();
        return angular.extend(result, viewer);
    }

    function pdfViewer() {
        var viewer = {
            mimeTypes: ['application/pdf'],
            thumbnail: 'pdf',
            templateUrl: 'pdf.html',
            initScope: function ($scope) {
                $scope.pdfUrl = $scope.config.contentUrl;

                // Generate a random canvas id
                $scope.canvasid = Math.random().toString(36).slice(2);
                // TODO: Loading message
                //$scope.loading = $translate.instant();

                $scope.getNavStyle = function (scroll) {
                    if (scroll > 100) return 'pdf-controls fixed';
                    else return 'pdf-controls';
                };

                $scope.onError = function (error) {
                    //console.log(error);
                };

                $scope.onLoad = function () {
                    $scope.loading = '';
                };

                $scope.onProgress = function (progress) {
                    //console.log(progress);
                };
            }
        };
        var result = generalPreviewPlugin();
        return angular.extend(result, viewer);
    }

    function webViewer() {
        var viewer = {
            mimeTypes: [
                'text/plain',
                'text/html',
                'text/xml',
                'text/xhtml+xml'
            ],
            templateUrl: 'web.html',
            initScope: function ($scope) {
                var _this = this;
                $http.get(this.contentUrl).then(function (response) {
                    if (_this.mimeType == 'text/html' || _this.mimeType == 'text/xhtml+xml') {
                        $scope.htmlContent = $sce.trustAsHtml(response.data);
                    } else {
                        $scope.plainTextContent = response.data;
                    }
                });
            }
        };
        var result = generalPreviewPlugin();
        return angular.extend(result, viewer);
    }

    function cannotPreviewPlugin() {
        var viewer = {
            templateUrl: 'cannotPreview.html',
            _acceptsMimeType: function (item) {
                return true;
            }
        };
        return angular.extend(generalPreviewPlugin(), viewer);
    }

    function generalPlaybackPlugin() {
        var plugin = {
            initScope: function ($scope) {
                var hostUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                this.contentUrl = hostUrl + this.contentUrl;
            }
        };
        var result = generalPreviewPlugin();
        return angular.extend(result, plugin);
    }

    function generalPreviewPlugin() {
        return {
              acceptsItem: function (item) {
                return this._acceptsMimeType(item) ||
                            this._acceptsThumbnail(item) ||
                            this._acceptsTransformableMimeTypes(item)
              },

                  initPlugin: function (item) {
                    this.nodeRef = item.node.nodeRef
                    this.fileName = item.name
                    this.itemSize = item.size
                    this.mimeType = item.mimetype
                    if (item.thumbnailUrl === undefined)
                      item.thumbnailUrl = this._getThumbnailUrl()
                    this.thumbnailUrl = ALFRESCO_URI.webClientServiceProxy + item.thumbnailUrl
                    this._addThumbnailUrlFlags(item)
                    this.thumbnailUrl = sessionService.makeURL(this.thumbnailUrl)
                    if (this._acceptsMimeType(item)) {
                      this.contentUrl = ALFRESCO_URI.webClientServiceProxy + item.contentURL
                      this.contentUrl = sessionService.makeURL(this.contentUrl)
                    } else {
                      this.contentUrl = this.thumbnailUrl
                    }
                  },

      _acceptsMimeType: function (item) {
        if (this.mimeTypes === null || this.mimeTypes === undefined)
          return false

        return this.mimeTypes.indexOf(item.mimetype) !== -1
      },

            _acceptsThumbnail: function (item) {
                if (this.thumbnail === null || this.thumbnail === undefined
                    || item.thumbnailDefinitions === null || item.thumbnailDefinitions === undefined) {
                    return false;
                }


                return item.thumbnailDefinitions.indexOf(this.thumbnail) !== -1;
            },

            _getContentUrl: function (item) {
                return item.node.contentURL;
            },

                  _acceptsTransformableMimeTypes: function (item) {
                    if (this.transformableMimeTypes === null || this.transformableMimeTypes === undefined)
                      return false

                    return this.transformableMimeTypes.indexOf(item.mimetype) !== -1
                  },

            _addThumbnailUrlFlags: function (item) {
            var noCache = new Date().getTime()
            var lastModified = this._getLastThumbnailModification(item)
            this.thumbnailUrl += this.thumbnail + '?c=force&noCache=' + noCache + lastModified
            },

            _getThumbnailUrl: function () {
                    var nodeRefAsLink = this.nodeRef.replace(':/', '')
                    return '/api/node/' + nodeRefAsLink + '/content/thumbnails/'
                  },

            _getLastThumbnailModification: function (item) {
                var thumbnailModifications = item.node.properties["cm:lastThumbnailModification"];
                if (!thumbnailModifications) {
                    thumbnailModifications = [];
                }
                for (var i in thumbnailModifications) {
                    var thumbnailModification = thumbnailModifications[i];
                    if (thumbnailModification.indexOf(this.thumbnail) !== -1) {
                        return "&lastModified=" + encodeURIComponent(thumbnailModification);
                    }
                }
                return "";
            }
        };
    }
}