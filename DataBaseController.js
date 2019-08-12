const Pool = require('pg').Pool;
const pool = new Pool(
    {
        user: 'root',
        host: 'localhost',
        database: 'root',
        password: '123',
        port: 5432
    }
);



module.exports = {
    GetAll: function(table)
    {
        (request,response) =>
        {
            pool.query('Select * from ' + table + ';', (error,results) =>
            {
                response.status(200).json(results.rows);
            });
        }
        return response;
    }
}

console.log(function() {
    (request,response) =>
    {
        pool.query('Select * from ' + table + ';', (error,results) =>
        {
            response.status(200).json(results.rows);
        });
    }
    return response;
});
