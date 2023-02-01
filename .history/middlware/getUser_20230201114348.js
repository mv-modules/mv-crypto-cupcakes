const { User } = require("../db");

const getUser = async (req, res, next) => {
  try {
    if (req.oidc.user) {
      const [user, _isCreated] = await User.findOrCreate({
        where: {
          username: req.oidc.user.name,
          name: req.oidc.user.nickname,
          email: req.oidc.user.email,
        },
      });
      req.user = user;
    }
    next();
  } catch (error) {
    console.log("getUser", error);
    next(error);
  }
};

module.exports = getUser;
