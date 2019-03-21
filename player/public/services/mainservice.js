/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */
var RendererServices = function () {}
window.org.ekstep.service = new RendererServices()
RendererServices = undefined

org.ekstep.service.mainService = Class.extend({
	getAPISlug: function () {
		var globalConfig = EkstepRendererAPI.getGlobalConfig()
		return globalConfig.apislug
	},
	init: function (config) {
		this.initService(config)
	},
	initService: function (config) {},
	initialize: function () {}
})
org.ekstep.service.init = function () {
	console.log("org.ekstep.service.init");
	if (!isbrowserpreview) { // TODO: remove this check and add to check isMobile
		org.ekstep.service.renderer = genieservice;
		 window.isMobile = true;
		console.log("org.ekstep.service.init set to genieservice", telemetry);
	}
}
// eslint-disable-next-line
telemetry_web = {
	tList: [],
	send: function (string) {
		console.log("V3 Telemetry Event - ", string)
		// EventBus.dispatch("telemetryEvent",string);
		return new Promise(function (resolve, reject) {
			// eslint-disable-next-line
                telemetry_web.tList.push(string)
			resolve(true)
		})
	}
}
// eslint-disable-next-line
// if (typeof cordova === "undefined") telemetry = telemetry_web
console.log("telemetry ====>", window);
if (isbrowserpreview) telemetry = telemetry_web