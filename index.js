const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3001;
const USER = "1";
const PWD = "1";
const TOKEN_SECRET =
  "b91028378997c0b3581821456edefd0ec7958f953f8c1a6dc1a6dd856e2de27f0d7e0fb1a01cda20d1a6890267e629f0ff5dc7ee46bce382aba62d13989614417606a";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "ssshhhhh", saveUninitialized: true, resave: true }));
app.use(express.static(__dirname + "/views"));
var user_count = 0;

app.get("/", (req, res) => {
  if (req.session.isLoggedin) {
    res.redirect("/home");
  } else {
    res.render("login.ejs");
  }
});

app.post("/login", (req, res) => {
  req.session.isLoggedin = false;
  req.session.accessToken = { token: "", isSet: false };
  if (USER === req.body.username || "2" === req.body.username) {
    if (PWD === req.body.password) {
      req.session.username = req.body.username;
      req.session.unique_id = ++user_count;
      req.session.isLoggedin = true;
      const match = bcrypt.compare(req.session.username, USER);
      const accessToken = jwt.sign(
        JSON.stringify(req.session.username),
        TOKEN_SECRET
      );

      req.session.accessToken = { token: accessToken, isSet: true };
      res.end("done");
    } else {
      res.end("invalid");
    }
  } else {
    res.end("invalid");
  }
});

app.get("/logout", (req, res) => {
  req.session.isLoggedin = false;
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
});

app.get("/home", (req, res) => {
  if (req.session.isLoggedin) {
    res.render("home.ejs", {
      user: JSON.parse(
        Buffer.from(
          req.session.accessToken.token.split(".")[1],
          "base64"
        ).toString()
      ),
    });
  } else {
    res.redirect("/");
  }
});

app.get("*", function (req, res) {
  res.render("error.ejs");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
