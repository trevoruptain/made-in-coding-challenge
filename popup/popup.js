// import Global from "../generator/Global";
// import Variation from "../generator/Variation";
// import Text from "../generator/Text";

document.addEventListener("DOMContentLoaded", () => {
    bindPopupMenu();
    const global = new Global();
    generateDefaults(global);
});

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
};

const generateDefaults = (global) => {
    const productVariations = {
        "13596917104719": {
            id: "13596917104719",
            name: "pommeRed",
            count: 3,
            color: "#ff2323"
        },
        "21656462000207": {
            id: "21656462000207",
            name: "truffleBlack",
            count: 3,
            color: "#000000"
        },
        "12194240659535": {
            id: "21656462000207",
            name: "beauneGray",
            count: 3,
            color: "#dedede"
        }
    };

    for (id in productVariations) {
        const options = productVariations[id];
        const variation = new Variation(options);
        global.variations.push(variation);

        for (let i = 0; i < options.count; i++) {
            const text = new Text(variation.id, i);
            variation.children.push(text);
        }
    }

    bindPopup(global);
};

const bindPopup = global => {

}