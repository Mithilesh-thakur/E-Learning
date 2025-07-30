import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import instructorRoute from './routes/instructor.js';
import chatRoute from './routes/chat.route.js';
import discussionRoute from './routes/discussion.route.js';
import commentRoute from './routes/comment.route.js';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "./models/user.model.js";
import jwt from "jsonwebtoken";
import { generateToken } from "./utils/generateToken.js";

dotenv.config({});
connectDB();

const app = express();
const PORT = process.env.PORT || 8080; // Use 8080 to match frontend API calls

app.use(passport.initialize());
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Google OAuth (Advanced)
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find by Google ID
    let user = await User.findOne({ googleId: profile.id });
    // If not found, try by email
    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        // Link Google to existing user
        user.googleId = profile.id;
        user.photoUrl = profile.photos[0].value;
        await user.save();
      } else {
        // Create new user, default role student
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          photoUrl: profile.photos[0].value,
          role: "student"
        });
      }
    }
    // Log login event
    console.log(`[Google] User login: ${user.email}`);
    return done(null, user);
  } catch (err) {
    console.error("Google OAuth error:", err);
    return done(err, null);
  }
}));

// Facebook OAuth (Advanced)
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/facebook/callback",
  profileFields: ["id", "displayName", "photos", "email"]
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
      user = await User.findOne({ email: profile.emails?.[0]?.value });
      if (user) {
        user.facebookId = profile.id;
        user.photoUrl = profile.photos?.[0]?.value;
        await user.save();
      } else {
        user = await User.create({
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          photoUrl: profile.photos?.[0]?.value,
          role: "student"
        });
      }
    }
    console.log(`[Facebook] User login: ${user.email}`);
    return done(null, user);
  } catch (err) {
    console.error("Facebook OAuth error:", err);
    return done(err, null);
  }
}));

// GitHub OAuth (Advanced)
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/github/callback",
  scope: ["user:email"]
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      const email = profile.emails?.[0]?.value || "";
      user = await User.findOne({ email });
      if (user) {
        user.githubId = profile.id;
        user.photoUrl = profile.photos?.[0]?.value;
        await user.save();
      } else {
        user = await User.create({
          githubId: profile.id,
          name: profile.displayName || profile.username,
          email,
          photoUrl: profile.photos?.[0]?.value,
          role: "student"
        });
      }
    }
    console.log(`[GitHub] User login: ${user.email}`);
    return done(null, user);
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    return done(err, null);
  }
}));
// Routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use('/api', instructorRoute);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/discussion', discussionRoute);
app.use('/api/v1/comment', commentRoute);

// Social login routes (all providers)

// Google
app.get("/api/v1/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/api/v1/auth/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login" }), async (req, res) => {
  try {
    // Token expires in 7 days, use userId and role for consistency
    const token = jwt.sign({ userId: req.user._id, role: req.user.role || "student" }, process.env.SECRET_KEY, { expiresIn: "7d" });
    res.redirect(`http://localhost:5173/social-success?token=${token}&userId=${req.user._id}`);
  } catch (err) {
    console.error("Google callback error:", err);
    res.redirect("http://localhost:5173/login?error=social_login_failed");
  }
});

// Facebook
app.get("/api/v1/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
app.get("/api/v1/auth/facebook/callback", passport.authenticate("facebook", { session: false, failureRedirect: "/login" }), async (req, res) => {
  try {
    const token = jwt.sign({ userId: req.user._id, role: req.user.role || "student" }, process.env.SECRET_KEY, { expiresIn: "7d" });
    res.redirect(`http://localhost:5173/social-success?token=${token}&userId=${req.user._id}`);
  } catch (err) {
    console.error("Facebook callback error:", err);
    res.redirect("http://localhost:5173/login?error=social_login_failed");
  }
});

// GitHub
app.get("/api/v1/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/api/v1/auth/github/callback", passport.authenticate("github", { session: false, failureRedirect: "/login" }), async (req, res) => {
  try {
    const token = jwt.sign({ userId: req.user._id, role: req.user.role || "student" }, process.env.SECRET_KEY, { expiresIn: "7d" });
    res.redirect(`http://localhost:5173/social-success?token=${token}&userId=${req.user._id}`);
  } catch (err) {
    console.error("GitHub callback error:", err);
    res.redirect("http://localhost:5173/login?error=social_login_failed");
  }
});

// Each route: robust error handling, user linking, role assignment, logging, token expiry, and clear comments for maintainability

// Start server
app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
});
