import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationLogSchema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    messages: [messageSchema],
    metadata: {
      userAgent: { type: String, default: "" },
      referrer: { type: String, default: "" },
    },
  },
  { timestamps: true, collection: "conversation_logs" }
);

// Auto-expire old logs after 30 days
conversationLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const ConversationLog = model("ConversationLog", conversationLogSchema);

/**
 * Suggested starter questions (admin-editable via this array, or later via a DB doc).
 */
export const SUGGESTED_QUESTIONS = [
  "What projects have you built recently?",
  "Tell me about your tech stack and experience.",
  "What research topics are you working on?",
  "How can I book a mentorship session?",
  "What's your background and education?",
];
