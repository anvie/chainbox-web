const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// berbeda dengan model Eligible, ini untuk manual address
// tidak mengharuskan ada telegramId-nya
// kedepannya nanti bisa dimigrasi ke Eligible apabila telegramId sudah diset
// model ini hanya untuk mengakali whitelist manual disetkan oleh orang lain
const EligibleAddressModel = new Schema({
  address: { type: String, required: true, index: { unique: true } },
  telegramId: { type: Number, default: 0 },
  telegramName: { type: String, default: "" },
  telegramFullName: { type: String, default: "" },
  eligible: { type: Boolean, default: false },
  discount: { type: Boolean, default: false },
  claimed: { type: Boolean, default: false },
  timestamp: { type: Number, required: true },
  meta: { type: Object, default: {} },
});

const EligibleAddress =
  mongoose.models.EligibleAddress ||
  mongoose.model("EligibleAddress", EligibleAddressModel);

export { EligibleAddress };

