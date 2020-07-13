class Text {
    constructor(variationOrd, imageOrd) {
        this.variationOrd = variationOrd;
        this.imageOrd = imageOrd;
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

    renderToDom(payload) {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, Object.assign({}, payload, {id: `text-${this.variationOrd}-${this.imageOrd}`}));
        });
    }
}