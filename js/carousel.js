const config1 = ["https://loremflickr.com/320/240/dog", "https://loremflickr.com/g/320/240/paris",
 "https://loremflickr.com/320/240/paris,girl/all", "https://loremflickr.com/320/240/dog", "https://loremflickr.com/g/320/240/paris",
 "https://loremflickr.com/320/240/paris,girl/all", "https://loremflickr.com/320/240/dog", "https://loremflickr.com/g/320/240/paris",
 "https://loremflickr.com/320/240/paris,girl/all"];



class Carousel {
    constructor(id, config = []){
        this.id = id;
        this.config = config;
        this.carousel = document.querySelector(`#${this.id}`);
        this.n = parseInt(this.carousel.dataset.visible);
        this.baseWidth = parseInt(this.carousel.dataset.basewidth);
        this.typeWidth = this.carousel.dataset.typeWidth;
        this.btnLeft = document.createElement('button');
        this.btnRight = document.createElement('button');
        this.iL = document.createElement('i');
        this.iR = document.createElement('i');
        this.wrpBtnCircle = document.createElement('div');
    }
    
    addCarousel() {
        this.calcCarouselWidth();
        this.setImg();
        this.createBtn();
        this.activeButton();
    }

    calcCarouselWidth() {
        this.carousel.style.width = this.baseWidth * this.n + this.typeWidth;
    }

    setImgInUl(ul){
        this.config.forEach((item, index) => {
            const li = document.createElement('li'),
                img = document.createElement('img');

            img.setAttribute('src', `${item}`);
            img.setAttribute('alt', `${index}`);
            li.setAttribute('class', 'carousel-item');
            img.setAttribute('class', 'carousel-img');

            li.appendChild(img)
            ul.appendChild(li);
        });
    }

    setWigthUl(ul){
        ul.style.width= `${(this.config.length * 100) / this.n}%`;
    }

    setImg(){
        const ul = document.createElement('ul'),
            wrp = document.createElement('div');

        wrp.setAttribute('class', 'wrp');
        ul.setAttribute('class', 'carousel-list');
        this.setWigthUl(ul);
        wrp.appendChild(ul);

        this.setImgInUl(ul);
        this.carousel.appendChild(wrp);
    }    
    
    calculateButtonWidth(){
        return this.typeWidth === '%' ? 15 + this.typeWidth : ((this.baseWidth * 15) / 100) + this.typeWidth;
    }

    calculateButtonShift(){
        return this.typeWidth === '%' ? -12 + this.typeWidth : -((this.baseWidth * 12) / 100) + this.typeWidth;
    }

    createBtn(){
        const typeButton = this.carousel.dataset.button,
            shift = this.calculateButtonShift(),
            width = this.calculateButtonWidth();
        this.btnLeft = document.createElement('button');
        this.btnRight = document.createElement('button');

        this.setButton(shift, width, typeButton);

        this.addButton(typeButton);
    }

    setBtnTypeButton(width, shift) {
        this.iR.setAttribute('class', 'fas fa-caret-up');
        this.iL.setAttribute('class', 'fas fa-caret-up');
        this.btnLeft.setAttribute('class', 'btn-left btn');
        this.btnLeft.style.transform = 'scale(0)';
        this.btnRight.setAttribute('class', 'btn-right btn');
        this.btnLeft.style.width = width;
        this.btnRight.style.width = width; 
        this.btnLeft.style.left = shift;
        this.btnRight.style.right = shift;  
        this.btnLeft.appendChild(this.iL);
        this.btnRight.appendChild(this.iR);   
    }

    setBtnTypeCircle(){
        this.wrpBtnCircle.setAttribute('class', 'wrp-btn');
        this.config.forEach((item, index) => {
        if(index % this.n === 0){ 
                const buttonCirle = document.createElement('button');
                buttonCirle.setAttribute('class', 'btn-circle btn-radius');
                buttonCirle.setAttribute('data-nimg', `${index}`);
                this.wrpBtnCircle.appendChild(buttonCirle);
            }
        });
    }

    setBtnTypeArrow(){
        this.btnLeft.setAttribute('class', 'btn-left btn btn-arrow');
        this.btnRight.setAttribute('class', 'btn-right btn btn-arrow');
        this.iR.setAttribute('class', 'fas fa-arrow-up');
        this.iL.setAttribute('class', 'fas fa-arrow-up');
        this.btnLeft.appendChild(this.iL);
        this.btnRight.appendChild(this.iR);
    }

    setButton(shift, width, typeButton){
        switch(typeButton){
            case "button" : 
            this.setBtnTypeButton(width, shift);
                break;
            case "circle" : 
            this.setBtnTypeCircle();
                break;
            case "arrow" : 
            this.setBtnTypeArrow();
                break;        
        }
    }

    addButton(typeButton){
        if(typeButton === 'circle'){
            this.carousel.appendChild(this.wrpBtnCircle);
        } else {
            this.carousel.appendChild(this.btnLeft);
            this.carousel.appendChild(this.btnRight);
        }
    }

    hideBitton(btn){
        btn.style.transform = 'scale(0)';
    }

    showbutton(btn){
        btn.style.transform = 'scale(1)';
    }

    activeButton(){
        let count = 0;
        const li = document.querySelectorAll(`#${this.id} .carousel-list .carousel-item`);
        this.carousel.onclick = () => {
            if(event.target.closest('.btn-left')) {
                count = this.scrollSlideLeft(count, li);
            } else if (event.target.closest('.btn-right')) {
               count = this.scrollSlideRight(count, li);
            } else if (event.target.closest('.btn-circle')){
                count = this.clickBtnCircle(count, li);
            }
        }
    }

    scrollSlideLeft(count, li){
        if(count - this.n >= 0) {
            count -= this.n;
            li.forEach(item => item.style.transform = `translate(${-1 * count * 100}%, 0)`);
        }
        if(!event.target.closest('.btn-arrow') && count === 0) { this.hideBitton(this.btnLeft); }; 
        if(!event.target.closest('.btn-arrow') &&  this.btnRight.style.transform === 'scale(0)') { this.showbutton(this.btnRight); }
        return count;
    }

    scrollSlideRight(count, li){
        if(count + this.n < this.config.length) {
            count += this.n;
            li.forEach(item => item.style.transform = `translate(${-1 * count * 100}%, 0)`);
        }
        if(!event.target.closest('.btn-arrow') && count ===  this.config.length - this.n) { this.hideBitton(this.btnRight); }
        if(!event.target.closest('.btn-arrow') &&  this.btnLeft.style.transform === 'scale(0)') { this.showbutton(this.btnLeft);}
        return count;
    }

    clickBtnCircle(count, li){
        count = event.target.dataset.nimg;
        li.forEach(item => item.style.transform = `translate(${-1 * count * 100}%, 0)`);
        return count;
    }
}

new Carousel("carousel1", config1).addCarousel();
new Carousel("carousel2", config1).addCarousel();
new Carousel("carousel3", config1).addCarousel();
new Carousel("carousel4", config1).addCarousel();
new Carousel("carousel5", config1).addCarousel();
new Carousel("carousel6", config1).addCarousel();