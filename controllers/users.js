const userSchema = require("../models/users");
const db = require("../db/connection");

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const getUsers = async (req, res) => {
  try {
    const post = await userSchema.find();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await userSchema.findById(id);
    if (post) {
      return res.json(post);
    }
    res.status(404).json({ message: "Request not found!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const post = await new userSchema(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  await userSchema.findByIdAndUpdate(
    id,
    req.body,
    { new: true },
    (error, post) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (!post) {
        return res.status(404).json({ message: "Request not found!" });
      }
      res.status(200).json(post);
    }
  );
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userSchema.findByIdAndDelete(id);
    if (deleted) {
      return res.status(200).send("Request deleted");
    }
    throw new Error("Request not found");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await userSchema.find({ username: req.body.username });
    if (user[0].password === req.body.password) {
      res.json(user[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  login,
};
