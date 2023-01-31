require("dotenv").config(".env");
const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const { PORT = 3000 } = process.env;

const { User, Cupcake } = require("./db");
// TODO - require express-openid-connect and destructure auth from it
const { auth, requiresAuth } = require("express-openid-connect");
const { SECRET, BASE_URL, CLIENT_ID, ISSUER_BASE_URL } = process.env;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: SECRET,
  baseURL: BASE_URL,
  clientID: CLIENT_ID,
  issuerBaseURL: ISSUER_BASE_URL,
};

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth(config));
app.use(async (req, res, next) => {
  if (req.oidc.user) {
    const { nickname, name, email } = req.oidc.user;
    await User.findOrCreate({
      where: {
        username: nickname,
        name: name,
        email: email,
      },
    });
  }
  next();
});

app.get("/profile", (req, res, next) => {
  res.send(req.oidc.isAuthenticated());
});

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
