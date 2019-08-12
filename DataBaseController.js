const pg = require('knex')({
    client: 'pg',
    connection:
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'root'
    }
});

module.exports = {
    GetRows: function(column,variable)
    {
        return pg('test_table');
        //return knex('test_table').where(column,variable);
    }
}