//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-CwVGhkCG.js
var manifest = {
	"56631f4487419b942cc38fa9c978e420578bd8091f24d3e48875e88645997622": {
		functionName: "trackOrder_createServerFn_handler",
		importer: () => import("./_ssr/store.functions-B_XAQYNp.mjs")
	},
	"90954bf6eb46204d3fcbe413f4732bb8c7d7db678553e104ffa92a324b365bba": {
		functionName: "placeOrder_createServerFn_handler",
		importer: () => import("./_ssr/store.functions-B_XAQYNp.mjs")
	},
	"b00975664162d400d9962a031192cdd63846017da2cad6471d01595f04949051": {
		functionName: "getStorefront_createServerFn_handler",
		importer: () => import("./_ssr/store.functions-B_XAQYNp.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
