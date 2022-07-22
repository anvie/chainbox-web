const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PendingTxModel = new Schema({
  address: { type: String, required: true },
  tx: { type: String, required: true, index: { unique: true }},
  itemCount: { type: Number, required: true},
  ts: { type: Number, required: true },
})

const PendingTx =
  mongoose.models.PendingTx || mongoose.model("PendingTx", PendingTxModel)

export { PendingTx }

