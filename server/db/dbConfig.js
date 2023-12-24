const mysql = require('mysql2');

const dbConnection = mysql.createPool({
    user: 'Evangadi-Addmin-nit',
    database: 'evangadidb',
    host: 'localhost',
    password: '123456',
    connectionLimit: 10  
});

// dbConnection.execute("SELECT 'test'", (err, result) => {
//     if (err) {
//         console.log(err.message);
//     } else {
//         console.log(result);
//     }
// });

module.exports = dbConnection.promise()