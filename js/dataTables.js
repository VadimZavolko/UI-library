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
      this._parent.appendChild(table);
    }

    #creatTable = (table) => {
      this._thead = document.createElement('thead');
      this._thead.setAttribute('class', 'table-thead');
      this._trHead = document.createElement('tr');
      this._trHead.setAttribute('class', 'table-thead-tr');
      this._tbody = document.createElement('tbody');
      this._tbody.setAttribute('class', 'table-tbody');
      const trBody = this.data.map(item => {
        const trBody = document.createElement('tr');
        trBody.setAttribute('class', 'table-tbody-tr');
        return trBody;
      });

      if(this.config.search){
        this.#addSearch();
      } 

      this.config.columns.forEach(item => {
        const tdHead = document.createElement('td');
        tdHead.textContent = item.title;
        if(item.type !== undefined && item.type === 'number'){
          tdHead.setAttribute('class', 'align-right');
        }
        if(item.sortable){
          this.#addSort(item, tdHead, item.type);
        }
        this._trHead.appendChild(tdHead);
        this.data.forEach((elem, index) => {
          const tdBody = document.createElement('td');
          if(item.type !== undefined && item.type === 'number'){
            tdBody.setAttribute('class', 'align-right');
          }            
          tdBody.textContent = item.value !== '_index'? elem[item.value] : index + 1;                
          trBody[index].appendChild(tdBody);
        }); 
      });

      trBody.forEach(item => this._tbody.appendChild(item));
      this._thead.appendChild(this._trHead); 
      table.appendChild(this._thead);
      table.appendChild(this._tbody);
    } 

    #addSearch = () => {
      const trHead = document.createElement('tr');
      trHead.setAttribute('class', 'tr-search');
      const tdHead = document.createElement('td'); 
      tdHead.colSpan = `${this.config.columns.length}`;
      this._search = document.createElement('input');
      this._search.setAttribute('type', 'search');
      tdHead.setAttribute('class', 'table-search');
      tdHead.appendChild(this._search);
      trHead.appendChild(tdHead); 
     
      this._thead.appendChild(trHead);
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
      const i = document.createElement('i');
      buttonSort.appendChild(i);
      i.setAttribute('class', col.type === undefined ? 'fas fa-sort' : 'fas fa-long-arrow-alt-up');
      td.appendChild(buttonSort);
      buttonSort.onclick = () => {
        if(this._clickButton !== undefined && buttonSort !== this._clickButton
              && !this._clickButton.firstChild.classList.contains('fa-long-arrow-alt-up') 
                && !this._clickButton.firstChild.classList.contains('fa-sort')) {   
          this._sortTypes.push({data: [...this._alterData], btn: this._clickButton, class: this._clickButton.firstChild.className});
          this._clickButton.firstChild.className = this._clickButton.dataset.type === 'string' || this._clickButton.dataset.type === 'number' ? 'fas fa-long-arrow-alt-up' : 'fas fa-sort';
        }
        console.log(this._sortTypes)
        const sortData = this.#sortCol(this._alterData, i, col.value);
        this.#changeSortIcon(i, type);
        this._alterData = sortData;
        this._clickButton = buttonSort;
        if(this._alterData === null){
          if(this._sortTypes.length > 0){
            const sort = this._sortTypes.pop();
            sort.btn.firstChild.className = sort.class; 
            this._alterData = sort.data;
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
          const trBody = document.createElement('tr');
          trBody.setAttribute('class', 'table-tbody-tr');
          return trBody;
        }); 
        this.config.columns.forEach((item, i) => { 
        data.forEach((elem, index) => {
          const tdBody = document.createElement('td');
          if(item.type !== undefined && item.type === 'number'){
            tdBody.setAttribute('class', 'align-right');
          }            
          tdBody.textContent = item.value !== '_index'? elem[item.value] : index + 1;                
          trBody[index].appendChild(tdBody);              
        }); 
      });
      trBody.forEach(item => this._tbody.appendChild(item));
    } 

    #changeSortIcon = (i, type) => {
      if(type === 'number'){
        if(i.classList.contains('fa-long-arrow-alt-up')){
          i.classList.remove('fa-long-arrow-alt-up');
          i.classList.add('fa-sort-numeric-down');
        } else if(i.classList.contains('fa-sort-numeric-down')){
          i.classList.remove('fa-sort-numeric-down');
          i.classList.add('fa-sort-numeric-up-alt');
        } else {
          i.classList.remove('fa-sort-numeric-up-alt');
          i.classList.add('fa-long-arrow-alt-up');
        }
      } else if(type === 'string'){
        if(i.classList.contains('fa-long-arrow-alt-up')){
          i.classList.remove('fa-long-arrow-alt-up');
          i.classList.add('fa-sort-alpha-down');
        } else if(i.classList.contains('fa-sort-alpha-down')){
          i.classList.remove('fa-sort-alpha-down');
          i.classList.add('fa-sort-alpha-up-alt');
        } else {
          i.classList.remove('fa-sort-alpha-up-alt');
          i.classList.add('fa-long-arrow-alt-up');
        }
      } else {
        if(i.classList.contains('fa-sort')){
          i.classList.remove('fa-sort');
          i.classList.add('fa-sort-down');
        } else if(i.classList.contains('fa-sort-down')){
          i.classList.remove('fa-sort-down');
          i.classList.add('fa-sort-up');
        } else {
          i.classList.remove('fa-sort-up');
          i.classList.add('fa-sort');
        }
      }
    }

    #sortCol = (data, i, value) => {
      let sortData = null;
      if(i.classList.contains('fa-long-arrow-alt-up') || i.classList.contains('fa-sort')){
        sortData = data.sort((cell1, cell2) => {
          if (String(cell1[value]).toLowerCase() > String(cell2[value]).toLowerCase()) 
            return 1;
          if (String(cell1[value]).toLowerCase() < String(cell2[value]).toLowerCase())
            return -1;
          return 0;
        }); 
      } else if(i.classList.contains('fa-sort-alpha-down') || i.classList.contains('fa-sort-numeric-down')
                || i.classList.contains('fa-sort-down')){
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

  return str.replace('\[a-z/[/]/.;,/]\g', (symbol) => {
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
 