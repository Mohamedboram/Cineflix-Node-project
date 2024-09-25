const mongoose = require("mongoose");
const fs = require("fs");
const Movie = require("./../models/moviesModel");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.CONNECTION_STR)
  .then((connection) => {
    //console.log(connection);

    console.log("database connection established successfully");
  })
  .catch((err) =>
    console.log("database connection is not established" + err.message)
  );

const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf8"));

const deleteMovies = async () => {
  try {
    await Movie.deleteMany();
    console.log("Movies database deleted successfully");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

const importMovies = async () => {
  try {
    await Movie.create(movies);
    console.log("Movie imported successfully");
  } catch (error) {
    console.log(error.message);
  }
  process.exit()
};

console.log(process.argv);

if(process.argv[2] === "--delete"){
    deleteMovies()
}

if(process.argv[2] === "--import"){
    importMovies()
}
