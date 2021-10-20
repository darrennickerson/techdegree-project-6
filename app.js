const express = require("express");
const app = express();
const createError = require("http-errors");
const { projects } = require("./data.json");

// Template engine *Pug*
app.set("view engine", "pug");
// Static Routes
app.use("/static", express.static("public"));
app.get("/", (req, res) => {
  res.render("index", { projects });
});
app.get("/about", (req, res) => {
  res.render("about");
});
//Dynamic Project routes with error handling
app.get("/project/:id", (req, res, next) => {
  const { id } = req.params;
  const project = projects[id];
  if (project) {
    res.render("project", { project });
  } else {
    next(createError(404));
  }
});

//General Error Handling
app.get("/error", (req, res, next) => {
  const err = new Error();
  err.message = `Server Error`;
  err.status = 500;
  throw err;
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  if (err.status === 404) {
    res.status(err.statusCode);
    err.message = "Page Not Found";
    console.error("Page Not Found", err.status);
    res.render("page-not-found", { err });
  } else {
    res.status(err.statusCode || 500);
    console.error("Server Error", err.status);
    err.message = "Server Error.";
    res.render("error", { err });
  }
});

// Start Server on port 3000
app.listen(3000, () => {
  console.log("the project is running on localhost:3000");
});
