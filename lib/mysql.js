var mysql = require('mysql2'); // mysql2로 require해야 에러안남

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'qwert12345',
    database : 'usertable'
});

connection.connect();

module.exports = connection;
// connection.query('SELECT * FROM usertable', function(error, results, fields){
//     if(error){
//         console.log(error);
//     }
//     console.log(results);
// });

// connection.end();