
const express = require('express');
const Router = express.Router();
const moviesControllers = require('../controller/moviesController.js');
 

Router.route("/").get(moviesControllers.getAllMovies).post(moviesControllers.createMovie);
Router
.route("/:id")
.get(moviesControllers.getMovieById)
.patch(moviesControllers.updateMovie)
.delete(moviesControllers.deleteMovie);

module.exports = Router;
