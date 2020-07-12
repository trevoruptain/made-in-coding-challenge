// Replace default Engraving checkbox

document.getElementsByClassName('js-toggle-engraving-option')[0].remove();

const checkbox = document.createElement('input');
checkbox.setAttribute('type', 'checkbox');
checkbox.classList.add('input-checkbox', 'checkbox-after');
const engravingLabel = document.getElementsByClassName('option-wrapper-last')[0].children[0];
engravingLabel.appendChild(checkbox);

const engravingText = document.getElementsByClassName('js-engraving-text')[0];
engravingText.classList.add('hide');
engravingText.children[0].removeAttribute('disabled');

const price = document.getElementsByClassName('product-single__price')[0].children[0];

checkbox.addEventListener('click', e => {
    e.stopPropagation();

    if (e.target.checked) {
        engravingText.classList.remove('hide');
        price.innerText = '$109';
    } else {
        engravingText.classList.add('hide');
        price.innerText = '$89';
    }
});