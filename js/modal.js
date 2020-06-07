const close = '<div class="close modal-close"><i class="fa fa-times" aria-hidden="true"></i></div>';
let modalFon = document.createElement('div');
modalFon.setAttribute('class', 'modal-fon');
const modal = document.querySelectorAll('.modal');
const modalActive = [];
modal.forEach((item)=> {
    item.insertAdjacentHTML('beforeend', close);
    let modalFon = document.createElement('div');
    modalFon.setAttribute('class', 'modal-fon');
    modalFon.appendChild(item);
    document.body.appendChild(modalFon);
});

document.body.onclick = () => {  
    console.log(event.target)
    if(event.target.closest('.modal-trigger')){
        const modal = document.querySelector(`#${event.target.dataset.target}`).parentElement;
        modalActive.push(modal);
        modal.style.zIndex = modalActive.length + 30;
        document.body.classList.add('body-overflow-hidden');
        modal.classList.add('modal-active');
    } else if(event.target.closest('.modal-close')) {
        if(event.target.closest('.close')){
            let modal = event.target;
            while(!modal.classList.contains('modal-active')) {
                modal = modal.parentElement; 
            }
            modal.classList.remove('modal-active');
        } else {
            modalActive.forEach((item) => {
                item.classList.remove('modal-active');
            });
        }
        document.body.classList.remove('body-overflow-hidden');   
    }
}