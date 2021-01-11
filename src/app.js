const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("../utils/geocode");
const forecast = require("../utils/forecast");

const app = express();

//Define pahts for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Krish Panchal",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Krish",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    para: "This is Help page",
    title: "Help",
    name: "Krish",
  });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;

  if (!address) {
    return res.send({
      error: "Please provide the address",
    });
  }

  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error,
      });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error,
        });
      }

      res.send({
        location,
        forecast: forecastData,
        address,
      });
    });
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You don't have the search term provided",
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    error: "Help article not found",
    title: "404",
    name: "Krish",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    error: "My 404 Page",
    title: "404",
    name: "Krish",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
