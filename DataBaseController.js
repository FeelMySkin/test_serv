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

async function UserExists()
{
    var tst = await GetUser('test');
    if(tst.length != 0) return true;
    else return false;
}

async function RegisterUser(mail,pass)
{
    return GetUser(mail).
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
    GetUser,
    RegisterUser
}

console.log(UserExists());