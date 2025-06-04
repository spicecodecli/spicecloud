const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { User } = require('../models/User');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await User.findOne({ where: { githubId: profile.id } });
      
      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
          avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null
        });
      } else {
        // Update user info if needed
        await user.update({
          username: profile.username,
          displayName: profile.displayName || profile.username,
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
          avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
