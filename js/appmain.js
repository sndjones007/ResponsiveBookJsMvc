(function(global) {
    class AppMain {
        constructor(){}
        init() {
            console.log('Application loaded at ' + Date.toString());

            let program = new global.qwapp.QwProgram();
            program.init().then(() => {
                program.execute.bind(program)();
            }).catch((err) => console.log(err));
        }
    }
    global.qwapp.AppMain = AppMain;
})(this);
