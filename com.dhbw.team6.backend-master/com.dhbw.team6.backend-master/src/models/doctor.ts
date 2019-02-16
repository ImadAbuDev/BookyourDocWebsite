import mongoose = require("mongoose");
// Define Schema describing a doctor
const docSchema = new mongoose.Schema({
  visible: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  field: { type: String, required: true },
  contact: {
    mail: String,
    phone: String,
  },
  address: {
    name: String,
    street: String,
    number: String,
    zip: String,
    city: String,
    country: { type: String, default: "DE" },
  },
  default_time: { type: Number, default: 30},
});
const doctor: mongoose.Model<any> = mongoose.model("Doctor", docSchema);

export = doctor;
