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
            const text = new Text(variation.id, i);
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
            const variantOrd = e.target.dataset.ord;
            let imageOrd;

            debugger;

            for (let i = 0; i < 3; i++) {
                if (e.target.children[i].selected) imageOrd = i + 1;
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

const bindExport = global => {

};

const bindVariationEdit = global => {

};