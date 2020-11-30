import github from 'passport-github2';

import config from '../config'

export default(passport) => {
  const GitHubStrategy = github.Strategy;

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: "http://localhost:3000/auth/github/callback",
      }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
          return done(null, profile);
        });
      }
    )
  );
}
