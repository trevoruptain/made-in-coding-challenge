document.addEventListener("DOMContentLoaded", () => {
    bindNavMenu();
});

const bindNavMenu = () => {
    const nav = document.getElementsByTagName('nav')[0];

    nav.addEventListener('click', e => {
        e.preventDefault();
        const menuName = e.target.dataset.menu;

        if (menuName !== undefined) {
            const currentMenu = document.getElementsByClassName('active')[0];
            currentMenu.classList.remove('active');
            currentMenu.classList.add('hidden');

            const nextMenu = document.getElementById(menuName);
            nextMenu.classList.add('active');
            nextMenu.classList.remove('hidden');
        }
    });
};