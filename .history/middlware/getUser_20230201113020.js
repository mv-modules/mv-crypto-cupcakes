const { User } = require("../db");

const getUser = async (req, res, next) => {
  const [user, _isCreated] = await User.findOrCreate({ where: {} });
};
