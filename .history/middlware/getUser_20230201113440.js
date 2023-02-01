const { User } = require("../db");

const getUser = async (req, res, next) => {
  const [user, _isCreated] = await User.findOrCreate({
    where: {
      username: req.oidc.user.name,
      name: req.oidc.user.nickname,
      email: req.oidc.user.email,
    },
  });
};

module.exports = { getUser };
