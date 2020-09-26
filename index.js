const { Router, response } = require("express");
let express = require("express");
let app = express();

let conn = require("./config/db");
let { get } = require("./models/index");
let { INSERT, UPDATE, errorResponse, FETCH } = require("./helpers/global");
let { DB, RS_CONFIG, TTL } = require("./config/constants");
let rs = require("randomstring").generate(RS_CONFIG);
const form = require("express-form");
const field = form.field;

app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

app.get("/", async (req, res) => {
    let { key } = req.query;
    try {
        var resp = await get({ key, is_valid: 1 });
    } catch (error) {
        return errorResponse(res, error);
    }

    if (key && key != "") {
        if (!resp.length) {
            let key = rs;
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
        } else {
            return res.status(200).send({
                status: 1,
                msg: "Cache Hit",
                data: resp[0],
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
        console.log(req.body);
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
            error: req.form.errors,
        });
    }
);

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
