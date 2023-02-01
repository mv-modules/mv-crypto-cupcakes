require("dotenv").config(".env");
const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const { PORT = 3000 } = process.env;
const { auth } = require("express-openid-connect");
const { User, Cupcake } = require("./db");
// TODO - require express-openid-connect and destructure auth from it
const { SECRET, BASE_URL, CLIENT_ID, ISSUER_BASE_URL } = process.env;
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: "http://localhost:3000",
  clientID: "BUAMCbyNpwEmbCVgC6XzCtfa4UMPfj1w",
  issuerBaseURL: "https://dev-mj4o06irczfkkoi1.us.auth0.com",
};

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/cupcakes", async (req, res, next) => {
  try {
    const cupcakes = await Cupcake.findAll();
    res.send(cupcakes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// error handling middleware
app.use((error, req, res, next) => {
  console.error("SERVER ERROR: ", error);
  if (res.statusCode < 400) res.status(500);
  res.send({ error: error.message, name: error.name, message: error.message });
});

app.listen(PORT, () => {
  console.log(`Cupcakes are ready at http://localhost:${PORT}`);
});
