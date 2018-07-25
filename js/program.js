class QwProgram {
    constructor() {
        var loadRouteJson = new LocalLoad();
        this.appRoutes = loadRouteJson.run("./data/routedata.json", "application/json", "json")
            .then(xhr => {
                console.log('Got load response of route json ');
                console.log(xhr.response);
                return xhr.response;
            }).catch((err) => console.log(err));
        this.router = null;
    }

    async init() {
        var routesJsonData = await this.appRoutes;

        console.log("Call router to resolve");
        this.router = new Router(routesJsonData.routes);
    }

    async execute() {
        this.router.map();
    }
}