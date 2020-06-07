const config1 = ["https://loremflickr.com/320/240/dog", "https://loremflickr.com/g/320/240/paris",
 "https://loremflickr.com/320/240/paris,girl/all", "https://loremflickr.com/320/240/dog", "https://loremflickr.com/g/320/240/paris",
 "https://loremflickr.com/320/240/paris,girl/all", "https://loremflickr.com/320/240/dog", "https://loremflickr.com/g/320/240/paris",
 "https://loremflickr.com/320/240/paris,girl/all"];

Carousel("carousel1", config1);
Carousel("carousel2", config1);
Carousel("carousel3", config1);
Carousel("carousel4", config1);
Carousel("carousel5", config1);
Carousel("carousel6", config1);

function Carousel(id, config = []) {
    const carousel = document.querySelector(`#${id}`),
        btnLeft = document.createElement('button'),
        btnRight = document.createElement('button'), 
        ul = document.createElement('ul'),
        iL = document.createElement('i'),
        iR = document.createElement('i'),
        wrp = document.createElement('div'),
        n = parseInt(carousel.dataset.visible),
        baseWidth = parseInt(carousel.dataset.basewidth),
        typeWidth = carousel.dataset.typeWidth,
        typeButton = carousel.dataset.button;
    
    carousel.style.width = baseWidth * n + typeWidth;
    
    iL.setAttribute('class', 'fas fa-caret-up');
    iR.setAttribute('class', 'fas fa-caret-up');
    wrp.setAttribute('class', 'wrp');

    ul.setAttribute('class', 'carousel-list');
    ul.style.width= `${(config.length * 100) / n}%`;
    wrp.appendChild(ul);

    config.forEach((item, index) => {
        const li = document.createElement('li'),
            img = document.createElement('img');

        img.setAttribute('src', `${item}`);
        img.setAttribute('alt', `${index}`);
        li.setAttribute('class', 'carousel-item');
        img.setAttribute('class', 'carousel-img');

        li.appendChild(img)
        ul.appendChild(li);
    });
    
    carousel.appendChild(wrp);
    
    if(typeButton === 'button') {
        btnLeft.setAttribute('class', 'btn-left btn');
        btnLeft.style.transform = 'scale(0)';
        btnRight.setAttribute('class', 'btn-right btn');
        btnLeft.style.width = typeWidth === '%' ? 15 + typeWidth : ((baseWidth * 15) / 100) + typeWidth;
        btnRight.style.width = typeWidth === '%' ? 15 + typeWidth : ((baseWidth * 15) / 100) + typeWidth;
        btnLeft.style.left = typeWidth === '%' ? -12 + typeWidth : -((baseWidth * 12) / 100) + typeWidth;
        btnRight.style.right = typeWidth === '%' ? -12 + typeWidth : -((baseWidth * 12) / 100) + typeWidth;    
        btnLeft.appendChild(iL);
        btnRight.appendChild(iR);    
        carousel.appendChild(btnLeft);
        carousel.appendChild(btnRight);
    } else if(typeButton === 'circle'){
        const wrpBtnCircle = document.createElement('div');
        wrpBtnCircle.setAttribute('class', 'wrp-btn');
        config.forEach((item, index) => {
            if(index % n === 0){ 
                const buttonCirle = document.createElement('button');
                buttonCirle.setAttribute('class', 'btn-circle btn-radius');
                buttonCirle.setAttribute('data-nimg', `${index}`)
                wrpBtnCircle.appendChild(buttonCirle);
            }
         });
        carousel.appendChild(wrpBtnCircle);
    } else {
        btnLeft.style.left = 0;
        btnRight.style.right = 0;  
        btnLeft.setAttribute('class', 'btn-left btn btn-arrow');
        btnRight.setAttribute('class', 'btn-right btn btn-arrow');
        iL.setAttribute('class', 'fas fa-arrow-up');
        iR.setAttribute('class', 'fas fa-arrow-up');
        btnLeft.appendChild(iL);
        btnRight.appendChild(iR);    
        carousel.appendChild(btnLeft);
        carousel.appendChild(btnRight);
    }

    let count = 0;
    const li = document.querySelectorAll(`#${id} .carousel-list .carousel-item`);
    carousel.onclick = () => {
        if(event.target.closest('.btn-left')) {
            if(count - n >= 0) {
                count -= n;
                li.forEach(item => item.style.transform = `translate(${-1 * count * 100}%, 0)`);
            }
            if(!event.target.closest('.btn-arrow') && count === 0) { btnLeft.style.transform = 'scale(0)'; }; 
            if(!event.target.closest('.btn-arrow') && btnRight.style.transform === 'scale(0)') { btnRight.style.transform = 'scale(1)'; }
        } else if (event.target.closest('.btn-right')) {
            if(count + n < config.length) {
                count += n;
                li.forEach(item => item.style.transform = `translate(${-1 * count * 100}%, 0)`);
            }
            if(!event.target.closest('.btn-arrow') && count === config.length - n) { btnRight.style.transform = 'scale(0)' };
            if(!event.target.closest('.btn-arrow') && btnLeft.style.transform === 'scale(0)') { btnLeft.style.transform = 'scale(1)'; }
        } else if (event.target.closest('.btn-circle')){
            count = event.target.dataset.nimg;
            li.forEach(item => item.style.transform = `translate(${-1 * count * 100}%, 0)`);
        }
    }
}