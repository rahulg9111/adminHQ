const debug = require('debug')('ApiFeatures')

class ApiFeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        const queryObj = {...this.queryString};
        const excludedFields = ['page','limit','fields','sort','caching'];
        excludedFields.forEach(o => delete queryObj[o]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|eq)\b/g , match => `$${match}`);

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else{
            this.query = this.query.sort('timestamp');
        }

        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const queryStr = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(queryStr);
        }
        return this;
    }

    paginate(){
        const page = this.queryString.page * 1 || 1;
        const recordsPerPage = this.queryString.limit * 1 || 20;

        let offset = ( page-1 ) * recordsPerPage;
        this.query = this.query.skip(offset).limit(recordsPerPage);

        return this;
    }

    countDocuments(){
        this.query = this.query.countDocuments();
    }
}

module.exports = ApiFeatures