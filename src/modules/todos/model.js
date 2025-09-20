const mongoose = require("mongoose");
const constant = require("../../constant");

const TodosSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true },
    status: { type: Number, enum: [1, 2, 3, 4], default: 1, index: true }, // Status: 1=pending, 2=in-progress, 3=completed, 4=archived
    priority: { type: Number, enum: [1, 2, 3, 4], default: 3, index: true }, // Priority: 1=low, 2=medium, 3=high, 4=critical
    dueDate: { type: Date, index: true },
    completedAt: { type: Date },
    labels: [{ type: String, trim: true, index: true }],
    subtasks: [
      {
        title: { type: String, trim: true },
        status: { type: String, enum: [1, 3], default: 1 },
      },
    ],
    sharedWith: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        name: String,
        email: String,
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId },
    lastUpdate: {
      type: Map,
      of: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

TodosSchema.index({ userId: 1, status: 1, priority: 1 });
TodosSchema.index({ dueDate: 1 });

module.exports = mongoose.model(constant.DB_MODEL_REF.TODO, TodosSchema);
