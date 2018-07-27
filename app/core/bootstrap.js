/**
 * @file This file should always be included in the start html file to load the application.
 * @author S N DJones <sndjones007@gmail.com>
 * @copyright Whatever copyright you want you can add
 */

/**
 * This partial block is used to initialize the basiuc minimum types required for bootstrapping
 * and starting the application
 */
(function (global) {

    /**
     * Define the doument.currentScript propetry if not defined
     */
    document.currentScript = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    /**
     * Declare the global app namespace
     */
    global.qwapp = {};
    let app = global.qwapp;

    /**
     * Read the arguments passed to the bootstrap script tag
     */
    let debugVal = document.currentScript.getAttribute('debug');

    app.Debug = (debugVal && (debugVal === "" || +debugVal > 0));

    /**
     * Define the logging base for the application
     */
    app.Log = app.Debug ? console.log.bind(console) : () => { };
    app.DLog = app.Debug ? console.debug.bind(console) : () => { };
    app.ELog = console.error.bind(console);

    /**
    * A global method to define a class type. It internally merges any existing
    * same class definitions into simple type. This tries to implement the
    * concept of 'partial' in C#.
    * If no pre-existing type is found it defines the type under the app
    * namespace.
    */
    global.qwDefine = function (typeObj) {
        //app[typeObj.name] = Object.assign(typeObj.prototype, app[typeObj]);
        if(global.qwapp[typeObj.name]) {
        Object.getOwnPropertyNames(typeObj)
                    .filter((prop) => {
                        if (typeof typeObj[prop] == 'function') {
                            global.qwapp[typeObj.name].prop = typeObj.prop;
                        }
                    });
                }
                else {
                    global.qwapp[typeObj.name] = typeObj;
                }
    }

    /**
     * Class used to bind the this pointer to the funtions of the class objects.
     * This is required for specifically callback and async methods.
     */
    global.qwDefine(
        class AutoBind {

            /**
             * Bind the this pointer to the method using bind() method call
             * and create a new property with the same name.
             * @param {any} thisObj
             */
            static execute(thisObj) {
                Object.getOwnPropertyNames(thisObj)
                    .filter((prop) => {
                        if (typeof thisObj[prop] == 'function') {
                            thisObj.prop = thisObj.prop.bind(thisObj);
                        }
                    });
            }
        }
    );

    /**
     * Class to help create the path for a resource in this application
     * A partial implementation
     */
    global.qwDefine(
        class PathHelper {

            /**
             * Get the metdata file which contains all the basic data for the data.
            * It is equivalent to a config file or constants defined globally
            */
            static getMetadataPath() {
                return new URL("metadata.json", `${global.location.protocol}//${global.location.host}`).href;
            }
        }
    );

    /**
     * Class to load a local file
     */
    global.qwDefine(
        class LocalLoad {

            constructor(){}

            /**
             * Method to load any file (async mode)
             * @param {string} path Specifies the path of the file (Relative path or full path)
             * @param {string} contentType The type similar to the meta tag content-type
             * @param {string} responseType The response type to pass as parameter to XMLHttpRequest
             * @returns {number} Returns response data wrapped in Promise object
             */
            anyfile(path, contentType, responseType) {
                var httpConnection = new XMLHttpRequest();
                httpConnection.open("GET", path, true);
                httpConnection.setRequestHeader("Content-Type", contentType);
                httpConnection.responseType = responseType;

                // Create the promise
                var promiseObj = new Promise((resolve, reject) => {
                    httpConnection.onreadystatechange = () => {
                        if (httpConnection.readyState === 4) {
                            if (httpConnection.status === 200) {
                                app.Log(httpConnection.response);
                                resolve(httpConnection);
                            } else {
                                app.ELog(`Error (${httpConnection.statusText}) in Loading of ${path} `);
                                throw new Error(httpConnection.statusText);
                            }
                        }
                    }
                });

                httpConnection.send(null);

                return promiseObj.then(xhr => {
                    app.Log(`Got load response of ${path}`);
                    app.Log(xhr.response);
                    return xhr.response;
                });
            }

            /**
             * Method to read Json File
             * @param {string} path 
             * @returns {number} Returns json response data wrapped in Promise object
             */
            jsonFile(path) {
                return this.anyfile(path, "application/json", "json");
            }

            /**
             * Method to read html File
             * @param {string} path 
             * @returns {number} Returns html response data wrapped in Promise object
             */
            htmlFile(path) {
                return this.anyfile(path, "text/html", "text");
            }
        }
    );

    /**
     * Class which helps checking, loading a script dynamically
     */
    global.qwDefine(
        class ScriptLoad {
            
            /**
             * Method to append and load script to the html file at the end of 
             * head tag
             * @param {string} jsrelfile 
             */
            script(sfile) {
                if(scriptIsLoaded(sfile)) return;

                let script = document.createElement("script");
                script.type = "application/javascript";
        
                let promiseObj = new Promise((resolve, reject) => {
                    script.onload = () => resolve();
                });
        
                document.getElementsByTagName('head')[0].appendChild(script);
                script.src = this.getScriptSrc(sfile);
        
                return promiseObj;
            }

            /**
             * Check if the script is already loaded or not
             * @param {string} sfile 
             */
            scriptIsLoaded(sfile) {
                return document.querySelector(`script[src^='${sfile}']`);
            }

            /**
             * 
             * @param {*} filePath 
             */
            getScriptSrc(filePath) {
                return filePath + "?" + Date.now();
            }
        }
    );

    /**
     * Method to load config file which also acts as a constant
     */
    let onLoadConfig = async function() {
        console.log('Loading the config at ' + typeof app.LocalLoad + ' ' + Date.now());

        let jsonLoader = new app.LocalLoad();
        return jsonLoader.jsonFile(global.qwapp.PathHelper.getMetadataPath());
    }

    /**
     * Method to prepare the index.html file for startup on load.
     * Add scripts at runtime if the scripts are not already loaded
     */
    let onLoadBootstrap = async function() {
        console.log('Bootstrapping Application at ' + Date.now());
        
        let jsonLoader = new app.LocalLoad();
        let scriptsjs = await jsonLoader.jsonFile(
            global.qwapp.PathHelper.getDataPath(
                global.qwapp.Config.GENERIC_SCRIPT_LOAD_FILE
            )
        );

        let i = 0;
        let promises = [];
        let scriptLoader = new app.ScriptLoad();
        for(; i < scriptsjs.javascript.length; ++i) {
            promises.push(scriptLoader.script(
                global.qwapp.PathHelper.getJsHomePath(scriptsjs.javascript[i])));
        }

        Promise.all(promises)
        .then(() => new global.qwapp.AppMain().init())
        .catch((err) => console.error(err));
    }

    /**
     * Method to handle 'load' event
     */
    global.addEventListener("load", function(event) {
        onLoadConfig().then((jsconfig) => {
            global.qwapp.Config = Object.assign(global.qwapp.Config, jsconfig);
            onLoadBootstrap();
        }).catch((err) => console.error(err));
    });

})(window);