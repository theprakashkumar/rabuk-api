const { Schema, default: mongoose, model } = require("mongoose");

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

// compound indexing for fromUserId and toUserId as we are using this for searching
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
// pre save hook to check if the fromUserId is same as toUserId so that we can't send connection request to yourself
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
});

const ConnectionRequestModel = new model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = { ConnectionRequestModel };
