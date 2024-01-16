import userService from "../services/userService.js";

const userController = {
  register: async (req, res) => {
    try {
      const newUser = await userService.register(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },

  login: async (req, res) => {
    try {
      const user = await userService.login(req.body);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },

  updateUser: async (req, res) => {
    try {
      const updatedUser = await userService.updateUser(req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
};

export default userController;
