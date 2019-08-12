const pg = require('knex')({
    client: 'pg',
    connection:
    {
        host: '127.0.0.1',
        user: 'user',
        password: 'pass',
        database: 'db'
    }
});

module.exports = {
    GetRows: function(column,variable)
    {
        return knex('user').where(column,variable);
    }
}