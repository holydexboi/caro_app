const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'db4free.net',
      port : 3306,
      user : 'achonyerichard',
      password : 'jahsehonfroy',
      database : 'caro_app'
    },
    debug: true
  });

  module.exports = knex