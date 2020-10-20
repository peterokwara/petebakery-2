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
};
