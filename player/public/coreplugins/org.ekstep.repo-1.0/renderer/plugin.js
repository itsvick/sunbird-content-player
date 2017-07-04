/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

Plugin.extend({
    initialize: function() {
        EkstepRendererAPI.addEventListener('renderer:repo:create', this.initializeRepo, this);
    },
    initializeRepo:function(){
        var instance = this;
        var contextObj = EkstepRendererAPI.getPreviewData();
        if (contextObj.config.repos) {
            if (_.isObject(contextObj.config.repos)) {
                _.each(contextObj.config.repos, function(repoPath, index){
                    instance.createRepoInstance(repoPath, index)
                });
            } else {
                instance.createRepoInstance(contextObj.config.repos);
            }
        }
    },
    initPlugin: function() {console.info("Repo plugin init"); }, 
    createRepoInstance: function(repoPath, index) {
        var repoInstance = new(org.ekstep.pluginframework.iRepo.extend({
                id: 'ekstepPluginRepo_' + index, basePath: repoPath,
                discoverManifest: function(pluginId, pluginVer, callback, publishedTime) {
                    var instance = this;
                    org.ekstep.pluginframework.resourceManager.loadResource(this.resolveResource(pluginId, pluginVer, "manifest.json"), "json", function(err, response) {
                        callback(undefined, {manifest: response, repo: instance }); 
                    }, publishedTime);
                },
                resolveResource: function(pluginId, pluginVer, resource) {
                    return this.basePath + "/" + pluginId + "-" + pluginVer + "/" + resource;
                }
            }))();
        this.addRepoInstance(repoInstance, repoPath);
    },
    addRepoInstance: function(repoInstance, repoPath) {
        org.ekstep.pluginframework.resourceManager.addRepo(repoInstance);
    }
})
//# sourceURL=RepoPlugin.js