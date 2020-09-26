module.exports = {
    INSERT: async (
        con,
        table,
        data,
        { isBatch = false, columns = "" } = {}
    ) => {
        return new Promise(async (resolve, reject) => {
            if (table == "") {
                reject("table name is required");
            }
            if (isBatch) {
                if (columns == "") {
                    reject(
                        "please specify column names in order to batch insert"
                    );
                }
                if (!data instanceof Array) {
                    reject("data should be array");
                }

                let query = `
                        INSERT INTO
                            ${table}
                            (${columns})
                        VALUES ?
                    `;
                try {
                    let result = await con.query(query, [data]);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            } else if (!isBatch) {
                if (data instanceof Array) {
                    reject("data should be object");
                }
                let query = `
                        INSERT INTO
                            ${table}
                        SET ?
                    `;

                try {
                    let result = await con.query(query, [data]);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }
        });
    },

    UPDATE: async (con, table, data, params = []) => {
        var query = ``;
        var where = ``;
        return new Promise(async (resolve, reject) => {
            if (table === "") {
                reject("table name can not be blank");
            }

            if (typeof data !== "object") {
                reject("Data should be object Type");
            }

            if (params.length) {
                for (let i = 0; i < params.length; i++) {
                    if (i == 0) {
                        where += ` WHERE ${Object.keys(params[i])[0]} = "${
                            params[i][Object.keys(params[i])[0]]
                        }" `;
                    } else {
                        where += ` AND ${Object.keys(params[i])[0]} = "${
                            params[i][Object.keys(params[i])[0]]
                        }" `;
                    }
                }
            }
            query = ` UPDATE ${table} SET ? `;
            if (where !== "") {
                query = query + where;
            }
            try {
                let result = await con.query(query, [data]);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },
    FETCH: async (
        con,
        table,
        { columns = false, condition = "", orderBy = false } = {}
    ) => {
        let query = `
            SELECT
                ${columns ? columns : `*`}
            FROM
                ${table} `;
        if (condition) {
            query += `
                    WHERE 
                    ${condition}
                `;
        }

        if (orderBy) {
            query += ` ORDER BY ${orderBy}`;
        }

        return await con.query(query);
    },
    errorResponse: (res, error, { status = 502 } = {}) => {
        return res.status(status).json({
            status: 0,
            msg: "System catch an error",
            data: [],
            error: error.message ? error.message : error,
        });
    },
};
