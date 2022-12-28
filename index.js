const schemas = require("./db/schema");
const { connect, mongoose } = require("./db/index");
const fs = require('fs');
const https = require('https');

const {
  getAllItemHandler,
  getItemLocationHistoryHandler,
  getItemActionHistoryHandler,
  postItemHandler,
  updateItemLocationHandler,
  updateItemActionHistoryHandler,
} = require("./handlers");

const express = require("express");
const HTTPS_PORT = 443;
const HTTP_PORT = 80;
const TESTING_PORT = 80;
const CORS_HEADER = "Access-Control-Allow-Origin";
const CORS_TARGET = "*";
const CONTENT_HEADER = "Access-Control-Allow-Headers";
const HEADER = "Content-Type, Authorization";

// const privateKey  = fs.readFileSync('/etc/letsencrypt/live/xemelgo-server.yichi-zhang.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/xemelgo-server.yichi-zhang.com/fullchain.pem', 'utf8');

// const httpsCredentials = {
//   key: privateKey,
//   cert: certificate
// }

const app = express();

const itemTableModel = mongoose.model("Item", schemas.Item);
const locationHistoryTableModel = mongoose.model(
  "LocationHistory",
  schemas.LocationHistory
);
const actionHistoryTableModel = mongoose.model(
  "ActionHistory",
  schemas.ActionHistory
);

const RequestWrapper = (handler, SchemaAndDBForwarder) => {
  return (req, res) => {
    handler(req, res, SchemaAndDBForwarder);
  };
};

const UpdateRequestWrapper = (
  handler,
  itemTableSchemda,
  associatedTableSchema
) => {
  return (req, res) => {
    handler(req, res, itemTableSchemda, associatedTableSchema);
  };
};

app.use(express.json());
app.use((req, res, next) => {
  res.header(CORS_HEADER, CORS_TARGET);
  res.header(CONTENT_HEADER, HEADER);
  next();
});

app.get("/", (req, res) => {
  res.send("hello!");
});
app.get("/get-all-items", RequestWrapper(getAllItemHandler, itemTableModel));
app.get(
  "/get-location-history",
  RequestWrapper(getItemLocationHistoryHandler, locationHistoryTableModel)
);
app.get(
  "/get-action-history",
  RequestWrapper(getItemActionHistoryHandler, actionHistoryTableModel)
);
app.post(
  "/add-item",
  UpdateRequestWrapper(
    postItemHandler,
    itemTableModel,
    locationHistoryTableModel
  )
);
app.post(
  "/update-location-history",
  UpdateRequestWrapper(
    updateItemLocationHandler,
    itemTableModel,
    locationHistoryTableModel
  )
);
app.post(
  "/update-action-history",
  UpdateRequestWrapper(
    updateItemActionHistoryHandler,
    itemTableModel,
    actionHistoryTableModel
  )
);

app.listen(TESTING_PORT, () => {
  connect();
  mongoose.connection
    .on("error", console.error)
    .on("disconnected", connect)
    .once("open", () => {
      console.log(`server is running at port ${TESTING_PORT}`);
    });
})

// const httpsServer = https.createServer(httpsCredentials, app)

// httpsServer.listen(HTTPS_PORT, () => {
//   connect();
//   mongoose.connection
//     .on("error", console.error)
//     .on("disconnected", connect)
//     .once("open", () => {
//       console.log(`server is running at port ${HTTPS_PORT}`);
//     });
// });

