import mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  authenticated: {type: Boolean, default: false},
  userid: mongoose.Schema.Types.ObjectId,
  expires: {type: Date, default: new Date("1970-01-01T00:00:00")},
});
const session: mongoose.Model<any> = mongoose.model("Session", sessionSchema);

export = session;
