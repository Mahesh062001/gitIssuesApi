const { Clerk } = require("@clerk/clerk-sdk-node");
const clerkConfig = require({
  apiKey: process.env.CLERK_SECRET_KEY,
  frontendApi: process.env.CLERK_FRONTEND_API_KEY,
});
const clerk = new Clerk(clerkConfig);
const authenticate = async (req, res, next) => {
  try {
    const { data } = await clerk.getSession({ req });
    req.user = data;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
module.exports = authenticate;
