(function(global, app) {

    /**
     * Class which helps with the naming conventions in this program
     */
    app.qwDefine(
        class NameHelper {

            /**
             * Convert the controller name present in the route data file to
             * camel case
             * @param {string} name 
             */
            static getControllerName(name) {
                let splitArr = name.split("_");
                this.capitalizeFirstLetter(splitArr);
                return `${splitArr.join("")}Controller`;
            }

            /**
             * Convert the controller name present in the route data file to
             * camel case for model
             * @param {string} name 
             */
            static getModelName(name) {
                let splitArr = name.split("_");
                this.capitalizeFirstLetter(splitArr);
                return `${splitArr.join("")}Model`;
            }

            /**
             * Replace the first character to upper case
             * @param {string} name 
             */
            static capitalizeFirstLetter(splitArr) {
                for(let i = 0; i < splitArr.length; ++i)
                    splitArr[i] = splitArr[i][0].toUpperCase() + splitArr[i].slice(1);
            }
        }
    );
})(window, window.qwapp);