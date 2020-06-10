const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
const burgerLogo = document.querySelector('.burger i');

const replaceActiveIcon = (burgerLogo) => {
    burgerLogo.classList.toggle('fa-bars');
    burgerLogo.classList.toggle('fa-times');
}

burger.onclick = () => {
    replaceActiveIcon(burgerLogo);
    navMenu.classList.toggle('nav-menu-block');
    burger.classList.toggle('burger-close');
};


