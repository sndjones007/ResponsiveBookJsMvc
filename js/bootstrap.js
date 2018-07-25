(function(global){

    global.qwapp = {};
    global.qwapp.Config = {};

    class AutoBindMethod {
        static execute(thisObj) {
            Object.getOwnPropertyNames(thisObj)
                  .filter((prop) => {
                    if(typeof thisObj[prop] == 'function') {
                        thisObj.prop = thisObj.prop.bind(thisObj);
                    }
                  });
        }
    }

    global.qwapp.AutoBindMethod = AutoBindMethod;

    class PathHelper {

        static getDataPath(fileName) {
            return window.location.href + global.qwapp.Config.PATH.JSON_DATA_FOLDER +
                fileName;
        }

        static getControllerPath(fileName) {
            return window.location.href + global.qwapp.Config.PATH.CONTROLLER_FOLDER +
                fileName;
        }

        static getJsLibPath(fileName) {
            return window.location.href + global.qwapp.Config.PATH.LIB_FOLDER +
                fileName;
        }

        static getJsHomePath(fileName) {
            return window.location.href + global.qwapp.Config.JS_FOLDER +
                fileName;
        }

        static getModelPath(fileName) {
            return window.location.href + global.qwapp.Config.PATH.MODEL_FOLDER +
                fileName;
        }

        static getRouterPath(fileName) {
            return window.location.href + global.qwapp.Config.PATH.ROUTER_FOLDER +
                fileName;
        }

        static getViewPath(fileName) {
            return window.location.href + global.qwapp.Config.PATH.VIEW_FOLDER +
                fileName;
        }

        static getMetadataPath() {
            return window.location.href + "metadata.json";
        }
    }

    global.qwapp.PathHelper = PathHelper;

    class LocalLoad {
        constructor() { }
    
        anyfile(path, contentType, responseType) {
            var httpConnection = new XMLHttpRequest();
            httpConnection.open("GET", path, true);
            httpConnection.setRequestHeader("Content-Type", contentType);
            httpConnection.responseType = responseType;
    
            var promiseObj = new Promise((resolve, reject) => {
                httpConnection.onreadystatechange = () => {
                    if (httpConnection.readyState === 4) {
                        if (httpConnection.status === 200) {  
                            console.log(httpConnection.response);
                            resolve(httpConnection);
                        } else {  
                            console.log(`Error (${httpConnection.statusText}) in Loading of ${path} `);
                            throw new Error(httpConnection.statusText);
                        }
                    }
                }
            });
            
            httpConnection.send(null);
    
            return promiseObj.then(xhr => {
                    console.log(`Got load response of ${path}`);
                    console.log(xhr.response);
                    return xhr.response;
                }).catch((err) => console.log(err));
        }

        jsonFile(path) {
            return this.anyfile(path, "application/json", "json");
        }

        htmlFile(path) {
            return this.anyfile(path, "text/html", "text");
        }
    }

    class ScriptLoad {
        constructor() {
            global.qwapp.AutoBindMethod.execute(this);
        }

        script(jsrelfile) {
            var script = document.createElement("script");
            script.type = "application/javascript";
    
            var promiseObj = new Promise((resolve, reject) => {
                script.onload = () => resolve();
            });
    
            document.getElementsByTagName('head')[0].appendChild(script);
            script.src = this.getScriptSrc(jsrelfile);
    
            return promiseObj;
        }

        getScriptSrc(filePath) {
            return filePath + "?" + Date.now();
        }
    }

    let onLoadConfig = async function() {
        console.log('Loading the config at ' + Date.now());

        let jsonLoader = new LocalLoad();
        return jsonLoader.jsonFile(global.qwapp.PathHelper.getMetadataPath());
    }

    let onLoadBootstrap = async function() {
        console.log('Bootstrapping Application at ' + Date.now());
        
        let jsonLoader = new LocalLoad();
        let scriptsjs = await jsonLoader.jsonFile(
            global.qwapp.PathHelper.getDataPath(
                global.qwapp.Config.GENERIC_SCRIPT_LOAD_FILE
            )
        );

        let i = 0;
        let promises = [];
        let scriptLoader = new ScriptLoad();
        for(; i < scriptsjs.javascript.length; ++i) {
            promises.push(scriptLoader.script(
                global.qwapp.PathHelper.getJsHomePath(scriptsjs.javascript[i])));
        }

        Promise.all(promises)
        .then(() => new global.qwapp.AppMain().init())
        .catch((err) => console.log(err));
    }

    global.qwapp.LocalLoad = LocalLoad;
    global.qwapp.ScriptLoad = ScriptLoad;

    global.addEventListener("load", function(event) {
        onLoadConfig().then((jsconfig) => {
            global.qwapp.Config = Object.assign(global.qwapp.Config, jsconfig);
            onLoadBootstrap();
        }).catch((err) => console.log(err));
    });
})(this);