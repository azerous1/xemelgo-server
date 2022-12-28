const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoEndPoint = "mongodb://xemelgo-db:27017/xemelgo-db?directConnection=true";
const TESTING = true;

const connect = async () => {
  if (TESTING) {
    console.log("Connecting to a mock db for testing purposes.");

    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } else {
    await mongoose
      .connect(mongoEndPoint, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Now connected to MongoDB!"))
      .catch((err) =>
        console.error("Something went wrong when connecting to the db: ", err)
      );
  }
};

module.exports = { connect, mongoose };
