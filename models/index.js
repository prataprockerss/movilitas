module.exports = {
    get: async (conn, { key = false, is_valid = false } = {}) => {
        let query = `
            SELECT 
                c.*,
                (
                    CASE
                        WHEN 
                            TIMEDIFF(now(),DATE_ADD(added_on, INTERVAL c.ttl MINUTE)) < 0
                        OR
                            TIMEDIFF(now(),DATE_ADD(updated_on, INTERVAL c.ttl MINUTE)) < 0
                        THEN 
                            1
                        ELSE 
                            0
                    END 
                ) as is_valid
            FROM 
                cached c
            WHERE 
                1 = 1
        `;
        if (key) {
            query += ` AND cached_key = "${key}" `;
        }
        if (is_valid) {
            query += `
                HAVING is_valid = "${is_valid}"
            `;
        }

        query += ` ORDER BY is_valid ASC `;
        return await conn.query(query);
    },
};
