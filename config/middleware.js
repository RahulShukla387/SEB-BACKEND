
//  //todo isLoggedIn() authentication.
// function isLoggedIn(req, res, next){
//   if(req.isAuthenticated()) return next();
//   res.redirect("/login");
// }


// function isAdmin(req, res, next) {
//   if (req.isAuthenticated() && req.user.role === "admin") {
//     return next();
//   }
//   res.status(403).send("Access denied");
// }
// export { isAdmin, isLoggedIn };

//todo Auth through jwt

import { verifyToken } from "./jwt.js";

export function isLoggedIn(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin")
    return res.status(403).json({ error: "Access denied" });
  next();
}