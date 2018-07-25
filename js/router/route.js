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

class UrlParts {
    constructor() {
        this.protocol = this.host = this.path = "";
        this.queryParams = null;
    }

    parse() {
        this.protocol = location.protocol;
        this.host = location.host;
        this.path = location.pathname;

        if(location.search) {
            this.queryParams = new URLSearchParams(location.search);
        }
    }
}

class Router {
    constructor(routes) {
        this.routes = routes;
        this.UrlParts = null;
    }

    map() {
        this.UrlParts = new Url(location.href);
        var pathnames = this.UrlParts.pathname.split("/");

        if(pathnames && pathnames.length > 0) {
            var route = this.routes.some(item => item.path.localeCompare(pathnames[0]));
            window.controllers[route.controller].relayToController(params);
        }

        console.error(`Unknown path ${path}`);

        return;
    }
}