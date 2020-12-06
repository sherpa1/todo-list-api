const db = require("./DBConnection");

module.exports = class DBClient {

    static async get_submodel(submodel = "", submodel_id = 0) {
        if (!submodel_id) reject(new Error(`Submodel can't be equal to "${submodel_id}"`));

        const query = `SELECT * FROM ${submodel} WHERE id = ${submodel_id}`;

        return new Promise((resolve, reject) => {
            db.query(query, (err, result, next) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            })
        });
    }

    static async all(query) {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result, next) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async one(query) {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result, next) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            })
        });
    }

    static query(query) {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result, next) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async truncate(){
        
        const query=`
        SET FOREIGN_KEY_CHECKS=0;
        truncate users;
        truncate todos;
        truncate tags;
        truncate tags_todos;
        SET FOREIGN_KEY_CHECKS=1;
        `;

        return new Promise((resolve, reject) => {
            db.query(query, (err, result, next) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(result);
                }
            })
        });

    }


}