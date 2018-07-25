class CoverPageController {
    constructor(template, model) {
        this.template = template;
        this.model = model;
    }

    index(params) {
        var rootel = document.getElementsByTagName("qwapp");
        var utility = new Utility();
        utility.loadTemplate(template, (doc) => {
            var model = new CoverPageModel();
            rootel.innerHTML = utility.getHtml(doc, model.data);
        });
    }
}