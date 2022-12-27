const Schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const Item = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  itemName: { type: String, required: true },
  itemSolutionType: { type: String, required: true },
  location: { type: String, required: true },
  locationHistory: [
    { type: mongoose.Schema.Types.ObjectId, ref: "LocationHistory" },
  ],
  actionHistory: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ActionHistory" },
  ],
});

const LocationHistory = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const ActionHistory = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    userName: { type: String, require: true },
    action: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = { Item, LocationHistory, ActionHistory };
