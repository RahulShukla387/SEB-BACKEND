

// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import User from "../models/User.js";
// export default function(passport) {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: process.env.GOOGLE_CALLBACK_URL,
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           let user = await User.findOne({ googleId: profile.id });

//           if (!user) {
//             user = await User.create({
//               googleId: profile.id,
//               name: profile.displayName,
//               email: profile.emails?.[0]?.value || "",
//              role: profile.emails[0].value === "sebmmmut.info@gmail.com" ? "admin" : "user",
//               profilePic: profile.photos?.[0]?.value || "",
//             });
//           }

//           return done(null, user);
//         } catch (err) {
//           return done(err, null);
//         }
//       }
//     )
//   );

//   passport.serializeUser((user, done) => done(null, user.id));
//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await User.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err, null);
//     }
//   });
// }

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

export default function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value || "",
              role:
                profile.emails?.[0]?.value === "sebmmmut.info@gmail.com"
                  ? "admin"
                  : "user",
              profilePic: profile.photos?.[0]?.value || "",
            });
          }

          // ✅ Just return user — JWT will be generated later in callback route
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}
