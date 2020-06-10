let modalActive = [];
const addСrossСlosingAndFon = ()=>{
    const modal = document.querySelectorAll('.modal');
    const close = '<div class="close modal-close"><i class="fa fa-times" aria-hidden="true"></i></div>';
    modal.forEach((item)=> {
        item.insertAdjacentHTML('beforeend', close);
        addBlackFon(item);
    });
}

const addBlackFon = (item) => {
    let modalFon = document.createElement('div');
    modalFon.setAttribute('class', 'modal-fon');
    modalFon.appendChild(item);
    document.body.appendChild(modalFon);
}

const closeModal = (elem) => {
    if(elem.closest('.close')){
        closeModalThroughCross(elem);
    } else {
        closeModalsThroughBtn(); 
    }  
}

const closeModalThroughCross = (elem) => {
    let modal = findModal(elem);
    modal.classList.remove('modal-active');
}

const findModal = (elem) => {
    let modal = elem;
    while(!modal.classList.contains('modal-active')) {
        modal = modal.parentElement; 
    }
    return modal;
}

const closeModalsThroughBtn = () => {
    modalActive.forEach((item) => {
        item.classList.remove('modal-active');
    });
    modalActive = [];
}

const openModal = (elem) => {
    const modal = document.querySelector(`#${elem.dataset.target}`).parentElement;
    modalActive.push(modal);
    modal.style.zIndex = modalActive.length + 30;
    modal.classList.add('modal-active');
}

addСrossСlosingAndFon();

document.body.onclick = () => {  
    if(event.target.closest('.modal-trigger')){
        openModal(event.target);
    } else if(event.target.closest('.modal-close')) {
        closeModal(event.target);
    }
}