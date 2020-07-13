class Text {
    constructor(variationId, ord) {
        this.variationId = variationId;
        this.ord = ord;
        this.engraving = 'clark griswold';

        this.styles = {
            colorFrom: '#000000',
            colorTo: '#000000',
            centerX: 50,
            centerY: 50,
            skewX: 0,
            skewY: 0,
            rotate: 0
        };
    }

    findCenter(parentHeight, parentWidth) {

    }

    generateStyles() {

    }

    renderToDom(options) {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, Object.assign({}, options, {id: `text-${this.variationId}-${this.ord}`}));
        });
    }

    recalulateAndMove() {

    }
}