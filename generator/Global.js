class Global {
    constructor() {
        this.defaultText = 'clark griswold';
        this.font = 'Mark Pro';
        this.minify = false;
        this.textTransform = 'none';
        this.variations = [];
    }

    updateDefaultText(newText) {
        const centers = document.getElementsByClassName("center");
        const offsets = {};

        for (let i = 0; i < centers.length; i += 2) {
            offsets[i / 2] = {
                x: centers[i].value,
                y: centers[i + 1].value
            };
        }

        this.defaultText = newText;

        debugger;

        this.variations.forEach(variation => {
            variation.children.forEach(textNode => {
                textNode.renderToDom({type: 'default-text', payload: {newText, offsets}});
            });
        });
    }
}