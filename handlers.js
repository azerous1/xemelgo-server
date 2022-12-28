const mongoose = require("mongoose");

// get all items from itemTable
const getAllItemHandler = async (req, res, itemTableModel) => {
  try {
    const items = await itemTableModel.find({});
    res.status(200).send(items);
  } catch (err) {
    res.status(500).send("Error in fetching items");
  }
};

// get past 6 location history for an item
const getItemLocationHistoryHandler = async (
  req,
  res,
  itemLocationTableModel
) => {
  const locationHistoryIds = JSON.parse(req.query.locationHistoryIds);

  try {
    const locationHistory = await itemLocationTableModel
      .find({ _id: locationHistoryIds })
      .sort({ createdAt: "desc" })
      .limit(6);
    res.status(200).send(locationHistory);
  } catch (err) {
    res.status(500).send("Error in fetching location history");
  }
};

// get past 6 action history for an item
const getItemActionHistoryHandler = async (req, res, itemActionTableModel) => {
  const actionHistoryIds = JSON.parse(req.query.actionHistoryIds);

  try {
    const actionHistory = await itemActionTableModel
      .find({ _id: actionHistoryIds })
      .sort({ createdAt: "desc" })
      .limit(6);
    res.status(200).send(actionHistory);
  } catch (err) {
    res.status(500).send("Error in fetching action history");
  }
};

// add an item to itemTable
const postItemHandler = async (
  req,
  res,
  itemTableModel,
  locationTableModel
) => {
  let newItem = req.body;
  const itemId = new mongoose.Types.ObjectId();
  newItem._id = itemId;

  const newItemEntry = new itemTableModel(newItem);
  try {
    await newItemEntry.save();
    // update location history table
    const newLocationHistoryEntryId = new mongoose.Types.ObjectId();
    const newLocationHistoryEntryObj = {
      _id: newLocationHistoryEntryId,
      itemId: itemId,
      location: req.body.location,
    };

    const newLocationEntry = new locationTableModel(newLocationHistoryEntryObj);
    await newLocationEntry.save();

    // update location entry to item 'locationHistory' field
    itemTableModel.findByIdAndUpdate(
      itemId,
      { $push: { locationHistory: newLocationHistoryEntryId } },
      (err, doc) => {
        console.log(doc);
      }
    );

    res.status(200).send("ok");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error in saving data to DB");
  }
};

// takes an item id, u
// update item location
// - update item location in itemTable
// - add a location history entry for an item
const updateItemLocationHandler = async (
  req,
  res,
  itemTableModel,
  locationTableModel
) => {
  const payload = JSON.parse(req.body.data);
  const { itemId } = payload;
  console.log("item id: ", itemId)
  const newLocationEntry = {
    location: payload.location,
    timestamp: payload.timestamp,
  };
  const newId = new mongoose.Types.ObjectId();
  newLocationEntry._id = newId;

  const query = new locationTableModel(newLocationEntry);
  await query.save((err, response) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error in saving data to DB");
      return;
    }
    res.status(201).send(response);
  });

  // // update newly inserted entry id to item table.
  itemTableModel.findByIdAndUpdate(
    itemId,
    { $push: { locationHistory: newId }, location: payload.location  },
    (err, doc) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error in update to item table");
      }
    }
  );
};

// update item action
// - add a action history entry for an item
const updateItemActionHistoryHandler = async (
  req,
  res,
  itemTableModel,
  actionTableModel
) => {
  const payload = JSON.parse(req.body.data);
  const { itemId } = payload;
  const newActionEntry = {
    userName: payload.userName,
    action: payload.action,
    timestamp: payload.timestamp,
  };
  const newId = new mongoose.Types.ObjectId();
  newActionEntry._id = newId;

  const query = new actionTableModel(newActionEntry);
  await query.save((err, response) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error in saving data to DB");
      return;
    }
    res.status(201).send(response);
  });

  itemTableModel.findByIdAndUpdate(
    itemId,
    { $push: { actionHistory: newId } },
    (err, doc) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error in update to item table");
      }
    }
  );
};

module.exports = {
  getAllItemHandler,
  getItemLocationHistoryHandler,
  getItemActionHistoryHandler,
  postItemHandler,
  updateItemLocationHandler,
  updateItemActionHistoryHandler,
};
