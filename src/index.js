require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const morgan = require("morgan")
const app = express();
const mongoose = require("mongoose");
const path = require('path');

/**
 * Database setup
 */
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});


app.use(routes);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"))
app.use('/files',express.static(path.resolve(__dirname,"..","temp","uploads")))

app.listen(3000);