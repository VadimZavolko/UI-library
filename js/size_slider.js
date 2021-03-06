const btnsNumber = document.querySelector('.buttons-number');
const carouselNumber = document.querySelectorAll('.carousel-number');
btnsNumber.onclick = () => {
    console.log(event.target);
    if(event.target.closest('.btn')){
        const btn = event.target;
        carouselNumber.forEach(item => {
            item.dataset.visible = btn.dataset.number;
            item.innerHTML = '';
        });
        new Carousel("carousel4", config1).addCarousel();
        new Carousel("carousel5", config1).addCarousel();
        new Carousel("carousel6", config1).addCarousel();
    }
}
