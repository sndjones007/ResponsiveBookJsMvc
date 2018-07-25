class Utility {
    constructor() { }

    loadTemplate(template, callback) {
        var httpConnection = new XMLHttpRequest();
        httpConnection.open("GET", "../../template/" + template, true);
        httpConnection.setRequestHeader("Content-Type", "text/html");
        httpConnection.responseType = "text";
        httpConnection.onload = function (e) {
            var doc = httpConnection.responseXML;
            callback(doc);
        };
        httpConnection.send(null);
    }

    loadModel(model, callback) {
        var httpConnection = new XMLHttpRequest();
        httpConnection.open("GET", "../../mode/" + model, true);
        httpConnection.setRequestHeader("Content-Type", "application/json");
        httpConnection.responseType = "json";
        httpConnection.onload = function (e) {
            var doc = httpConnection.responseText;
            callback(doc);
        };
        httpConnection.send(null);
    }

    getHtml(doc, jsonModel) {
        return Mustache.render(doc, jsonModel);
    }
}