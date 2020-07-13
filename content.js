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
            // applyStyle();
            break;
        case "click":
            handleClick(request.payload);
            break;
    }

    sendResponse(true);
});

// Render initial text nodes
const setup = global => {
    let width;
    let height;
    let ownWidth;
    let ownHeight;

    global.variations.forEach(variation => {
        const variationImages = document.querySelectorAll(`[data-id="${variation.id}"]`);

        for (let i = 0; i < variationImages.length; i++) {
            const currentImage = variationImages[i];
            const editableText = document.createElement('span');
            editableText.innerText = global.defaultText;
            editableText.setAttribute("id", `text-${variation.id}-${i + 1}`);
            editableText.setAttribute("class", "editable-text");
            currentImage.appendChild(editableText);

            if (width === undefined) width = currentImage.children[0].width;
            if (height === undefined) height = currentImage.children[0].height;
            if (ownWidth === undefined) ownWidth = editableText.offsetWidth;
            if (ownHeight === undefined) ownHeight = editableText.offsetHeight;
            const initialX = width / 2 - ownWidth / 2;
            const initialY = -(height / 2 + ownHeight / 2);
            editableText.setAttribute("style", `font-size: 2vw; font-family: "mark-pro-normal"; text-transform: none; left: ${initialX}px; top: ${initialY}px;`);
        }
    });
};

// Update default text
const updateText = newText => {
    const textNodes = document.getElementsByClassName("editable-text");

    for (let i = 0; i < textNodes.length; i++) {
        textNodes[i].innerText = newText;
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