const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const app = require("./app");

//console.log(app.get("env"));
//console.log(process.env);
mongoose.connect(process.env.CONNECTION_STR).then((connection) => {


  console.log("Database connection established successfully");
});





const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server is listening on port " + port);
});
