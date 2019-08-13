const REG_TABLE = 'test_table';


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

async function GetUser(mail)
{
    return GetRow(REG_TABLE,'mail',mail);
}

async function UserExists(mail)
{
    return GetUser(mail)
    .then(res => {
        if(res.length == 0) return false;
        else return true;
    })
}

async function RegisterUser(mail,pass)
{
    return UserExists(mail).
    then(resolve => {
        if(resolve) throw('exists');
        else return resolve;
    }).
    then( resolve => {
        return pool.query('insert into ' + REG_TABLE + " values ('" + mail + "','" + pass + "');");
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
    GetUser,
    RegisterUser,
    UserExists
}
