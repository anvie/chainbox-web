const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AccountModel = new Schema({
  telegramId: { type: Number, required: true, index: { unique: true }},
  ethAddress: { type: String },
  telegramName: { type: String },
  telegramFullName: { type: String },
  timestamp: { type: Number, required: true },
  meta: { type: Object, default: {} },
})

const Account =
  mongoose.models.Account || mongoose.model("Account", AccountModel)

export { Account }

