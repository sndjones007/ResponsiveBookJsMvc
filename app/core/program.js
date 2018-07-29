(function (global, app) {

    /**
     * The program class which is invoked from the application class
     */
    app.qwDefine(
        class QwProgram {

            /**
             * Constructor
             */
            constructor() {
                this.router = null;
                this.scriptsjs = null;
                app.AutoBind.execute(this);
            }

            /**
             * Initialize the program. The route data is loaded.
             */
            async init() {
                let routesJsonData = await app.LocalLoad.jsonFile(
                    app.PathHelper.getPath(app.Config.ROUTE_INFO_FILE));

                app.Log("Call router to resolve");
                routesJsonData.routes.forEach(item => {
                    item.path = item.path.toLowerCase();
                    item.controller = item.controller.toLowerCase();
                    item.action = item.action.toLowerCase();
                });
                this.router = new app.Router(routesJsonData.routes);
            }

            /**
             * Execute the program
             */
            async execute() {
                this.router.map();
                await this.scriptLoader()
                    .then(() => this.invokeController())
                    .catch((err) => app.ELog(err));
            }

            /**
             * Load the page scripts related to the controller path
             */
            async scriptLoader() {
                let promises = [];

                // Add css files
                for(let i = 0; i < app.Config.CSS.VIEW.length; ++i) {
                    promises.push(app.ScriptLoad.addCssLink(app.PathHelper.getPath(
                        app.Config.CSS.VIEW[i]), false));
                }

                // Add external libs files
                for(let i = 0; i < app.Config.JS.VIEW.length; ++i) {
                    promises.push(app.ScriptLoad.addScript(app.PathHelper.getPath(
                        app.Config.JS.VIEW[i]), false));
                }

                if(this.router.currentRoute.controller == null)
                    throw new app.QwError(false, "No Script defined for current route");

                promises.push(app.ScriptLoad.addScript(app.PathHelper.getControllerPath(
                    this.router.currentRoute.controller)));
                
                if(this.router.currentRoute.model)
                    promises.push(app.ScriptLoad.addScript(app.PathHelper.getModelPath(
                        this.router.currentRoute.controller), false, true));

                // for(let i = 0; i < promises.length; ++i) {
                //     await promises[i].then(() => 1);
                // }

                //return app.promiseSerial(promises);
                return Promise.all(promises);
            }

            /**
             * After the scripts are loaded, call the controller
             */
            invokeController() {
                if (this.router.redirected) return;

                let route = this.router.currentRoute;
                let controllerClassName = app.NameHelper.getControllerName(this.router.currentRoute.controller);
                let controllerClass = app[controllerClassName];
                let controllerObj = new controllerClass(route);

                let actionMethod = null;
                if (route.action) {
                    actionMethod = controllerObj[route.action];
                }
                else {
                    actionMethod = controllerObj.index;
                }

                actionMethod().then(async () => app.Log("Action completed"))
                    .catch((err) => app.ELog(err));
            }
        }
    );
    
})(window, window.qwapp);
