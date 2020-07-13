class Global {
    constructor() {
        this.defaultText = 'clark griswold';
        this.font = 'Mark Pro';
        this.minify = false;
        this.textTransform = 'none';
        this.variations = [];
    }

    updateDefaultText(newText) {
        this.defaultText = newText;

        this.variations.forEach(variation => {
            variation.children.forEach(textNode => {
                textNode.renderToDom({type: 'default-text', payload: newText});
            });
        });
    }
}