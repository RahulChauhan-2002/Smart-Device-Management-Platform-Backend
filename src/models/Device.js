import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["light", "fan", "ac", "smart_meter", "sensor"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "inactive", 
    },
    last_active_at: {
      type: Date,
      default: null,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Device", deviceSchema);
