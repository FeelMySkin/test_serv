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

function GetAll(table)
{
    return pool.query('Select * from ' + table + ';').then(res => {return res.rows;});
}



module.exports = {
    GetAll
}

GetAll('test_table').then(res => {console.log(res);});
