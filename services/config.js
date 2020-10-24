require("dotenv").config();

module.exports = {
  // Iota Payments
  seed: process.env.SEED,
  provider: process.env.PROVIDER,
  depth: process.env.DEPTH,
  minWeightMagnitude: process.env.MINWEIGHTMAGNITUDE,
  delay: process.env.DELAY,
  maxDepth: process.env.MAXDEPTH,
  timeSource: process.env.TIMESOURCE,

  // Page and Application information
  verifyToken: process.env.VERIFY_TOKEN,
  pageAccesToken: process.env.PAGE_ACCESS_TOKEN,

  // Page and Application information
  appSecret: process.env.APP_SECRET,

  // Preferred port (default to 3000)
  port: process.env.PORT || 3000,

  // Messenger Platform API
  mPlatformDomain: "https://graph.facebook.com",
  mPlatformVersion: "v3.2",

  get mPlatfom() {
    return this.mPlatformDomain + "/" + this.mPlatformVersion;
  },
};
