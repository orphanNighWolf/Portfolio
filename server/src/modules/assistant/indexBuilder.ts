/**
 * Knowledge index builder.
 * Pulls content from Projects, Blogs, Research, and Resume,
 * chunks it, generates embeddings, and loads into the vector store.
 */

import { Project } from "../projects/projects.model";
import { Blog } from "../blogs/blogs.model";
import { Research } from "../research/research.model";
import { ResumeData } from "../resume/resume.model";
import { chunkText, stripMarkdown, KnowledgeChunk } from "./chunker";
import { generateEmbeddings } from "./llmProvider";
import { setStore, getStoreSize } from "./vectorStore";

let lastIndexedAt: Date | null = null;
let isIndexing = false;

export function getIndexStatus(): { lastIndexedAt: Date | null; chunkCount: number; isIndexing: boolean } {
  return { lastIndexedAt, chunkCount: getStoreSize(), isIndexing };
}

/**
 * Build the knowledge index from all portfolio content.
 */
export async function buildKnowledgeIndex(): Promise<{ chunkCount: number }> {
  if (isIndexing) {
    return { chunkCount: getStoreSize() };
  }

  isIndexing = true;

  try {
    const chunks: KnowledgeChunk[] = [];

    // 1. Index Projects
    const projects = await Project.find({ status: "published" }).lean();
    for (const project of projects) {
      const textParts = [
        `Project: ${project.title}`,
        project.shortDescription || "",
        stripMarkdown(project.solution || ""),
        stripMarkdown(project.problemStatement || ""),
        stripMarkdown(project.challenges || ""),
        stripMarkdown(project.futureImprovements || ""),
        `Tech Stack: ${(project.techStack || []).join(", ")}`,
        `Category: ${project.category || ""}`,
        `Tags: ${(project.tags || []).join(", ")}`,
      ].filter(Boolean).join("\n\n");

      const textChunks = chunkText(textParts);
      for (let i = 0; i < textChunks.length; i++) {
        chunks.push({
          id: `project-${(project as any)._id}-${i}`,
          source: "project",
          sourceId: project.slug || (project as any)._id.toString(),
          sourceTitle: project.title,
          content: textChunks[i],
          embedding: [],
        });
      }
    }

    // 2. Index Blogs
    const blogs = await Blog.find({ status: "published" }).lean();
    for (const blog of blogs) {
      const textParts = [
        `Blog Post: ${blog.title}`,
        stripMarkdown(blog.markdownContent || ""),
        `Category: ${blog.category || ""}`,
        `Tags: ${(blog.tags || []).join(", ")}`,
      ].filter(Boolean).join("\n\n");

      const textChunks = chunkText(textParts);
      for (let i = 0; i < textChunks.length; i++) {
        chunks.push({
          id: `blog-${(blog as any)._id}-${i}`,
          source: "blog",
          sourceId: blog.slug || (blog as any)._id.toString(),
          sourceTitle: blog.title,
          content: textChunks[i],
          embedding: [],
        });
      }
    }

    // 3. Index Research
    const research = await Research.find({ status: "published" }).lean();
    for (const paper of research) {
      const textParts = [
        `Research: ${paper.title}`,
        stripMarkdown(paper.markdownContent || ""),
        `Category: ${paper.category || ""}`,
        `Tags: ${(paper.tags || []).join(", ")}`,
      ].filter(Boolean).join("\n\n");

      const textChunks = chunkText(textParts);
      for (let i = 0; i < textChunks.length; i++) {
        chunks.push({
          id: `research-${(paper as any)._id}-${i}`,
          source: "research",
          sourceId: paper.slug || (paper as any)._id.toString(),
          sourceTitle: paper.title,
          content: textChunks[i],
          embedding: [],
        });
      }
    }

    // 4. Index Resume
    const resume = await ResumeData.findOne().lean();
    if (resume) {
      const resumeParts: string[] = [];

      if (resume.personalInfo) {
        resumeParts.push(
          `Resume — ${resume.personalInfo.name || ""}`,
          `Title: ${resume.personalInfo.title || ""}`,
          resume.personalInfo.summary || ""
        );
      }

      if (resume.experience && Array.isArray(resume.experience)) {
        for (const exp of resume.experience as any[]) {
          resumeParts.push(
            `Experience: ${exp.position || ""} at ${exp.company || ""} (${exp.startDate || ""} - ${exp.endDate || ""}). ${exp.description || ""}`
          );
        }
      }

      if (resume.education && Array.isArray(resume.education)) {
        for (const edu of resume.education as any[]) {
          resumeParts.push(
            `Education: ${edu.degree || ""} in ${edu.fieldOfStudy || ""} at ${edu.institution || ""}`
          );
        }
      }

      if (resume.skills && Array.isArray(resume.skills)) {
        resumeParts.push(`Skills: ${(resume.skills as any[]).map((s) => s.name || s).join(", ")}`);
      }

      const resumeText = resumeParts.filter(Boolean).join("\n\n");
      const textChunks = chunkText(resumeText);
      for (let i = 0; i < textChunks.length; i++) {
        chunks.push({
          id: `resume-${i}`,
          source: "resume",
          sourceId: "resume",
          sourceTitle: "Resume / Background",
          content: textChunks[i],
          embedding: [],
        });
      }
    }

    // 5. Generate embeddings (if API key available)
    if (chunks.length > 0) {
      try {
        const texts = chunks.map((c) => c.content);
        const embeddings = await generateEmbeddings(texts);
        for (let i = 0; i < chunks.length; i++) {
          chunks[i].embedding = embeddings[i] || [];
        }
      } catch (err: any) {
        console.warn("Embedding generation failed, falling back to keyword search:", err.message);
        // Chunks will have empty embeddings — vectorStore.searchByKeyword will be used
      }
    }

    // 6. Load into store
    setStore(chunks);
    lastIndexedAt = new Date();

    console.log(`Knowledge index built: ${chunks.length} chunks from ${projects.length} projects, ${blogs.length} blogs, ${research.length} research papers, and resume.`);

    return { chunkCount: chunks.length };
  } finally {
    isIndexing = false;
  }
}
