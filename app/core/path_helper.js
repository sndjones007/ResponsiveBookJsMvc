(function (global, app) {

    global.qwDefine(
        /**
         * Class to help create the path for a resource in this application
         * A partial implementation
         */
        class PathHelper {

            /**
                * Get the metdata file which contains all the basic data for the data.
            * It is equivalent to a config file or constants defined globally
                */
            static getMetadataPath() {
                return `${global.location.protocol}//${global.location.host}/metadata.json`;
            }
        }
    );

})(window, window.qwapp);