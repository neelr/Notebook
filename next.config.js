require("dotenv").config()
module.exports = {
    env: {
        AIRTABLE: process.env.AIRTABLE,
        BASE: process.env.BASE
    }
}