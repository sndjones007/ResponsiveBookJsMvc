(function (global, app) {

    /**
     * Class to help create the path for a resource in this application
     * A partial implementation
     */
    app.qwDefine(
        class PathHelper {

            /**
             * Get the path for the controller javascript
             */
            static getControllerPath(name) {
                return new URL(`app/modules/${name}/${name}_controller.js`, `${global.location.protocol}//${global.location.host}`).href;
            }

            /**
             * Get the path for the controller javascript
             */
            static getModelPath(controller_name) {
                return new URL(`app/modules/${name}/${name}_model.js`, `${global.location.protocol}//${global.location.host}`).href;
            }

            /**
             * Get the html template path
             * @param {string} name 
             */
            static getHtmlPath(name) {
                return new URL(`app/modules/${name}/${name}.html`, `${global.location.protocol}//${global.location.host}`).href;
            }

            /**
             * Get the file from the path.
             * It is equivalent to a config file or constants defined globally
             */
            static getPath(fs) {
                return new URL(fs, `${global.location.protocol}//${global.location.host}`).href;
            }
        } 
    );
})(window, window.qwapp);