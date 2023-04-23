import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false
    }
)
const db = {sequelize, Sequelize};

try {
    await sequelize.authenticate()
} catch (e) {
    console.error(e)
    exit(1)
}

import {User} from "./modelUsers.js"
db.user = User(Sequelize, sequelize)

await sequelize.sync() //{force:true}

export default db;