const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
const burgerLogo = document.querySelector('.burger i');
burger.onclick = () => {
    navMenu.classList.toggle('nav-menu-block');
    burgerLogo.classList.toggle('fa-bars');
    burgerLogo.classList.toggle('fa-times');
    burger.classList.toggle('burger-close');
};