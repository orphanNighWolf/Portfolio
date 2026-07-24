import { Request, Response, NextFunction } from "express";
import PDFDocument from "pdfkit";
import { ResumeData } from "./resume.model";
import { AppError } from "../../middleware/error";

export async function getResume(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let resume = await ResumeData.findOne();
    if (!resume) {
      // Return empty valid skeleton structure if not seeded
      resume = await ResumeData.create({
        personalInfo: {
          name: "Alex Mercer",
          email: "alex@mercer.com",
          title: "Senior Systems Engineer",
          summary: "Systems architect and developer specializing in low-latency infrastructure.",
        },
        experience: [],
        education: [],
        projects: [],
        skills: [],
        certificates: [],
      });
    }
    res.status(200).json({ status: "success", data: resume });
  } catch (error) {
    next(error);
  }
}

export async function updateResume(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let resume = await ResumeData.findOne();
    if (!resume) {
      resume = new ResumeData(req.body);
    } else {
      resume.personalInfo = req.body.personalInfo;
      resume.experience = req.body.experience;
      resume.education = req.body.education;
      resume.projects = req.body.projects;
      resume.skills = req.body.skills;
      resume.certificates = req.body.certificates;
    }
    await resume.save();
    res.status(200).json({ status: "success", data: resume });
  } catch (error) {
    next(error);
  }
}

export async function downloadResumePDF(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const resume = await ResumeData.findOne();
    if (!resume) {
      throw new AppError("Resume data is not populated yet", 404);
    }

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Set Response Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume_${resume.personalInfo.name.toLowerCase().replace(/\s+/g, "_")}.pdf`
    );

    // Stream PDF directly to client response
    doc.pipe(res);

    // Font styles
    const fontTitle = "Helvetica-Bold";
    const fontHeader = "Helvetica-Bold";
    const fontBody = "Helvetica";
    const fontItalic = "Helvetica-Oblique";

    // 1. Header Section
    doc.fillColor("#0284c7").font(fontTitle).fontSize(22).text(resume.personalInfo.name.toUpperCase(), { align: "center" });
    doc.fillColor("#475569").font(fontBody).fontSize(10).text(resume.personalInfo.title, { align: "center" });
    
    doc.moveDown(0.5);
    const contacts = [
      resume.personalInfo.email,
      resume.personalInfo.phone,
      resume.personalInfo.location,
      resume.personalInfo.website,
    ].filter(Boolean);
    
    doc.fontSize(8).text(contacts.join("  |  "), { align: "center" });
    
    if (resume.personalInfo.github) {
      doc.text(`GitHub: ${resume.personalInfo.github}`, { align: "center" });
    }

    doc.moveDown(1);
    doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // 2. Summary
    doc.fillColor("#0f172a").font(fontHeader).fontSize(11).text("PROFESSIONAL SUMMARY");
    doc.moveDown(0.3);
    doc.fillColor("#334155").font(fontBody).fontSize(9).text(resume.personalInfo.summary, { align: "left", lineGap: 3 });
    doc.moveDown(0.8);

    // Helper for Section Dividers
    const drawSectionDivider = (title: string) => {
      doc.moveDown(0.5);
      doc.fillColor("#0f172a").font(fontHeader).fontSize(11).text(title);
      doc.moveDown(0.3);
      doc.strokeColor("#cbd5e1").lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
    };

    // 3. Experience
    if (resume.experience && resume.experience.length > 0) {
      drawSectionDivider("PROFESSIONAL EXPERIENCE");
      resume.experience.forEach((exp: any) => {
        doc.fillColor("#0f172a").font(fontHeader).fontSize(9.5).text(`${exp.position} — ${exp.company}`, { continued: true });
        doc.fillColor("#64748b").font(fontItalic).fontSize(8.5).text(`  (${exp.startDate} - ${exp.endDate})`, { align: "right" });
        doc.moveDown(0.3);
        doc.fillColor("#334155").font(fontBody).fontSize(9).text(exp.description, { lineGap: 2 });
        doc.moveDown(0.8);
      });
    }

    // 4. Projects
    if (resume.projects && resume.projects.length > 0) {
      drawSectionDivider("SELECTED PROJECTS");
      resume.projects.forEach((proj: any) => {
        doc.fillColor("#0f172a").font(fontHeader).fontSize(9.5).text(proj.title, { continued: true });
        if (proj.role) {
          doc.fillColor("#64748b").font(fontItalic).fontSize(8.5).text(`  (${proj.role})`, { align: "right" });
        } else {
          doc.text("");
        }
        doc.moveDown(0.3);
        doc.fillColor("#334155").font(fontBody).fontSize(9).text(proj.description, { lineGap: 2 });
        if (proj.techStack && proj.techStack.length > 0) {
          doc.moveDown(0.2);
          doc.font(fontHeader).fontSize(8).fillColor("#0284c7").text(`Technologies: `, { continued: true });
          doc.font(fontBody).fillColor("#475569").text(proj.techStack.join(", "));
        }
        doc.moveDown(0.8);
      });
    }

    // 5. Education
    if (resume.education && resume.education.length > 0) {
      drawSectionDivider("EDUCATION");
      resume.education.forEach((edu: any) => {
        doc.fillColor("#0f172a").font(fontHeader).fontSize(9.5).text(`${edu.degree} in ${edu.fieldOfStudy}`, { continued: true });
        doc.fillColor("#64748b").font(fontItalic).fontSize(8.5).text(`  (${edu.startDate} - ${edu.endDate})`, { align: "right" });
        doc.moveDown(0.2);
        doc.fillColor("#334155").font(fontBody).fontSize(9).text(edu.institution);
        doc.moveDown(0.8);
      });
    }

    // 6. Skills
    if (resume.skills && resume.skills.length > 0) {
      drawSectionDivider("SKILLS & KEY COMPETENCIES");
      const categories: { [key: string]: string[] } = {};
      resume.skills.forEach((sk: any) => {
        if (!categories[sk.category]) {
          categories[sk.category] = [];
        }
        categories[sk.category].push(sk.name);
      });

      Object.keys(categories).forEach((cat) => {
        doc.fillColor("#0f172a").font(fontHeader).fontSize(9).text(`${cat}: `, { continued: true });
        doc.fillColor("#334155").font(fontBody).fontSize(9).text(categories[cat].join(", "));
        doc.moveDown(0.4);
      });
    }

    // 7. Certificates
    if (resume.certificates && resume.certificates.length > 0) {
      drawSectionDivider("CERTIFICATIONS");
      resume.certificates.forEach((cert: any) => {
        doc.fillColor("#0f172a").font(fontHeader).fontSize(9).text(cert.name, { continued: true });
        doc.fillColor("#64748b").font(fontItalic).fontSize(8.5).text(`  (${cert.date})`, { align: "right" });
        doc.moveDown(0.2);
        doc.fillColor("#334155").font(fontBody).fontSize(8.5).text(cert.issuer);
        doc.moveDown(0.4);
      });
    }

    doc.end();
  } catch (error) {
    next(error);
  }
}
