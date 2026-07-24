import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, default: "" },
  },
  { timestamps: true }
);

const bookingSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, required: true },
    preferredDate: { type: String, required: true },
    time: { type: String, required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const testimonialSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  avatarUrl: { type: String, default: "" },
});

const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const configSchema = new Schema(
  {
    testimonials: [testimonialSchema],
    faqs: [faqSchema],
  },
  { timestamps: true, collection: "mentorship_config" }
);

export const MentorshipService = model("MentorshipService", serviceSchema);
export const MentorshipBooking = model("MentorshipBooking", bookingSchema);
export const MentorshipConfig = model("MentorshipConfig", configSchema);
