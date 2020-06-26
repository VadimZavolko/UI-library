class DataTable {
    constructor(config, data) {
      this.config = config;
      this.data = data;
      this._parent = document.querySelector(`${this.config.parent}`);      
      this._alterData = [...this.data];
      this._sortTypes = [];
    }

    creatTable(){
      const table = document.createElement('table');
      table.setAttribute('class', 'table'); 
      this.#creatTable(table);
      this._parent.append(table);
    }

    #creatElement = (elemType, elemClass) => { 
      const elem = document.createElement(elemType);
      elem.classList.add(elemClass);
      return elem
    }

    #creatTable = (table) => {
      this._thead = this.#creatElement('thead', 'table-thead');
      this._trHead = this.#creatElement('tr', 'table-thead-tr');
      this._tbody = this.#creatElement('tbody', 'table-tbody');;
      const trBody = this.data.map(item => {
        const trBody = this.#creatElement('tr', 'table-tbody-tr');
        return trBody;
      });

      if(this.config.search){
        this.#addSearch();
      } 

      this.config.columns.forEach(col => {
        this.#addTdHead(col);
        this.#addTdBody(col, trBody, this.data);
      });

      trBody.forEach(tr => this._tbody.append(tr));
      this._thead.append(this._trHead); 
      table.append(this._thead, this._tbody);
    } 

    #addTdHead = (col) => {
      const tdHead = document.createElement('td');
      tdHead.textContent = col.title;
      if(col.type && col.type === 'number'){
        tdHead.classList.add('align-right');
      }
      if(col.sortable){
        this.#addSort(col, tdHead, col.type);
      }
      this._trHead.append(tdHead);
    }

    #addTdBody = (col, trBody, data) => {
      data.forEach((elem, index) => {
        const tdBody = document.createElement('td');
        if(col.type && col.type === 'number'){
          tdBody.classList.add('align-right');
        }            
        tdBody.textContent = col.value !== '_index'? elem[col.value] : index + 1;                
        trBody[index].append(tdBody);
      }); 
    }

    #addSearch = () => {
      const trHead = this.#creatElement('tr', 'tr-search');
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
        if(this._clickButton !== undefined && (buttonSort.firstChild.classList.contains('fa-long-arrow-alt-up') || buttonSort.firstChild.classList.contains('fa-sort'))) {   
          this._sortTypes.push({data: [...this._alterData], btn: this._clickButton, class: this._clickButton.firstChild.className});
          this._clickButton.firstChild.className = this._clickButton.dataset.type === 'string' || this._clickButton.dataset.type === 'number' ? 'fas fa-long-arrow-alt-up' : 'fas fa-sort';
        }
        const sortData = this.#sortCol(this._alterData, icon, col.value);
        this.#changeSortIcon(icon, type);
        this._alterData = sortData;
        this._clickButton = buttonSort;
        if(this._alterData === null){
          if(this._sortTypes.length > 0){
            const sort = this._sortTypes.pop();
            sort.btn.firstChild.className = sort.class; 
            this._alterData = sort.data;
            this._clickButton = sort.btn;
          } else {
            this._alterData = [...this.data];
          }
        }
        !this._search.value ? this.#renderTable(this._alterData) : this.#find();
      }
    }

    #renderTable = (data) => {
      this._tbody.innerHTML = '';
      const trBody = data.map(item => {
        const trBody = this.#creatElement('tr', 'table-tbody-tr');
        return trBody;
      }); 
      this.config.columns.forEach((item) => { 
        this.#addTdBody(item, trBody, data);
      });
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

    #sortCol = (data, icon, value) => {
      let sortData = null;
      if(icon.classList.contains('fa-long-arrow-alt-up') || icon.classList.contains('fa-sort')){
        sortData = data.sort((cell1, cell2) => {
          if (String(cell1[value]).toLowerCase() > String(cell2[value]).toLowerCase()) 
            return 1;
          if (String(cell1[value]).toLowerCase() < String(cell2[value]).toLowerCase())
            return -1;
          return 0;
        }); 
      } else if(icon.classList.contains('fa-sort-alpha-down') || icon.classList.contains('fa-sort-numeric-down')
                || icon.classList.contains('fa-sort-down')){
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

 const config1 = {
   parent: '#usersTable',
   columns: [
     {title: '№', value: '_index'},
     {title: 'Имя', value: 'name', type: 'string', sortable: true},
     {title: 'Фамилия', value: 'surname', sortable: true},
     {title: 'Возраст', value: 'age', type: 'number', sortable: true},
   ],
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
 
new DataTable(config1, users).creatTable();
 