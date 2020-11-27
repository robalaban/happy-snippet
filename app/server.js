const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { request } = require("@octokit/request");
const passport = require("passport");

const app = express();

// TODO: Move into middleware

app.use(
  session({
    secret: "keyboardCat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./auth/passport");

// TODO: Move into routes

app.get("/", function (req, res) {
  res.send({ user: req.user });
});

// Gets all gists from Github
app.get("/snippets", ensureAuthenticated, async (req, res) => {
  const { githubAccessToken } = req.user;
  const gists = await request("GET /gists/:gist_id", {
    headers: {
      authorization: `token ${githubAccessToken}`,
    },
  });

  res.send({ gists: gists.data });
});

// Gets a specific snippet from Github
app.get("/snippet/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { githubAccessToken } = req.user;
  const gists = await request("GET /gists/:gist_id", {
    headers: {
      authorization: `token ${githubAccessToken}`,
    },
    gist_id: id,
  });

  res.send({ gists: gists.data });
});

// Create a gist and post it to Github
app.post("/snippets", ensureAuthenticated, async (req, res) => {
  // TODO: grab the data from there parse it prepare it in the right format send it to Github
  const { githubAccessToken } = req.user;
  let snippet;
  try {
    snippet = await request("POST /gists", {
      headers: {
        authorization: `token ${githubAccessToken}`,
        accept: "application/vnd.github.v3+json",
      },
      data: {
        description: "Testing Gist API",
        files: {
          "Sample.md": {
            content: "# This is a header 1 tag",
          },
          "Another.md": {
            content: "### This is another file in header 3",
          },
        },
      },
    });
  } catch (error) {
    snippet = error;
  }
  res.send({ status: snippet.data }).status(snippet.status);
});

app.get("/account", ensureAuthenticated, function (req, res) {
  res.send({ user: req.user });
});

app.get("/login", function (req, res) {
  console.log(req);
  res.send({ user: req.user });
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email", "gist"] }),
  function (req, res) {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
