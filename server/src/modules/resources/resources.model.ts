import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
  type: "note" | "pdf" | "template" | "cheatsheet" | "roadmap";
  title: string;
  slug: string;
  category: string;
  description: string;
  fileUrl: string; // Cloudinary raw PDF upload URL
  downloadCount: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["note", "pdf", "template", "cheatsheet", "roadmap"],
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fileUrl: { type: String, required: true, trim: true },
    downloadCount: { type: Number, default: 0, min: 0 },
    status: { type: String, required: true, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true, collection: "resources" }
);

ResourceSchema.pre<IResource>("save", async function (next) {
  if (!this.isModified("title") && this.slug) {
    return next();
  }

  let baseSlug = this.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (!baseSlug) {
    baseSlug = "resource";
  }

  let slug = baseSlug;
  let counter = 1;
  const selfId = this._id;

  while (true) {
    const existing = await mongoose.models.Resource.findOne({
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

ResourceSchema.index(
  {
    title: "text",
    description: "text",
    category: "text",
  },
  {
    weights: {
      title: 10,
      category: 5,
      description: 2,
    },
    name: "ResourceTextIndex",
  }
);

export const Resource = mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);
