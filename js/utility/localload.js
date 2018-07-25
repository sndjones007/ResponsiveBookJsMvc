class LocalLoad {
    constructor() { }

    run(path, contentType, responseType) {
        var httpConnection = new XMLHttpRequest();
        httpConnection.open("GET", path, true);
        httpConnection.setRequestHeader("Content-Type", contentType);
        httpConnection.responseType = responseType;

        var promiseObj = new Promise((resolve, reject) => {
            httpConnection.onreadystatechange = () => {
                if (httpConnection.readyState === 4 && httpConnection.status === 200) {
                    resolve(httpConnection);
                }
            }
        });
        
        httpConnection.send(null);

        return promiseObj;
    }
}