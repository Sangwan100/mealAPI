class APIFilters {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){

        const queryCopy = {...this.queryStr};

        const removeFields = ['fields','q'];
        removeFields.forEach(el => delete queryCopy[el]);

        let queryStr = JSON.stringify(queryCopy);
        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    limitFields(){

        if(this.queryStr.fields){

            const fields = this.queryStr.fields.split(',').join('');
            this.query = this.query.select(fields);

        }else{
            this.query = this.query.select('-__v');  //eliminating __v from the list
        }

        

        return this;
    }

    searchByQuery() {
        if(this.queryStr.q){
            const qu =this.queryStr.q.split('-').join(' ');
            this.query = this.query.find({$text: {$search: "\""+ qu +"\""}})
        }

        return this;
    }
}

module.exports = APIFilters;