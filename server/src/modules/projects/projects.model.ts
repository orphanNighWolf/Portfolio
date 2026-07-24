import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  shortDescription: string;
  problemStatement: string;
  solution: string; // markdown
  challenges: string; // markdown
  futureImprovements: string; // markdown
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  gallery: string[]; // Cloudinary URLs
  videos: string[];
  architectureImages: string[]; // Cloudinary URLs
  featured: boolean;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    shortDescription: { type: String, required: true },
    problemStatement: { type: String, required: true },
    solution: { type: String, required: true },
    challenges: { type: String, required: true },
    futureImprovements: { type: String, required: true },
    techStack: [{ type: String, required: true, trim: true }],
    githubUrl: { type: String },
    liveDemoUrl: { type: String },
    gallery: [{ type: String }],
    videos: [{ type: String }],
    architectureImages: [{ type: String }],
    featured: { type: Boolean, default: false },
    status: { type: String, required: true, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true, collection: "projects" }
);

// Pre-save hook to generate unique slug from title
ProjectSchema.pre<IProject>("save", async function (next) {
  if (!this.isModified("title") && this.slug) {
    return next();
  }

  let baseSlug = this.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (!baseSlug) {
    baseSlug = "project";
  }

  let slug = baseSlug;
  let counter = 1;
  const selfId = this._id;

  while (true) {
    const existing = await mongoose.models.Project.findOne({
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

ProjectSchema.index(
  {
    title: "text",
    shortDescription: "text",
    problemStatement: "text",
    category: "text",
    tags: "text",
  },
  {
    weights: {
      title: 10,
      category: 5,
      tags: 3,
      shortDescription: 2,
      problemStatement: 1,
    },
    name: "ProjectTextIndex",
  }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
