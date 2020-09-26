# Movilitas assignment Github repo [Pratap Tondwalkar]

## Config Information 
You can change all config information in `./config/constants.js`
- `MAX_LIMIT` is for set cached table maximum records limit.
- `TTL` Default Time to Live time is in minute store, you can change here.
- `RS_CONFIG` is Random String coinfig.


## End point details 

- [GET] http://localhost:8080 Get all chached table information.
- [GET] http://localhost:8080?key=hTDKbOpvZEjH Retrive single key information.
- [PUT] http://localhost:8080/update/VbSlSUVNFuSG Update information.
- [DELETE] http://localhost:8080/delete/JrlROUSRUnix Delete single key from cached table.
- [DELETE] http://localhost:8080/delete-all Delete all cached data.


## Node Packaged information 

- [Node Random String](https://www.npmjs.com/package/randomstring) 
- [Express Form](https://www.npmjs.com/package/express-form) To validate endpoint inputs
- [MySql](https://www.npmjs.com/package/mysql)


## DataBase Information
```mysql
-- Create DB
CREATE DATABASE `movilitas`;

-- Switch to DB
USE `movilitas`;

-- Create Table in DB
CREATE TABLE `cached` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cached_key` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `ttl` int NOT NULL COMMENT 'This time is conder min ',
  `added_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
```
