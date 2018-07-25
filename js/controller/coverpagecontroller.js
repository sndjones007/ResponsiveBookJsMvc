(function(global){
    class CoverPageController {
        constructor(route) {
            this.route = route;
            global.qwapp.AutoBindMethod.execute(this);
        }
    
        async index(params) {
            let rootel = document.getElementsByTagName(global.qwapp.Config.BOOTSTRAP_TAG);
            let load = new global.qwapp.LocalLoad();
            let bindThis = this;
            let templateLoad = load.htmlFile(window.location.href + global.qwapp.Config.JS_FODLER +
                global.qwapp.Config.getTemplatePath(bindThis.route.controller.toLowerCase()));

            templateLoad.then((template) => {
                let modelClass = global.qwapp[global.qwapp.Config.getModelClass(bindThis.route.controller)];
                let modelObj = new modelClass();
                //rootel.innerHTML = utility.getHtml(template, modelObj.data);
            }).catch((err) => console.log(err));
        }
    }
    
    global.qwapp.CoverPageController = CoverPageController;
})(this);