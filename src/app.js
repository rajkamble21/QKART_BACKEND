const express = require("express");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const routes = require("./routes/v1");
const { errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const { jwtStrategy } = require("./config/passport");
const helmet = require("helmet");
const passport = require("passport");

const app = express();

// set security HTTP headers - https://helmetjs.github.io/ - cross-site scripting (XSS), content sniffing, clickjacking
app.use(helmet());

// parse json request body
// parse json request body   This middleware specifically looks for requests with a Content-Type header of application/json. 
// When it detects such a header, it attempts to parse the request body as JSON. 
// If the header is not present or does not match application/json, the middleware ignores the request body.
app.use(express.json());

// parse urlencoded request body - It parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// gzip compression - This middleware helps reduce the size of responses sent back to clients, 
// which can improve the performance of your web application by reducing bandwidth usage and speeding up page load times.
// set security HTTP headers - https://helmetjs.github.io/
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// TODO: CRIO_TASK_MODULE_AUTH - Initialize passport and add "jwt" authentication strategy

app.use(passport.initialize())
passport.use("jwt", jwtStrategy);
// Reroute all API request starting with "/v1" route
app.use("/v1", routes);

// send back a 404 error for any unknown api request

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// handle error
app.use(errorHandler);

module.exports = app;