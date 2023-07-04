const mongoose = require("mongoose");
const validator = require("validator");

const shiftSchema = mongoose.Schema({
    shift_name: { type: String, required: true, trim: true, unique: true },
    in_time: { type: String, required: true, trim: true },
    out_time: { type: String, required: true, trim: true }
}, {
    timestamps: true,
})

const shiftModel = mongoose.model("shifts", shiftSchema);
module.exports = { shiftModel }