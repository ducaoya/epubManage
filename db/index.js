const mysql = require("mysql");

const config = {
    host: "mysql.doromolll.xyz",
    port: "9022",
    user: "wusansi",
    password: "534534534111",
    database: "db",
    multipleStatements: true, //开启多线池
};

const pool = mysql.createPool({...config });

exports.query = function(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
                console.log(err, "数据库连接失败");
                resolve({
                    status: 500,
                });
            } else {
                // console.log("数据库连接成功");
                connection.query(sql, values, (err, results) => {
                    console.log(sql);
                    if (err) {
                        reject(err);
                        resolve({
                            status: 400,
                        });
                    } else {
                        connection.release();
                        resolve({
                            status: 200,
                            results,
                        });
                    }
                });
            }
        });
    });
};