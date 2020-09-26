let express = require("express");
let app = express();

let conn = require("./config/db");
let { get } = require("./models/index");
let {
    INSERT,
    UPDATE,
    errorResponse,
    FETCH,
    DELETE,
} = require("./helpers/global");

let { DB, RS_CONFIG, TTL, MAX_LIMIT } = require("./config/constants");
let rs = require("randomstring");
const form = require("express-form");
const field = form.field;

app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

app.get("/", async (req, res) => {
    let { key } = req.query;
    try {
        var resp = await get(conn);
    } catch (error) {
        return errorResponse(res, error);
    }
    if (key && key != "") {
        let filtered = resp.filter(
            (e) => e.cached_key == key && e.is_valid == 1
        );
        let updateOld = resp.length >= MAX_LIMIT ? true : false;
        // logic to check max limit for cached data
        // variable **resp** is getting data in expired on top so
        // once **MAX_LIMIT** reached here i will filtered out expired keys and update that data
        if (!filtered.length) {
            let key = rs.generate(RS_CONFIG);
            if (updateOld) {
                await UPDATE(
                    conn,
                    DB.CACHED,
                    {
                        cached_key: key,
                        ttl: TTL,
                        updated_on: new Date(),
                    },
                    [
                        {
                            id: resp[0].id,
                        },
                    ]
                );
                return res.status(200).send({
                    status: 1,
                    msg: "Cache miss & Max limit reached updated old",
                    data: { key },
                    error: null,
                });
            } else {
                await INSERT(conn, DB.CACHED, {
                    cached_key: key,
                    ttl: TTL,
                });
                return res.status(200).send({
                    status: 1,
                    msg: "Cache miss",
                    data: { key },
                    error: null,
                });
            }
        } else {
            return res.status(200).send({
                status: 1,
                msg: "Cache Hit",
                data: filtered[0],
                error: null,
            });
        }
    }
    return res.status(200).send({
        status: 1,
        msg: "All Cached",
        data: resp,
        error: null,
    });
});

app.post(
    "/update/:key",
    form(field("ttl", "TTL").required()),
    async (req, res) => {
        if (!req.form.isValid) {
            return res.status(200).send({
                status: 0,
                msg: "Validation Error",
                data: [],
                error: req.form.errors,
            });
        }
        let { ttl } = req.body;
        let { key: cached_key } = req.params;
        try {
            await UPDATE(
                conn,
                DB.CACHED,
                {
                    cached_key,
                    ttl,
                    updated_on: new Date(),
                },
                [{ cached_key }]
            );
        } catch (error) {
            errorResponse(res, error);
        }
        return res.status(200).send({
            status: 0,
            msg: "Data updated successfully",
            data: [],
            error: null,
        });
    }
);
// delete single api with key params
app.delete("/delete/:key", async (req, res) => {
    let { key: cached_key } = req.params;
    try {
        await DELETE(conn, DB.CACHED, [{ cached_key }]);
    } catch (error) {
        errorResponse(res, error);
    }
    return res.status(200).send({
        status: 0,
        msg: "Data deleted successfully",
        data: [],
        error: null,
    });
});

// delete all cached data
app.delete("/delete-all", async (req, res) => {
    try {
        await DELETE(conn, DB.CACHED);
    } catch (error) {
        errorResponse(res, error);
    }
    return res.status(200).send({
        status: 0,
        msg: "All data deleted successfully",
        data: [],
        error: null,
    });
});

// params validation for :key to check if key is exist
app.param("key", async (req, res, next, key) => {
    try {
        let resp = await FETCH(conn, DB.CACHED, {
            condition: `cached_key = "${key}"`,
        });
        if (!resp.length) {
            return res.status(200).send({
                status: 0,
                msg: "key not found",
                data: [],
                error: null,
            });
        }
    } catch (error) {
        errorResponse(res, error);
    }
    next();
});

app.listen(PORT, () => {
    console.log(`App is listing PORT ${PORT}`);
});
