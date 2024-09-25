const mongoose = require("mongoose");
const movieSchema = mongoose.Schema({
  name: {
    required: [true, "name is a required field"],
    type: String,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "name is a required field"],
  },
  duration: {
    type: Number,
  },
  genres: { type: [String], required: [true, "genres is a required field"] },
  ratings: {
    type: Number,
    default: 1,
  },
  totalRatings: {
    type: Number,
  },
  releasedYear: {
    type: Number,
  },
  releaseDate: {
    type: Date,
  },
  directors: {
    type: [String],
    required: [true, "directors is a required field"],
  },
  coverImage: String,
  actors: { type: [String], required: [true, "actors is a required"] },
  createdAt: { type: Date, default: Date.now() },
  price: { type: Number, required: [true, "price is a required"] },
});

const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;
