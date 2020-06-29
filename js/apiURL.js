class ApiUrl {
    constructor(url){
        this.url = url;
    }

    async getApiData() {
        const res = await fetch(this.url);
        return res.json();
    }
    
    async deleteApiDataObj(data){
        return await fetch(`${this.url}/${data.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify(data)
        });
    }

    async updateApiDataObj(data){
        return await fetch(`${this.url}/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify(data)
        });
    }

    async insertApiDataObj(data){
        return await fetch(`${this.url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify(data)
        });
    }
}
