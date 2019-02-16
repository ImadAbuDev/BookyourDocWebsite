import mongoose = require("mongoose");
// Define Schema describing slots
const slotSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  state: {
    type: String,
    enum: ["FREE", "BOOK_INT", "BOOK_EXT"],
    default: "FREE",
    required: true,
  },
  userid: mongoose.Schema.Types.ObjectId,
  docid: {type: mongoose.Schema.Types.ObjectId, required: true},
});
const slot: mongoose.Model<any> = mongoose.model("Slot", slotSchema);

export = slot;
