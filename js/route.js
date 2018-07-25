class Route {
    constructor(uri, controller, action, paramArray) {
        this.uri = uri;
        this.controller = controller;
        this.action = action;
        this.paramArray = paramArray;
    }

    relayToController(params) {
        this.controller[this.action](params);
    }
};

class Router {
    constructor(routes) {
        this.routes = routes;
        this.UrlParts = null;
        this.currentRoute = null;
    }

    map() {
        this.UrlParts = new URL(location.href);
        var pathnames = this.UrlParts.pathname.split("/").filter((val) => val);

        if(pathnames && pathnames.length > 0) {
            this.currentRoute = this.routes.find((item) => item.path.toUpperCase() === pathnames[0].toUpperCase());
        }
        else {
            this.currentRoute = this.routes.find(item => item.path.toUpperCase() === "cover".toUpperCase());
        }

        return;
    }
}