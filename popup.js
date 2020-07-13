const PRODUCT_VARIATIONS = {
    "1": {
        id: "13596917104719",
        name: "pommeRed",
        count: 3,
        color: "#ff2323"
    },
    "2": {
        id: "21656462000207",
        name: "truffleBlack",
        count: 3,
        color: "#000000"
    },
    "3": {
        id: "12194240659535",
        name: "beauneGray",
        count: 3,
        color: "#dedede"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const global = new Global();
    generateDefaults(global);
    bindPopup(global);
});

const generateDefaults = global => {
    for (id in PRODUCT_VARIATIONS) {
        const options = PRODUCT_VARIATIONS[id];
        const variation = new Variation(options);
        global.variations.push(variation);

        for (let i = 0; i < options.count; i++) {
            const text = new Text(id, i + 1);
            variation.children.push(text);
        }
    }

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'initial', payload: global});
    });
};

const bindPopup = global => {
    bindPopupMenu();
    bindGlobalSettings(global);
    bindExport(global);
    bindVariationEdit(global);
}

const bindPopupMenu = () => {
    const nav = document.getElementsByTagName("nav")[0];

    nav.addEventListener("click", e => {
        e.preventDefault();
        const menuName = e.target.dataset.menu;

        if (menuName !== undefined) {
            const currentMenu = document.getElementsByClassName("active")[0];
            currentMenu.classList.remove("active");
            currentMenu.classList.add("hidden");

            const nextMenu = document.getElementById(menuName);
            nextMenu.classList.add("active");
            nextMenu.classList.remove("hidden");
        }
    });

    nav.children[0].addEventListener("click", e => {
        const ord = e.target.dataset.menu.slice(8, 9);

        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'click', payload: { target: 'product', ord }});
        });
    });

    const imageSelection = document.getElementsByTagName("select");

    Array.from(imageSelection).forEach(selector => {
        selector.addEventListener("change", e => {
            // Toggle text node edit menu
            const siblings = e.target.parentNode.children;

            Array.from(siblings).forEach(sibling => {
                if (sibling.tagName === "DIV" && sibling.id !== "radio") {
                    sibling.classList.add("hidden");
                }
            });

            // Click corresponding image on page
            const variantOrd = e.target.dataset.ord;
            let imageOrd;

            for (let i = 0; i < 3; i++) {
                const option = e.target.children[i];
                if (option.selected) {
                    imageOrd = i + 1;
                    
                    const id = `product-${variantOrd}-image-${imageOrd}`;
                    const menu = document.getElementById(id);
                    menu.classList.remove("hidden");
                }
            }

            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'click', payload: { target: 'image', variantOrd, imageOrd }});
            });
        });
    });
};

const bindGlobalSettings = global => {
    const defaultText = document.getElementById("default-text");

    defaultText.addEventListener("input", e => {
        if (e.target.value === "") {
            global.updateDefaultText("clark griswold");
        } else {
            global.updateDefaultText(e.target.value);
        }
    });

    const font = document.getElementById("font");
    let oldFont = font.value;

    font.addEventListener("change", e => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'font', payload: {oldFont, newFont: e.target.value}});
            oldFont = e.target.value;
        });
    });

    const radioButtons = document.getElementById("radio");
    let oldTransform = 'none';

    radio.addEventListener("click", e => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'text-transform', payload: {oldTransform, newTransform: e.target.value}});
            oldTransform = e.target.value;
        });
    });
};

const bindVariationEdit = global => {
    const includes = document.getElementsByClassName('include');

    Array.from(includes).forEach(checkbox => {
        const styleObj = {key: 'display'};

        checkbox.addEventListener("click", e => {
            const dataset = e.target.parentNode.parentNode.dataset;
            styleObj["productOrd"] = dataset.product
            styleObj["imageOrd"] = dataset.image;

            if (e.target.checked) {
                styleObj["val"] = "inline-block";
            } else {
                styleObj["val"] = "none";
            }
            
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'style', payload: styleObj});
            });
        });
    });

    const fontSize = document.getElementsByClassName('font-size');

    Array.from(fontSize).forEach(input => {
        const styleObj = {key: 'font-size'};

        input.addEventListener("click", e => {
            const dataset = e.target.parentNode.dataset;
            styleObj["productOrd"] = dataset.product
            styleObj["imageOrd"] = dataset.image;
            styleObj["val"] = `${e.target.value}vw !important`;
            
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'style', payload: styleObj});
            });
        });
    });

    const color = document.querySelectorAll('input[type="color"]');

    Array.from(color).forEach(input => {
        const styleObj = {key: 'background'};

        input.addEventListener("change", e => {
            const dataset = e.target.parentNode.dataset;
            styleObj["productOrd"] = dataset.product
            styleObj["imageOrd"] = dataset.image;
            let from;
            let to;

            if (e.target.name === "variation-color-from") {
                from = e.target.value;
                to = e.target.nextElementSibling.value;
            } else if (e.target.name === "variation-color-to") {
                from = e.target.previousElementSibling.value;
                to = e.target.value;
            }

            styleObj["val"] = `-webkit-linear-gradient(left, ${from}, ${to})`;
            
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'style', payload: styleObj});
            });
        });
    });

    const centerPos = document.getElementsByClassName("center");

    Array.from(centerPos).forEach(input => {
        input.addEventListener("change", e => {
            const dataset = e.target.parentNode.dataset;
            const key = e.target.dataset.dir === "x" ? "left" : "top";
            const styleObj = {key};
            styleObj["productOrd"] = dataset.product
            styleObj["imageOrd"] = dataset.image;
            styleObj["multiplier"] = e.target.value / 100;
            
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'center', payload: styleObj});
            });
        });
    });

    const skew = document.getElementsByClassName("skew");

    Array.from(skew).forEach(input => {
        input.addEventListener("change", e => {
            const dataset = e.target.parentNode.dataset;
            const key = "transform";
            const styleObj = {key};
            styleObj["productOrd"] = dataset.product
            styleObj["imageOrd"] = dataset.image;

            let skewX;
            let skewY;
            let rotate;

            if (e.target.dataset.skew === "x") {
                skewX = e.target.value;
                skewY = e.target.nextElementSibling.nextElementSibling.value;
                rotate = e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value;
            } else if (e.target.dataset.skew === "y") {
                skewX = e.target.previousElementSibling.previousElementSibling.value;
                skewY = e.target.value;
                rotate = e.target.nextElementSibling.nextElementSibling.value;
            } else {
                skewX = e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.value;
                skewY = e.target.previousElementSibling.previousElementSibling.value;
                rotate = e.target.value;
            }

            styleObj["val"] = `skew(${skewX}deg, ${skewY}deg) rotate(${rotate}deg)`;
            
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'style', payload: styleObj});
            });
        });
    });
};

const bindExport = global => {

};