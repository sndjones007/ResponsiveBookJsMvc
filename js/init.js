(function(global){
    global.addEventListener("load", function(event) {
        console.log('Application loaded at ' + Date.now());
        var program = new QwProgram();
        program.init();
        program.execute();
    });
})(this);
