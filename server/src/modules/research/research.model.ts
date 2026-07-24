import mongoose, { Schema, Document } from "mongoose";

export interface IResearch extends Document {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  readingTime: number;
  markdownContent: string;
  bookmarked: boolean;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const ResearchSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    readingTime: { type: Number, required: true, min: 0 },
    markdownContent: { type: String, required: true },
    bookmarked: { type: Boolean, default: false },
    status: { type: String, required: true, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true, collection: "research" }
);

ResearchSchema.pre<IResearch>("save", async function (next) {
  if (!this.isModified("title") && this.slug) {
    return next();
  }

  let baseSlug = this.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (!baseSlug) {
    baseSlug = "research";
  }

  let slug = baseSlug;
  let counter = 1;
  const selfId = this._id;

  while (true) {
    const existing = await mongoose.models.Research.findOne({
      slug,
      _id: { $ne: selfId },
    });
    
    if (!existing) {
      this.slug = slug;
      break;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  next();
});

ResearchSchema.index(
  {
    title: "text",
    markdownContent: "text",
    category: "text",
    tags: "text",
  },
  {
    weights: {
      title: 10,
      category: 5,
      tags: 3,
      markdownContent: 1,
    },
    name: "ResearchTextIndex",
  }
);

export const Research = mongoose.models.Research || mongoose.model<IResearch>("Research", ResearchSchema);
