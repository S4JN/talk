const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;



const Connection = async () => {
    try {
        const conn = await mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.5sfc5k6.mongodb.net/?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("database connected sucessfully");

    } catch (error) {
        console.log("error in daatabsae",error);
    }
}

module.exports = Connection;