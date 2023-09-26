require('dotenv').config();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth2').Strategy;


// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/sessions/oauth/google",
  state: true
},
function(request, accessToken, refreshToken, profile, done) {
  console.log("profile: ",profile);
  const accessTokenJWT = jwt.sign({user : profile.email},process.env.JWT_SECRET_KEY, { expiresIn: '700h' })
  profile.accessTokenJWT = accessTokenJWT;
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});