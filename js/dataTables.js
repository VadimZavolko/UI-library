class DataTable {
    constructor(config, data = null) {
      this._sortTypes = [];
      this.config = config;
      this._parent = document.querySelector(`${this.config.parent}`); 
      this.data = data;
      this._apiUrl = new ApiUrl(this.config.apiUrl);
      this._typeSort = null;
    }

    #processData = async (item) => {
      let data = item;
      if(item === null && this.config.apiUrl){
        data = await this._apiUrl.getApiData();
      }
      this._alterData = [...data];
      return data;
    };

    creatTable = async () =>{
      this.data = await this.#processData(this.data);
      const table = document.createElement('table');
      table.setAttribute('class', 'table'); 
      this.#creatTableContent(table);
      this._parent.append(table);
    }

    #creatElement = (elemType, elemClass) => { 
      const elem = document.createElement(elemType);
      elem.classList.add(elemClass);
      return elem
    }

    #creatTableContent = (table) => {
      this._thead = this.#creatElement('thead', 'table-thead');
      this._trHead = this.#creatElement('tr', 'table-thead-tr');
      this._tbody = this.#creatElement('tbody', 'table-tbody');;
      const trBody = [];
      this.trSearch = this.#creatElement('tr', 'tr-search');
      if(this.config.search){
        this.#addSearch(this.trSearch);
      }
      const tdHead = document.createElement('td');
      tdHead.classList.add('td-add-btn');
      const btnAdd = document.createElement('button');
      btnAdd.setAttribute('data-target', 'modal-data');
      btnAdd.className = 'btn btn-success-hoverable modal-trigger';
      btnAdd.textContent = 'Add';
      this.#add(btnAdd);
      tdHead.append(btnAdd);
      this.trSearch.append(tdHead);
      this.#createModal();

      this.#addTdHead();
      this.#addTdBody(trBody, this.data);

      this.#addActionButtons(trBody);

      trBody.forEach(tr => this._tbody.append(tr));
      this._thead.append(this._trHead); 
      table.append(this._thead, this._tbody);
    } 

    #addActionButtons = (trBody) => {
      trBody.forEach((item, index) => {
        const tdBody = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn btn-mistakes-hoverable';
        btnDelete.textContent = 'Delete';
        this.#delete(btnDelete, index);
        const btnUpdate = document.createElement('button');
        btnUpdate.className = 'btn btn-warnings-hoverable modal-trigger';
        btnUpdate.textContent = 'Update';
        btnUpdate.setAttribute('data-target', 'modal-data');
        this.#update(btnUpdate, index);
        tdBody.append(btnDelete, btnUpdate);
        item.append(tdBody);
      });
    }

    #createModal = () => {
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.setAttribute('id', 'modal-data');
      const headerModal = document.createElement('div');
      headerModal.classList.add('modal-header');
      const pHeaderModal = document.createElement('p');
      pHeaderModal.textContent = 'Data'
      const mainModal = document.createElement('div');
      mainModal.classList.add('modal-main');
      const footerModal = document.createElement('div');
      footerModal.classList.add('modal-footer');
      const btnClose = document.createElement('button');
      btnClose.className = 'btn btn-mistakes-hoverable modal-close';
      btnClose.textContent = 'Отмена';
      const btnSave = document.createElement('button');
      btnSave.className = 'btn btn-success-hoverable save-btn  modal-close';
      btnSave.textContent = 'Сохранить';

      this.config.columns.forEach(col => {
        if(col.value !== '_index' && !col.editable && col.editable !== undefined){
          const field = document.createElement('field');
          field.textContent = col.title;
          const input = document.createElement('input');
          input.setAttribute('name', `${col.value}`);
          if(col.type && col.type === 'date'){
            input.setAttribute('type', 'datetime-local');
          } else if(col.type && col.type === 'number'){
            input.setAttribute('type', 'number');
          } else {
            input.setAttribute('type', 'text');
          }  
          field.append(input);
          mainModal.append(field);
        }
      });

      headerModal.append(pHeaderModal);
      footerModal.append(btnClose, btnSave);
      modal.append(headerModal, mainModal, footerModal);
      document.body.append(modal);
      addСrossСlosingAndFon();
    }

    #delete = (btn, i) => {
      btn.onclick = async () => {
       await this._apiUrl.deleteApiDataObj(this._alterData[i]);
        this.data = await this.#processData(null);

        if(this._colSort) { 
          const sortData = this.#sortCol(this._alterData, this._typeSort, this._colSort);
          this._alterData = !sortData ? [...this.data] : sortData;
        }

        !this._search.value ? this.#renderTable(this._alterData) : this.#find();
      };
    }

    #update = (btn, i) => {
       btn.onclick = () => {
          const btnSave = document.querySelector('.save-btn');
          const btnClose = document.querySelectorAll('.modal-close');
          const modalInput = document.querySelectorAll('.modal .modal-main field input');
          modalInput.forEach(item => {
            item.value = this._alterData[i][item.name];
            item.oninput = () => {
              this._alterData[i][item.name] = item.value;
            } 
          });
          btnSave.onclick = async () => {
            await this._apiUrl.updateApiDataObj(this._alterData[i]);
            this.data = await this.#processData(null);
 
            if(this._colSort) { 
              const sortData = this.#sortCol(this._alterData, this._typeSort, this._colSort);
              this._alterData = !sortData ? [...this.data] : sortData;
            }
 
            !this._search.value ? this.#renderTable(this._alterData) : this.#find();
          };

          btnClose.forEach(item => {
            item.addEventListener('click', () => {
              modalInput.forEach(item => {
                item.value = '';
              });
            });
          });
       };
    }

    #add = (btn) => {
      btn.onclick = () => {
        const btnSave = document.querySelector('.save-btn');
        const btnClose = document.querySelectorAll('.modal-close');
        const modalInput = document.querySelectorAll('.modal .modal-main field input');
        const newItem = Object.assign({}, this._alterData[length - 1]);
        newItem.id = length;
        modalInput.forEach(item => {
          item.oninput = () => {
            newItem[item.name] = item.value;
          } 
        });
          btnSave.onclick = async () => {
          await this._apiUrl.insertApiDataObj(newItem);
          this.data = await this.#processData(null);
 
          if(this._colSort) { 
            const sortData = this.#sortCol(this._alterData, this._typeSort, this._colSort);
            this._alterData = !sortData ? [...this.data] : sortData;
          }
 
          !this._search.value ? this.#renderTable(this._alterData) : this.#find();
        };

        btnClose.forEach(item => {
          item.addEventListener('click', () => {
            modalInput.forEach(item => {
              item.value = '';
            });
          });
        });
      };
    }

    #addTdHead = () => {
      this.config.columns.forEach(col => {
        const tdHead = document.createElement('td');
        tdHead.textContent = col.title;
        if(col.type && col.type === 'number'){
          tdHead.classList.add('align-right');
        }

        if(col.sortable){
          this.#addSort(col, tdHead, col.type);
        }
        this._trHead.append(tdHead);
      });

      const tdHead = document.createElement('td');
      tdHead.textContent = 'Action';
      this._trHead.append(tdHead);
    }

    #addTdBody = (tr, data) => {
      data.forEach((elem, index) => {
        const trBody = this.#creatElement('tr', 'table-tbody-tr');
        tr.push(trBody);
        this.config.columns.forEach(col => {
          const tdBody = document.createElement('td');
          if(col.type && col.type === 'number'){
            tdBody.classList.add('align-right');
          }
          if(col.type && col.type === 'img'){
            const img = document.createElement('img');
            img.style.width = 50 + 'px';
            img.setAttribute('src', elem[col.value]); 
            tdBody.append(img);
          } else if(col.type && col.type === 'date'){
            const date = new Date(elem[col.value]);
            tdBody.textContent = col.value !== '_index'?
            `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
              : index + 1;
          } else if(typeof col.value === 'function'){
            tdBody.textContent = col.value(elem);
          }else {
            tdBody.textContent = col.value !== '_index'? elem[col.value] : index + 1;
          }               
          trBody.append(tdBody);
        });
      });
    }

    #addSearch = (trHead) => {
      const tdHead = this.#creatElement('td', 'td-search'); 
      tdHead.colSpan = `${this.config.columns.length}`;
      this._search = document.createElement('input');
      this._search.setAttribute('type', 'search');
      tdHead.append(this._search);
      trHead.append(tdHead); 
      this._thead.append(trHead);
      this._search.oninput = () => {
        this.#find();
      }
    }

    #find = () => {
      const res = this._alterData.filter(item => {
        let value = null;
        this.config.search.fields.forEach(field => {
          this.config.search.filters.forEach(f => {
            if(f(item[field]).includes(f(this._search.value))) {
              value = item;
            }
          });
        });
        return value;
      });
      this.#renderTable(res);
    }

    #addSort = (col, td, type) => {
      const buttonSort = document.createElement('button');
      buttonSort.setAttribute('data-value', `${col.value}`);
      buttonSort.setAttribute('data-type', `${col.type}`);
      const icon = document.createElement('i');
      icon.setAttribute('class', col.type === undefined ? 'fas fa-sort' : 'fas fa-long-arrow-alt-up');
      buttonSort.append(icon);
      td.append(buttonSort);
      buttonSort.onclick = () => {
        if(this._clickButton !== undefined 
          && (buttonSort.firstChild.classList.contains('fa-long-arrow-alt-up')
              || buttonSort.firstChild.classList.contains('fa-sort'))) {   
          this._clickButton.firstChild.className = this._clickButton.dataset.type === 'string' 
            || this._clickButton.dataset.type === 'number' ?
              'fas fa-long-arrow-alt-up' : 'fas fa-sort';
        }
        if(!this._typeSort){
          this._typeSort = 1;
        } else if(this._typeSort === 1){
          this._typeSort = 2;
        } else {
          this._typeSort = null;
        }
        const sortData = this.#sortCol(this._alterData, this._typeSort, col.value);
        this.#changeSortIcon(icon, type);
        this._colSort = col.value;
        this._alterData = sortData === null ? [...this.data] : sortData;
        this._clickButton = buttonSort;
        !this._search.value ? this.#renderTable(this._alterData) : this.#find();
      }
    }

    #renderTable = (data) => {
      this._tbody.innerHTML = '';
      const trBody = [];
      this.#addTdBody(trBody, data);
      this.#addActionButtons(trBody);

      trBody.forEach(item => this._tbody.append(item));
    } 

    #changeIcon = (removeIcon, addIcon, icon) => {
      icon.classList.remove(removeIcon);
      icon.classList.add(addIcon);
    }

    #changeSortIcon = (icon, type) => {
      if(type === 'number'){
        if(icon.classList.contains('fa-long-arrow-alt-up')){
          this.#changeIcon('fa-long-arrow-alt-up', 'fa-sort-numeric-down', icon);
        } else if(icon.classList.contains('fa-sort-numeric-down')){
          this.#changeIcon('fa-sort-numeric-down', 'fa-sort-numeric-up-alt', icon);
        } else {
          this.#changeIcon('fa-sort-numeric-up-alt', 'fa-long-arrow-alt-up', icon);
        }
      } else if(type === 'string'){
        if(icon.classList.contains('fa-long-arrow-alt-up')){
          this.#changeIcon('fa-long-arrow-alt-up', 'fa-sort-alpha-down', icon);
        } else if(icon.classList.contains('fa-sort-alpha-down')){
          this.#changeIcon('fa-sort-alpha-down', 'fa-sort-alpha-up-alt', icon);
        } else {
          this.#changeIcon('fa-sort-alpha-up-alt', 'fa-long-arrow-alt-up', icon);
        }
      } else {
        if(icon.classList.contains('fa-sort')){
          this.#changeIcon('fa-sort', 'fa-sort-down', icon);
        } else if(icon.classList.contains('fa-sort-down')){
          this.#changeIcon('fa-sort-down', 'fa-sort-up', icon);
        } else {
          this.#changeIcon('fa-sort-up', 'fa-sort', icon);
        }
      }
    }

    #sortCol = (data, type, value) => {
      let sortData = null;
      if(type === 1){
        sortData = data.sort((cell1, cell2) => {
          if (String(cell1[value]).toLowerCase() > String(cell2[value]).toLowerCase()) 
            return 1;
          if (String(cell1[value]).toLowerCase() < String(cell2[value]).toLowerCase())
            return -1;
          return 0;
        }); 
      }else if(type === 2){
        sortData = data.sort((cell1, cell2) => {
          if (String(cell1[value]).toLowerCase() < String(cell2[value]).toLowerCase()) 
            return 1;
          if (String(cell1[value]).toLowerCase() > String(cell2[value]).toLowerCase())
            return -1;
          return 0;
        }); 
      }
      return sortData;
    }
 }
 
 const toKeyboardLayout = (str) => {
  let keyboardLayoutRu = {
    "q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г", "i": "ш", "o": "щ", "p": "з", "[": "х", "]": "ъ", "a": "ф", "s": "ы",
    "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л", "l": "д", ";": "ж", "'": "э", "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и",
    "n": "т", "m": "ь", ",": "б", ".": "ю", "/": "."
  };

  return str.replace(/[A-zА-я0-9\[\]\.\;\/\,]/g, (symbol) => {
    return keyboardLayoutRu[symbol.toLowerCase()] !== undefined ?  keyboardLayoutRu[symbol.toLowerCase()] : symbol.toLowerCase();
  });
}

const calculateAge = (birthday) => {
  
  console.log(new Date(birthday).getFullYear());

  return Number(new Date().getFullYear()) - Number(new Date(birthday).getFullYear()); 
}

 const config1 = {
    parent: '#usersTable',
    columns: [
     {title: '№', value: '_index'},
     {title: 'Аватар', value: 'avatar', type: 'img', editable: false},
     {title: 'Имя', value: 'name', type: 'string', sortable: true, editable: false},
     {title: 'Фамилия', value: 'surname', sortable: true, editable: false},
     {title: 'Дата рождения', value: 'birthday', type: 'date', sortable: true, editable: false},
     {title: 'Возраст', value: (user) => calculateAge(user.birthday), type: 'number'},
    ],
    apiUrl: "https://5e938231c7393c0016de48e6.mockapi.io/api/ps5/customers",
    search: {
     fields: ['name', 'surname'],
     filters: [
       v => toKeyboardLayout(v) 
     ]
   }
 
 };
 
   const users = [
     {id: 30050, name: 'Вася', surname: 'Петров', age: 25},
     {id: 30051, name: 'Петров', surname: 'Васечкин', age: 15},
     {id: 30050, name: 'Вася', surname: 'Петров', age: 17},
     {id: 30051, name: 'Вася', surname: 'Васечкин', age: 15},
     {id: 30050, name: 'Васечкин', surname: 'Петров', age: 12},
     {id: 30051, name: 'Вася', surname: 'Васечкин', age: 15},
     {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
     {id: 30051, name: 'Васечкин', surname: 'Васечкин', age: 18},
     {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
     {id: 30051, name: 'Вася', surname: 'Васечкин', age: 15},
  ];
 
new DataTable(config1, /*users*/).creatTable();
 