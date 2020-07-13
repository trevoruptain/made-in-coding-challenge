// Load Fonts

// const markProBold = new FontFace("BoldBold", "url('./fonts/MarkPro-BoldItalic.woff)");
// document.fonts.add(markProBold);

// Bind calls from popup

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let count = 0;

    switch(request.type) {
        case "initial":
            setup(request.payload);
            break;
        case "default-text":
            updateText(request.payload);
            break;
        case "font":
            updateFont(request.payload);
            break;
        case "text-transform":
            transformText(request.payload);
            break;
        case "style":
            applyStyle(request.payload);
            break;
        case "center":
            centerText(request.payload);
            break;
        case "click":
            handleClick(request.payload);
            break;
    }

    sendResponse(true);
});

// Render initial text nodes
const setup = global => {
    window.global = global;

    let width;
    let height;
    let ownWidth;
    let ownHeight;

    global.variations.forEach((variation, ord) => {
        const variationImages = document.querySelectorAll(`[data-id="${variation.id}"]`);

        for (let i = 0; i < variationImages.length; i++) {
            const currentImage = variationImages[i];
            const editableText = document.createElement('span');
            editableText.innerText = global.defaultText;
            editableText.setAttribute("id", `text-${ord + 1}-${i + 1}`);
            editableText.setAttribute("class", "editable-text");
            currentImage.appendChild(editableText);

            if (width === undefined) width = currentImage.children[0].width;
            if (height === undefined) height = currentImage.children[0].height;
            if (ownWidth === undefined) ownWidth = editableText.offsetWidth;
            if (ownHeight === undefined) ownHeight = editableText.offsetHeight;
            const initialX = width * 0.5 - ownWidth * 0.5;
            const initialY = -(height * 0.5 + ownHeight * 0.5);
            editableText.setAttribute("style", `font-size: 2vw !important; font-family: "mark-pro-normal"; transform: skew(0deg, 0deg) rotate(0deg); text-transform: none; display: inline-block; left: ${initialX}px; top: ${initialY}px; background: -webkit-linear-gradient(left, #000000, #000000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`);
        }
    });
};

// Update default text
const updateText = payload => {
    const textNodes = document.getElementsByClassName("editable-text");

    for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i];
        node.innerText = payload.newText;
        const offset = payload.offsets[i];

        const optionsHash = {
            productOrd: node.id.slice(5, 6),
            imageOrd: node.id.slice(7, 8),
            key: 'left',
            multiplier: parseInt(offset.x) / 100
        };

        centerText(optionsHash);

        optionsHash.key = 'top';
        optionsHash.multiplier = parseInt(offset.y) / 100;

        centerText(optionsHash);
    }
};

const updateFont = ({oldFont, newFont}) => {
    const textNodes = document.getElementsByClassName("editable-text");

    for (let i = 0; i < textNodes.length; i++) {
        const currentNode = textNodes[i];
        const styleString = currentNode.getAttribute("style");
        currentNode.setAttribute("style", styleString.replace(oldFont, newFont));
    }
};

const transformText = ({oldTransform, newTransform}) => {
    const textNodes = document.getElementsByClassName("editable-text");

    for (let i = 0; i < textNodes.length; i++) {
        const currentNode = textNodes[i];
        const styleString = currentNode.getAttribute("style");
        currentNode.setAttribute("style", styleString.replace(oldTransform, newTransform));
    }
};

const applyStyle = ({productOrd, imageOrd, key, val}) => {
    const id = `text-${productOrd}-${imageOrd}`;
    const target = document.getElementById(id);
    const currentStyles = target.getAttribute("style");
    const startIdx = currentStyles.search(key);
    let endIdx;

    for (let i = startIdx + key.length; i < currentStyles.length; i++) {
        if (currentStyles[i] === ";") {
            endIdx = i;
            break;
        }
    }

    const newStyle = currentStyles.slice(0, startIdx + key.length + 2) + val + currentStyles.slice(endIdx);
    target.setAttribute("style", newStyle);
};

const centerText = ({productOrd, imageOrd, key, multiplier}) => {
    const id = `text-${productOrd}-${imageOrd}`;
    const target = document.getElementById(id);
    const image = document.getElementsByClassName('js-variant-slider-img')[0];

    const rect = target.getBoundingClientRect();

    let val;

    if (key === "left") {
        val = (image.width - rect.width) * multiplier;
    } else {
        val = -(rect.height / 2) - ((image.height - rect.height) * multiplier);
    }

    applyStyle({productOrd, imageOrd, key, val: `${val}px`});
};

const handleClick = data => {
    switch(data.target) {
        case 'product':
            const productButtons = document.querySelectorAll('label.product-color-picker');
            productButtons[parseInt(data.ord) - 1].click();
            break;
        case 'image':
            const imageButtons = document.querySelectorAll('ul.slick-dots')[(parseInt(data.variantOrd) - 1) * 2].children;
            imageButtons[parseInt(data.imageOrd) - 1].click();
            break;
    }
};

// Replace default Engraving checkbox and control input

// document.getElementsByClassName("js-toggle-engraving-option")[0].remove();

// const checkbox = document.createElement("input");
// checkbox.setAttribute("type", "checkbox");
// checkbox.classList.add("input-checkbox", "checkbox-after");
// document.getElementsByClassName("option-wrapper-last")[0].children[0].appendChild(checkbox);

// const engravingText = document.getElementsByClassName("js-engraving-text")[0];
// engravingText.classList.add("hide");
// engravingText.children[0].removeAttribute("disabled");

// const price = document.getElementsByClassName("product-single__price")[0].children[0];

// checkbox.addEventListener("click", e => {
//     if (e.target.checked) {
//         engravingText.classList.remove("hide");
//         price.innerText = "$109";
//     } else {
//         engravingText.classList.add("hide");
//         price.innerText = "$89";
//     }
// });