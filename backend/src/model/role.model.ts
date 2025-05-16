import mongoose from "mongoose";

export const Role = mongoose.model(
  "role",
  new mongoose.Schema({
    name: String,
    id: String,
  })
);
