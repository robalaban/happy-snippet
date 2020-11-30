import { Router, Request, Response, NextFunction } from "express";
import passportAuth from '../../loaders/passport'

const route = Router()

export default async (app: Router, passport) => {
  app.use('/auth', route)

  await passportAuth(passport)

  route.get("/github", passport.authenticate("github", { scope: ["user:email", "gist"] }), (req, res) => {
    // Redirect request to Github for authentification
  })

  route.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
      res.redirect("/");
    }
  );

  route.get("/login", (req, res) => {
    res.send({user: req})
  })

  route.get("/logout", (req, res) => {
    // req.logout(); /TODO: Fix me
    res.redirect("/");
  })
}
