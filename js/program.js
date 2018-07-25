(function(global) {
    class QwProgram {
        constructor() {
            this.router = null;
            this.scriptsjs = null;
            global.qwapp.AutoBindMethod.execute(this);
        }
    
        async init() {
            let load = new global.qwapp.LocalLoad();
            let routesJsonData = await load.jsonFile(
                global.qwapp.PathHelper.getRouterPath(global.qwapp.Config.ROUTE_INFO_FILE));
    
            console.log("Call router to resolve");
            this.router = new Router(routesJsonData.routes);
        }
    
        async execute() {
            this.router.map();
            await this.scriptLoader()
                    .then(() => this.invokeController())
                    .catch((err) => console.log(err));
        }
    
        async scriptLoader() {
            let load = new global.qwapp.ScriptLoad();
    
            let promises = [
                load.script(global.qwapp.PathHelper.getJsLibPath(
                    this.router.currentRoute.controller.toLowerCase() + ".js")),
                load.script(global.qwapp.PathHelper.getJsLibPath(
                    this.router.currentRoute.controller.toLowerCase() + ".js"))
            ];
    
            return Promise.all(promises);
        }
    
        invokeController() {
            let route = this.router.currentRoute;
            let controllerClass = global.qwapp[global.qwapp.Config.getControllerClass(route.controller)];
            let controllerObj = new controllerClass(route);
    
            let actionMethod = null;
            if(route.action) {
                actionMethod = controllerObj[route.action].bind(controllerObj);
            }
            else {
                actionMethod = controllerObj.index.bind(controllerObj);
            }

            actionMethod().then(() => console.log("Action completed"))
                .catch((err) => console.log(err));
        }
    }

    global.qwapp.QwProgram = QwProgram;
})(this);
