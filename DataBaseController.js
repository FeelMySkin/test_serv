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
    console.log('select * from ' + table + ' where ' + column + "='" + condition + "';");
    return pool.query('select * from ' + table + ' where ' + column + "='" + condition + "';").then(res=> {return res.rows;});
}

async function RegisterUser(table,mail,pass)
{
    return GetRow(table,'mail',mail).
    then(resolve => {
        console.log(resolve.length);
        if(resolve.length != 0) throw('exists');
        else return resolve;
    }).
    then( resolve => {
        return pool.query('insert into ' + table + " values ('" + mail + "','" + pass + "');");
    },rej => {
        throw(rej);
    });
}


module.exports = {
    GetAllRows,
    GetRow,
    RegisterUser
}

//GetRow('test_table','mail','test').then(res => {console.log(res)});
RegisterUser('test_table','test3','pass4').then(res =>{console.log(res);},rej =>{console.log(rej);});
//RegisterUser('test_table','test3','pass5').then(res =>{console.log(res);},rej =>{console.log(rej);});;
//GetAllRows('test_table').then(res => {console.log(res);});