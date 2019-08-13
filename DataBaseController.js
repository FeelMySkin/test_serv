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

async function GetAllRows(table)
{
    return pool.query('Select * from ' + table + ';').then(res => {return res.rows;});
}

async function GetRow(table,column,condition)
{
    return pool.query('select * from ' + table + ' where ' + column + "='" + condition + "';").then(res=> {return res.rows;});
}

async function RegisterUser(table,mail,pass)
{
    console.log('init reg');
    return GetRow(table,'mail',mail).
    then(resolve => {
        if(resolve.length != 0) throw('exists');
        else return resolve;
    }).
    then( resolve => {
        return pool.query('insert into ' + table + " values ('" + mail + "','" + pass + "');");
    },rej => {
        throw(rej);
    })
    .then(
        res => {return 'success';},
        rej => {throw(rej);}
    );
}


module.exports = {
    GetAllRows,
    GetRow,
    RegisterUser
}
