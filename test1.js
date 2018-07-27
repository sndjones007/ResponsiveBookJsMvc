(function(g) {
    let p = new Promise((resolve, reject) => {
        //throw new Error("subhadeep");
        return "Hello";
    });

    p.then((val) => {
        console.log(val + " test");
    });
})(window);