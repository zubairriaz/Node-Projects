const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config({ path: "config/config.env" });

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started at PORT ${PORT}`));
