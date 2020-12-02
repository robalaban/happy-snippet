import github from 'passport-github2';

import config from '../config'
import { IUser } from '../interfaces/IUser'

export default(passport) => {
  const GitHubStrategy = github.Strategy;

  passport.serializeUser((user, done) => {
    const happyUser: IUser = {
      _id: user.id,
      displayName: user.displayName,
      username: user.username,
      photo: user.photos[0].value,
      profileUrl: user._json.html_url,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken
    }

    done(null, happyUser);
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
          profile.accessToken = accessToken
          profile.refreshToken = refreshToken
          return done(null, profile);
        });
      }
    )
  );
}
