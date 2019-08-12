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
    GetRows: function(column,variable)
    {
        return pool.query('SELECT * from test_table;', (error,result) =>
            {
                if(error) throw error;
                else return result;
            });
        //return knex('test_table').where(column,variable);
    }
}

console.log(pool.query('SELECT * from test_table;', (error,result) =>
{
    if(error) throw error;
    else return result;
}));
